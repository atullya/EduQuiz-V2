// middleware/withAuth.ts
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "./authMiddleware";
import { asyncHandler } from "./asyncHandler";

interface WithAuthOptions {
  roles?: string[]; // optional role check
}

export const withAuth = (
  handler: (req: NextRequest, user: any) => Promise<NextResponse>,
  options?: WithAuthOptions
) =>
  asyncHandler(async (req: NextRequest) => {
    const auth = await authMiddleware(req);
    if (auth instanceof NextResponse) return auth;

    const { user } = auth;

    if (options?.roles && !options.roles.includes(user.role)) {
      return NextResponse.json(
        { success: false, message: "Access Denied: insufficient permissions" },
        { status: 403 }
      );
    }

    return handler(req, user);
  });
