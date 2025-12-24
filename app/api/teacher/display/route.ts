import { asyncHandler } from "@/lib/middleware/asyncHandler";
import { withAdmin } from "@/lib/middleware/withAdmin";
import User from "@/lib/models/user.model";
import { successResponse } from "@/lib/utils/responseHandler";

export const GET = withAdmin(
  asyncHandler(async () => {
    const teachers = await User.find({ role: "teacher" }).select("-password");
    return successResponse({ teachers }, 200);
  })
);
