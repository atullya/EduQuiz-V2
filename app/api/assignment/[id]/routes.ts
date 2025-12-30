import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware/withAuth";
import { asyncHandler } from "@/lib/middleware/asyncHandler";
import { APIError } from "@/lib/middleware/APIError";
import Assignment from "@/lib/models/assignment.model";
import { successResponse } from "@/lib/utils/responseHandler";

// ================= UPDATE ASSIGNMENT =================
export const PUT = withAuth(
  asyncHandler(async (req: NextRequest, user) => {
    const id = req.nextUrl.pathname.split("/").pop();
    const data = await req.json();

    const assignment = await Assignment.findById(id);
    if (!assignment) throw new APIError("Assignment not found", 404);

    if (assignment.teacher.toString() !== user._id.toString()) {
      throw new APIError("Unauthorized", 403);
    }

    Object.assign(assignment, data);
    await assignment.save();

    return successResponse("Assignment updated", assignment);
  })
);

// ================= DELETE ASSIGNMENT =================
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

// ================= GET ASSIGNMENT DETAILS =================
