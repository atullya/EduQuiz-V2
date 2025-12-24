// app/api/class/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { asyncHandler } from "@/lib/middleware/asyncHandler";
import Classs from "@/lib/models/class.model";
import moment from "moment";
import { APIError } from "@/lib/middleware/APIError";
import { successResponse } from "@/lib/utils/responseHandler";

import { withAdmin } from "@/lib/middleware/withAdmin";

export const POST = withAdmin(
  asyncHandler(async (req: NextRequest, user: any) => {
    const body = await req.json();
    const {
      name,
      section,
      grade,
      capacity,
      maxStudents,
      roomNo,
      time,
      schedule,
      status,
      teacher,
      students = [],
      subjects,
    } = body;

    if (!name || !grade || !section)
      throw new APIError("Class name, grade & section are required", 400);

    if (!Array.isArray(subjects) || subjects.length < 1)
      throw new APIError("At least one subject must be provided", 400);

    const exist = await Classs.findOne({ name, grade, section });
    if (exist)
      throw new APIError(
        `Class already exists → Grade ${grade} Section ${section} (${name})`,
        400
      );

    // teacher validation & time conflict (same as before)
    let teacherUser = null;
    if (teacher) {
      teacherUser = await Classs.findOne({ _id: teacher });
      if (!teacherUser) throw new APIError("Invalid teacher ID", 400);

      if (time && schedule) {
        const [newStart, newEnd] = time
          .split("-")
          .map((t: moment.MomentInput) => moment(t, "HH:mm"));
        const teacherClasses = await Classs.find({ teacher });
        const conflict = teacherClasses.some((cls) => {
          if (!cls.time || !cls.schedule) return false;
          const dayOverlap = cls.schedule.some((day: any) =>
            schedule.includes(day)
          );
          if (!dayOverlap) return false;
          const [existingStart, existingEnd] = cls.time
            .split("-")
            .map((t: moment.MomentInput) => moment(t, "HH:mm"));
          return (
            newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart)
          );
        });
        if (conflict)
          throw new APIError(
            "Time conflict: Teacher already assigned at this time",
            400
          );
      }
    }

    // students validation
    let validStudents = [];
    if (students.length > 0) {
      validStudents = await Classs.find({ _id: { $in: students } });
      if (validStudents.length !== students.length)
        throw new APIError("One or more student IDs are invalid", 400);
    }

    const newClass = await Classs.create({
      name,
      section,
      grade,
      capacity,
      maxStudents,
      roomNo,
      time,
      schedule,
      status,
      teacher: teacher || null,
      students: validStudents.map((s) => s._id),
      subjects,
    });

    return successResponse(
      { message: "Class created successfully", class: newClass },
      201
    );
  })
);
