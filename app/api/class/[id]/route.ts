import { asyncHandler } from "@/lib/middleware/asyncHandler";
import { withAuth } from "@/lib/middleware/withAuth";
import { NextRequest, NextResponse } from "next/server";
import Classs from "@/lib/models/class.model";
import { APIError } from "@/lib/middleware/APIError";
import { successResponse } from "@/lib/utils/responseHandler";
const getIdFromUrl = (req: NextRequest) => {
  return req.nextUrl.pathname.split("/").pop();
};

export const GET = withAuth(
  asyncHandler(async (req: NextRequest, user: any) => {
    const classId = getIdFromUrl(req);

    if (!classId) throw new APIError("Class ID is required", 400);

    const cls = await Classs.findById(classId)
      .populate("teacher", "username email profile")
      .populate("students", "username email profile");

    if (!cls) throw new APIError("Class not found", 404);

    return successResponse(cls, 200);
  })
);
export const PUT = withAuth(
  asyncHandler(async (req: NextRequest, user: any) => {
    const classId = getIdFromUrl(req);

    if (!classId) throw new APIError("Class ID is required", 400);

    const body = await req.json();

    delete body._id;

    const updatedClass = await Classs.findByIdAndUpdate(
      classId,
      { $set: body },
      { new: true, runValidators: true }
    )
      .populate("teacher", "username email profile")
      .populate("students", "username email profile");

    if (!updatedClass) {
      return NextResponse.json({ message: "Class not found" }, { status: 404 });
    }

    return NextResponse.json(updatedClass, { status: 200 });
  })
);
