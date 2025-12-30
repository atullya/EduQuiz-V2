import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware/withAuth";
import { asyncHandler } from "@/lib/middleware/asyncHandler";
import { APIError } from "@/lib/middleware/APIError";
import Assignment from "@/lib/models/assignment.model";
import { successResponse } from "@/lib/utils/responseHandler";
export const GET = withAuth(
  asyncHandler(async (req: NextRequest, user) => {
    const id = req.nextUrl.pathname.split("/").pop();

    const assignment = await Assignment.findById(id)
      .populate({
        path: "submissions.student",
        select: "username email profile.firstName profile.lastName",
      })
      .populate({
        path: "class",
        populate: {
          path: "students",
          select: "username email profile.firstName profile.lastName",
        },
      })
      .populate({
        path: "teacher",
        select: "username email",
      });

    if (!assignment) {
      throw new APIError("Assignment not found", 404);
    }

    if (
      user.role !== "admin" &&
      !(
        user.role === "teacher" &&
        assignment.teacher._id.toString() === user._id.toString()
      )
    ) {
      throw new APIError("Not authorized", 403);
    }

    const submittedStudentIds = assignment.submissions.map((sub: any) =>
      sub.student._id.toString()
    );

    const allStudents = assignment.class.students;

    const submissions = assignment.submissions.map((sub: any) => ({
      student: sub.student,
      submissionText: sub.submissionText,
      submissionFile: sub.submissionFile,
      fileName: sub.fileName,
      submittedAt: sub.submittedAt,
      feedback: sub.feedback,
    }));

    const notSubmitted = allStudents.filter(
      (student: any) => !submittedStudentIds.includes(student._id.toString())
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          assignmentTitle: assignment.title,
          totalStudents: allStudents.length,
          submittedCount: submissions.length,
          submissions,
          notSubmitted,
        },
      },
      { status: 200 }
    );
  })
);
