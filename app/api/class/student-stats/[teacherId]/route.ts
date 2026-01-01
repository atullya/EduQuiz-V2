import { NextRequest } from "next/server";
import Classs from "@/lib/models/class.model";
import Assignment from "@/lib/models/assignment.model";
import MCQ from "@/lib/models/MCQ.model";
import { asyncHandler } from "@/lib/middleware/asyncHandler";
import { withAuth } from "@/lib/middleware/withAuth";
import { successResponse } from "@/lib/utils/responseHandler";
import { APIError } from "@/lib/middleware/APIError";

export const GET = withAuth(
  asyncHandler(async (req: NextRequest, user: any) => {
    const studentId = req.nextUrl.pathname.split("/").pop();

    if (!studentId) {
      throw new APIError("Student ID is required", 400);
    }

    if (user.role !== "student" && user._id !== studentId) {
      throw new APIError("Not authorized", 403);
    }

    const classes = await Classs.find({ students: studentId })
      .populate("teacher", "profile.firstName profile.lastName email")
      .populate("students", "_id username email");

    const result = await Promise.all(
      classes.map(async (cls) => {
        const assignmentCount = await Assignment.countDocuments({
          class: cls._id,
        });

        const quizCount = await MCQ.countDocuments({
          class: cls._id,
          status: "published",
        });

        return {
          classId: cls._id,
          className: cls.name,
          section: cls.section,
          grade: cls.grade,
          roomNo: cls.roomNo,
          subject: cls.subjects,
          schedule: cls.schedule,
          time: cls.time,
          teacher: {
            id: cls.teacher?._id || null,
            name: `${cls.teacher?.profile?.firstName || ""} ${
              cls.teacher?.profile?.lastName || ""
            }`.trim(),
            email: cls.teacher?.email || "N/A",
          },
          studentCount: cls.students.length,
          assignmentCount,
          quizCount,
        };
      })
    );

    const totalAssignments = result.reduce(
      (sum, c) => sum + c.assignmentCount,
      0
    );

    const totalQuizzes = result.reduce((sum, c) => sum + c.quizCount, 0);

    return successResponse(
      {
        totalClasses: result.length,
        totalAssignments,
        totalQuizzes,
        classes: result,
      },
      200
    );
  })
);
