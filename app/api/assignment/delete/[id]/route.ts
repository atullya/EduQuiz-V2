import { APIError } from "@/lib/middleware/APIError";
import { asyncHandler } from "@/lib/middleware/asyncHandler";
import { withAuth } from "@/lib/middleware/withAuth";
import Assignment from "@/lib/models/assignment.model";
import { successResponse } from "@/lib/utils/responseHandler";
import { NextRequest } from "next/server";

export const DELETE = withAuth(
  asyncHandler(async (req: NextRequest, user) => {
    const id = req.nextUrl.pathname.split("/").pop();

    const assignment = await Assignment.findById(id);
    if (!assignment) throw new APIError("Assignment not found", 404);

    if (assignment.teacher.toString() !== user._id.toString()) {
      throw new APIError("Unauthorized", 403);
    }

    await assignment.deleteOne();
    return successResponse("Assignment deleted");
  })
);
