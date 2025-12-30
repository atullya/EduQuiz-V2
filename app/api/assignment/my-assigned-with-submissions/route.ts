import { NextRequest } from "next/server";
import { withAuth } from "@/lib/middleware/withAuth";
import { asyncHandler } from "@/lib/middleware/asyncHandler";
import { APIError } from "@/lib/middleware/APIError";
import Assignment from "@/lib/models/assignment.model";

import { successResponse } from "@/lib/utils/responseHandler";

export const GET = withAuth(
  asyncHandler(async (_req: NextRequest, user) => {
    let filter = {};

    if (user.role !== "teacher") {
      throw new APIError("Only teachers can access this route", 403);
    }

    const assignments = await Assignment.find({ teacher: user._id })
      .populate({
        path: "class",
        populate: {
          path: "students",
          select: "username email profile.firstName profile.lastName",
        },
      })
      .populate({
        path: "submissions.student",
        select: "username email profile.firstName profile.lastName",
      })
      .populate({
        path: "teacher",
        select: "username email",
      });
    const result = assignments
      .filter((assignment) => assignment.class) // Ignore assignments with missing class
      .map((assignment) => {
        const allStudents = assignment.class.students || [];
        const submissions = assignment.submissions || [];

        const submittedStudentIds = submissions.map(
          (sub: { student: { _id: { toString: () => any } } }) =>
            sub.student?._id?.toString()
        );

        const notSubmitted = allStudents.filter(
          (student: { _id: { toString: () => any } }) =>
            !submittedStudentIds.includes(student._id.toString())
        );

        return {
          _id: assignment._id,
          title: assignment.title,
          class: {
            name: assignment.class.name,
            grade: assignment.class.grade,
            section: assignment.class.section,
          },
          subject: assignment.subject,
          submittedCount: submissions.length,
          totalStudents: allStudents.length,
          submissions,
          notSubmitted,
          dueDate: assignment.dueDate,
          priority: assignment.priority,
        };
      });

    return successResponse(result, 200);
  })
);
