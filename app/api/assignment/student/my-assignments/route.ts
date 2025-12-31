import { NextRequest } from "next/server";
import { withAuth } from "@/lib/middleware/withAuth";
import { asyncHandler } from "@/lib/middleware/asyncHandler";
import { APIError } from "@/lib/middleware/APIError";
import Assignment from "@/lib/models/assignment.model";
import { successResponse } from "@/lib/utils/responseHandler";
import User from "@/lib/models/user.model";
import Classs from "@/lib/models/class.model";

export const GET = withAuth(
  asyncHandler(async (req: NextRequest, user) => {
    if (user.role !== "student")
      throw new APIError("Only students can submit", 403);
    console.log("Authenticated User:", user);
    const studentUser = await User.findById(user._id)
      .select("profile.class profile.section")
      .lean();
    console.log("Student User Profile:", studentUser);
    if (
      !studentUser ||
      !studentUser.profile ||
      !studentUser.profile.class ||
      !studentUser.profile.section
    )
      throw new APIError("Student profile incomplete", 400);

    const { class: studentGrade, section: studentSection } =
      studentUser.profile;

    const studentClassDoc = await Classs.findOne({
      grade: studentGrade,
      section: studentSection,
    })
      .select("_id")
      .lean();

    if (!studentClassDoc)
      throw new APIError(
        `No class found for grade "${studentGrade}" and section "${studentSection}".`,
        404
      );
    const studentClassId = studentClassDoc._id;
    const assignments = await Assignment.find({ class: studentClassId })
      .populate("teacher", "username email profile.firstName profile.lastName")
      .populate("class", "name grade section")
      .lean();

    const result = assignments.map((assignment) => {
      const studentSubmission = assignment.submissions.find(
        (sub: any) => sub.student.toString() === user._id.toString()
      );

      return {
        _id: assignment._id,
        title: assignment.title,
        description: assignment.description,
        subject: assignment.subject,
        dueDate: assignment.dueDate,
        priority: assignment.priority || null,
        class: assignment.class
          ? {
              _id: assignment.class._id,
              name: assignment.class.name,
              grade: assignment.class.grade,
              section: assignment.class.section,
            }
          : null,
        teacher: assignment.teacher
          ? {
              _id: assignment.teacher._id,
              firstName: assignment.teacher.profile?.firstName || "",
              lastName: assignment.teacher.profile?.lastName || "",
            }
          : null,
        isSubmitted: !!studentSubmission,
        submission: studentSubmission
          ? {
              submittedAt: studentSubmission.submittedAt,
              submissionText: studentSubmission.submissionText || "",
              submissionFile: studentSubmission.submissionFile || null,
              feedback: studentSubmission.feedback || null,
            }
          : null,
      };
    });

    return successResponse({ result }, 200);
  })
);
