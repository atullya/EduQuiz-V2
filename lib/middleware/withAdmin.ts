import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "./authMiddleware";
import { adminOnly } from "./adminOnly";

type RouteContext = {
  params: Promise<Record<string, string>>;
};

export const withAdmin = (
  handler: (
    req: NextRequest,
    user: any,
    context: RouteContext
  ) => Promise<NextResponse>
) => {
  return async (req: NextRequest, context: RouteContext) => {
    const auth = await authMiddleware(req);
    if (auth instanceof NextResponse) return auth;

    const { user } = auth;

    const adminCheck = adminOnly(user);
    if (adminCheck) return adminCheck;

    return handler(req, user, context);
  };
};
