import { NextRequest } from "next/server";
import { withAuth } from "@/lib/middleware/withAuth";
import { asyncHandler } from "@/lib/middleware/asyncHandler";
import { APIError } from "@/lib/middleware/APIError";
import Assignment from "@/lib/models/assignment.model";
import { successResponse } from "@/lib/utils/responseHandler";

export const POST = withAuth(
  asyncHandler(async (req: NextRequest, user) => {
    if (user.role !== "student")
      throw new APIError("Only students can submit", 403);

    const { submissionText } = await req.json();
    const id = req.nextUrl.pathname.split("/").pop();

    const assignment = await Assignment.findById(id);
    if (!assignment) throw new APIError("Assignment not found", 404);

    const already = assignment.submissions.find(
      (s: { student: { toString: () => string } }) =>
        s.student.toString() === user._id.toString()
    );
    if (already) throw new APIError("Already submitted", 400);

    assignment.submissions.push({
      student: user._id,
      submissionText,
    });

    await assignment.save();

    return successResponse("Assignment submitted");
  })
);
