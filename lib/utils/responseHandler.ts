import { NextResponse } from "next/server";

export const successResponse = (data: any, status: number = 200) => {
  return NextResponse.json({ success: true, data }, { status });
};

export const errorResponse = (message: string, status: number = 400) => {
  return NextResponse.json({ success: false, message }, { status });
};
