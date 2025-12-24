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
    const stdId = getIdFromUrl(req);
    if (!stdId) throw new APIError("StudentId is required", 400);

    const delStd = await User.findByIdAndDelete(stdId);
    if (!delStd) throw new APIError("Student not found");
    return successResponse({ message: "Student deleted successfully" }, 201);
  })
);
