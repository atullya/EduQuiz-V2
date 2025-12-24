import { NextResponse } from "next/server";

export const adminOnly = (user: any) => {
  if (user.role !== "admin") {
    return NextResponse.json(
      {
        success: false,
        message: "Access Denied! Admin rights required",
      },
      { status: 403 }
    );
  }
  return null;
};
