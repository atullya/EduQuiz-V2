import { APIError } from "@/lib/middleware/APIError";
import { asyncHandler } from "@/lib/middleware/asyncHandler";
import { withAdmin } from "@/lib/middleware/withAdmin";
import User from "@/lib/models/user.model";
import { successResponse } from "@/lib/utils/responseHandler";
import { NextRequest } from "next/server";
const getIdFromUrl = (req: NextRequest) => {
  return req.nextUrl.pathname.split("/").pop();
};
export const DELETE = withAdmin(
  asyncHandler(async (req: NextRequest) => {
    const teacherId = getIdFromUrl(req);
    if (!teacherId) throw new APIError("Teacher is required", 400);

    const delStd = await User.findByIdAndDelete(teacherId);
    if (!delStd) throw new APIError("Teacher not found");
    return successResponse({ message: "Teacher deleted successfully" }, 201);
  })
);
