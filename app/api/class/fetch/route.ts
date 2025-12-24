import { asyncHandler } from "@/lib/middleware/asyncHandler";
import { withAdmin } from "@/lib/middleware/withAdmin";
import Classs from "@/lib/models/class.model";
import { successResponse } from "@/lib/utils/responseHandler";
import { NextRequest } from "next/server";

export const GET = withAdmin(
  asyncHandler(async (req: NextRequest, user: any) => {
    const classes = await Classs.find()
      .populate("teacher", "username email profile.firstName profile.lastName")
      .populate(
        "students",
        "username email profile.firstName profile.lastName"
      );
    const totalCount = await Classs.countDocuments();
    return successResponse({ totalCount, classes }, 201);
  })
);
