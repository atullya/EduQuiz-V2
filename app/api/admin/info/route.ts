import { asyncHandler } from "@/lib/middleware/asyncHandler";
import { withAdmin } from "@/lib/middleware/withAdmin";
import Classs from "@/lib/models/class.model";
import User from "@/lib/models/user.model";
import { successResponse } from "@/lib/utils/responseHandler";
import { NextRequest } from "next/server";

export const GET = withAdmin(
  asyncHandler(async (req: NextRequest, user: any) => {
    const [students, teachers, classes] = await Promise.all([
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "teacher" }),
      Classs.countDocuments(),
    ]);

    return successResponse({ data: { students, teachers, classes } });
  })
);
