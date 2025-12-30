import { NextRequest } from "next/server";
import { withAuth } from "@/lib/middleware/withAuth";
import { asyncHandler } from "@/lib/middleware/asyncHandler";
import { APIError } from "@/lib/middleware/APIError";
import Assignment from "@/lib/models/assignment.model";
import Classs from "@/lib/models/class.model";
import { successResponse } from "@/lib/utils/responseHandler";

// CREATE ASSIGNMENT
export const POST = withAuth(
  asyncHandler(async (req: NextRequest, user) => {
    if (user.role !== "teacher")
      throw new APIError("Only teachers can create assignments", 403);

    const {
      title,
      description,
      subject,
      class: classId,
      dueDate,
    } = await req.json();

    const classData = await Classs.findById(classId);
    if (!classData) throw new APIError("Class not found", 404);

    if (classData.teacher.toString() !== user._id.toString())
      throw new APIError("You are not assigned to this class", 403);

    const assignment = await Assignment.create({
      title,
      description,
      subject,
      class: classId,
      teacher: user._id,
      dueDate,
    });

    return successResponse(assignment, 201);
  })
);

// GET ALL ASSIGNMENTS (role based)
export const GET = withAuth(
  asyncHandler(async (_req: NextRequest, user) => {
    let filter = {};

    if (user.role === "teacher") {
      filter = { teacher: user._id };
    }

    if (user.role === "student") {
      filter = { "class.students": user._id };
    }

    const assignments = await Assignment.find(filter)
      .populate("class", "name grade section")
      .populate("teacher", "username email");

    return successResponse(assignments, 201);
  })
);
