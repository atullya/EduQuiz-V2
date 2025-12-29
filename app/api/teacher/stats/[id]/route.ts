import { asyncHandler } from "@/lib/middleware/asyncHandler";
import { withAuth } from "@/lib/middleware/withAuth";
import { NextRequest, NextResponse } from "next/server";
import Classs from "@/lib/models/class.model";
import { APIError } from "@/lib/middleware/APIError";

const getIdFromUrl = (req: NextRequest) => {
  return req.nextUrl.pathname.split("/").pop();
};

export const GET = withAuth(
  asyncHandler(async (req: NextRequest, user: any) => {
    const teacherId = getIdFromUrl(req);

    if (
      user.role !== "admin" &&
      !(user.role === "teacher" && user._id.toString() === teacherId)
    )
      throw new APIError("Not authroized", 403);

    const classes = await Classs.find({ teacher: teacherId }).populate(
      "students",
      "_id username email"
    );

    const totalClasses = classes.length;

    const uniqueStudentIds = [
      ...new Set(
        classes.flatMap((cls) =>
          cls.students.map((student: any) => student._id.toString())
        )
      ),
    ];

    const classStudentCounts = classes.map((cls) => ({
      classId: cls._id,
      className: cls.name,
      section: cls.section,
      grade: cls.grade,
      roomNo: cls.roomNo,
      subject: cls.subjects,
      time: cls.time,
      schedule: cls.schedule,
      studentCount: cls.students.length,
    }));

    return NextResponse.json({
      totalClasses,
      totalUniqueStudents: uniqueStudentIds.length,
      classStudentCounts,
    });
  })
);
