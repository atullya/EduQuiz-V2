import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/lib/models/user.model";

interface JwtPayloadCustom extends jwt.JwtPayload {
  userId: string;
}
export const authMiddleware = async (req: NextRequest) => {
  const token =
    req.cookies.get("accessToken")?.value ||
    req.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Access token missing" },
      { status: 401 }
    );
  }
  try {
    const decodeToken = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayloadCustom;
    if (!decodeToken?.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Invalid Token" },
        { status: 401 }
      );
    }

    const userDetail = await User.findById(decodeToken.userId);
    if (!userDetail) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - User not found" },
        { status: 401 }
      );
    }


    return { user: userDetail };
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return NextResponse.json(
        { success: false, message: "Access token expired" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Invalid access token" },
      { status: 403 }
    );
  }
};
