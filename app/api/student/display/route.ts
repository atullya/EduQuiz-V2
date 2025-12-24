import { asyncHandler } from "@/lib/middleware/asyncHandler";
import { withAdmin } from "@/lib/middleware/withAdmin";
import User from "@/lib/models/user.model";
import { successResponse } from "@/lib/utils/responseHandler";

export const GET = withAdmin(
  asyncHandler(async () => {
    const students = await User.find({ role: "student" }).select("-password");
    return successResponse({ students }, 200);
    
  })
);
