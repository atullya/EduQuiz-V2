import { NextRequest, NextResponse } from "next/server";
import { APIError } from "./APIError";
import { connectDB } from "../utils/db";

// Updated asyncHandler to support optional `user` argument
export const asyncHandler =
  (func: (req: NextRequest, user?: any) => Promise<NextResponse>) =>
  async (req: NextRequest, user?: any) => {
    await connectDB();
    try {
  
      return await func(req, user);
    } catch (error: unknown) {
      console.error(error);

      let message = "Internal Server Error";
      let statusCode = 500;

      if (error instanceof APIError) {
        message = error.message;
        statusCode = error.statusCode;
      } else if (error instanceof Error) {
        message = error.message;
      }

      return NextResponse.json({ success: false, message }, { status: statusCode });
    }
  };
