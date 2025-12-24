import { APIError } from "@/lib/middleware/APIError";
import { asyncHandler } from "@/lib/middleware/asyncHandler";
import { withAdmin } from "@/lib/middleware/withAdmin";
import Classs from "@/lib/models/class.model";
import { successResponse } from "@/lib/utils/responseHandler";
import { NextRequest } from "next/server";
type RouteContext = {
  params: Record<string, string>;
};
export const DELETE = withAdmin(
  asyncHandler(async (req: NextRequest) => {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) throw new APIError("Class ID required", 400);

    await Classs.findByIdAndDelete(id);
    return successResponse({ message: "Class deleted" });
  })
);
