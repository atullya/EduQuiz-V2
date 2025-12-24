import { APIError } from "@/lib/middleware/APIError";
import { asyncHandler } from "@/lib/middleware/asyncHandler";
import User from "@/lib/models/user.model";
import {
  generateAccessToken,
  generateRefreshToken,
  JwtPayload,
  verifyRefreshToken,
} from "@/lib/utils/jwt";
import { NextRequest, NextResponse } from "next/server";

export const GET = asyncHandler(async (req: NextRequest) => {
  const refreshToken = req.cookies.get("refreshToken")?.value;
  if (!refreshToken) {
    throw new APIError("Refresh token is required", 401);
  }
  let decoded: JwtPayload;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (err) {
    throw err;
  }
  const user = await User.findById(decoded.userId);
  if (!user) throw new APIError("User not found", 404);
  const newAccessToken = generateAccessToken(user._id.toString());
  const newRefreshToken = generateRefreshToken(user._id.toString());

  const response = NextResponse.json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    user: {
      id: user._id,
      name: user.username,
      email: user.email,
      role: user.role,
    },
  });
  response.cookies.set("accessToken", newAccessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 15 * 60,
  });

  response.cookies.set("refreshToken", newRefreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
});
