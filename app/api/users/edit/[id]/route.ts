import { APIError } from "@/lib/middleware/APIError";
import { asyncHandler } from "@/lib/middleware/asyncHandler";
import { withAdmin } from "@/lib/middleware/withAdmin";
import { withAuth } from "@/lib/middleware/withAuth";
import User from "@/lib/models/user.model";
import { successResponse } from "@/lib/utils/responseHandler";
import { NextRequest } from "next/server";
const getIdFromUrl = (req: NextRequest) => {
  return req.nextUrl.pathname.split("/").pop();
};
export const PUT = withAdmin(
  asyncHandler(async (req: NextRequest, user: any) => {
    const userID = getIdFromUrl(req);

    if (!userID) throw new APIError("Class ID is required", 400);

    const body = await req.json();

    const updatedClass = await User.findByIdAndUpdate(
      userID,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedClass) throw new APIError("User not found", 404);
    return successResponse(updatedClass, 200);
  })
);
