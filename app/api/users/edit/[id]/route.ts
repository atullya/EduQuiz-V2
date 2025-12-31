import { APIError } from "@/lib/middleware/APIError";
import { asyncHandler } from "@/lib/middleware/asyncHandler";
import { withAdmin } from "@/lib/middleware/withAdmin";
import { withAuth } from "@/lib/middleware/withAuth";
import User from "@/lib/models/user.model";
import { successResponse } from "@/lib/utils/responseHandler";
import { NextRequest } from "next/server";

export const PUT = withAuth(
  asyncHandler(async (req: NextRequest, user: any) => {
    const userID = req.nextUrl.pathname.split("/").pop();

    if (!userID) throw new APIError("User ID is required", 400);

    const body = await req.json();

    if (!body.password) delete body.password;

    const updatedUser = await User.findByIdAndUpdate(
      userID,
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedUser) throw new APIError("User not found", 404);

    return successResponse(updatedUser, 200);
  })
);
