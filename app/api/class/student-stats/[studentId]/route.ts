// import { NextRequest } from "next/server";
// import Classs from "@/lib/models/class.model";
// import Assignment from "@/lib/models/assignment.model";
// import MCQ from "@/lib/models/mcq.model";
// import { asyncHandler } from "@/lib/middleware/asyncHandler";
// import { withAuth } from "@/lib/middleware/withAuth";
// import { NextResponse } from "next/server";

// export const GET = withAuth(
//   asyncHandler(async (req: NextRequest, user: any) => {
//     const studentId = req.nextUrl.pathname.split("/").pop();
//     if (!studentId)
//       return NextResponse.json(
//         { message: "Student ID required" },
//         { status: 400 }
//       );

//     if (
//       user.role !== "admin" &&
//       !(user.role === "student" && user._id === studentId)
//     ) {
//       return NextResponse.json({ message: "Not authorized" }, { status: 403 });
//     }

//     const classes = await Classs.find({ students: studentId })
//       .populate("teacher", "_id profile.firstName profile.lastName email role")
//       .populate("students", "_id username email");

//     const totalClasses = classes.length;

//     const classIds = classes.map((cls) => cls._id);

//     const totalAssignments = await Assignment.countDocuments({
//       class: { $in: classIds },
//     });
//     const totalQuizzes = await MCQ.countDocuments({
//       classId: { $in: classIds },
//     });

//     const enrolledClasses = classes.map((cls) => ({
//       classId: cls._id,
//       className: cls.name,
//       section: cls.section,
//       grade: cls.grade,
//       roomNo: cls.roomNo,
//       subject: cls.subjects,
//       schedule: cls.schedule,
//       time: cls.time,
//       totalStudents: cls.students.length,
//       teacher: {
//         id: cls.teacher?._id || null,
//         name: cls.teacher
//           ? `${cls.teacher.profile.firstName} ${cls.teacher.profile.lastName}`
//           : "Unknown",
//         email: cls.teacher?.email || "N/A",
//       },
//     }));

//     return NextResponse.json({
//       success: true,
//       totalClasses,
//       totalAssignments,
//       totalQuizzes,
//       enrolledClasses,
//     });
//   })
// );
