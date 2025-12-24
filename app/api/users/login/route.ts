import * as bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { asyncHandler } from "@/lib/middleware/asyncHandler";
import User from "@/lib/models/user.model";
import { generateAccessToken, generateRefreshToken } from "@/lib/utils/jwt";
import { APIError } from "@/lib/middleware/APIError";

export const POST = asyncHandler(async (req: NextRequest) => {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    throw new APIError("All fields are required", 400);
  }

  const userValid = await User.findOne({ email });
  if (!userValid) {
    throw new APIError("User not found", 404);
  }

  const validPassword = await bcrypt.compare(password, userValid.password);
  if (!validPassword) {
    throw new APIError("Invalid Credentials", 400);
  }

  const token = generateAccessToken(userValid._id.toString());
  const refreshToken = generateRefreshToken(userValid._id.toString());
  userValid.refreshToken = refreshToken;
  await userValid.save();

  const response = NextResponse.json({
    _id: userValid._id,
    username: userValid.username,
    email: userValid.email,
    role: userValid.role,
    success: true,
    message: "Login successful",
    accessToken: token,
    refreshToken,
  });

  response.cookies.set("accessToken", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 15 * 60,
  });

  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
});
