import { NextRequest } from "next/server";
import Classs from "@/lib/models/class.model";

import { asyncHandler } from "@/lib/middleware/asyncHandler";
import { withAuth } from "@/lib/middleware/withAuth";
import { NextResponse } from "next/server";

export const GET = withAuth(
  asyncHandler(async (req: NextRequest, user: any) => {
    const teacherId = req.nextUrl.pathname.split("/").pop();
    if (!teacherId)
      return NextResponse.json(
        { message: "Teacher ID required" },
        { status: 400 }
      );

    // Authorization
    if (
      user.role !== "admin" &&
      !(user.role === "teacher" && user._id === teacherId)
    ) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    const classes = await Classs.find({ teacher: teacherId }).populate(
      "students",
      "_id username email"
    );

    const totalClasses = classes.length;
    const allStudentIds = classes.flatMap((cls) =>
      cls.students.map((s: { _id: { toString: () => any } }) =>
        s._id.toString()
      )
    );
    const uniqueStudentIds = [...new Set(allStudentIds)];

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
