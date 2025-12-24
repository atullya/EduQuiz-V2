import { connectDB } from "@/lib/utils/db";
import User from "@/lib/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const users = await User.find();
  return NextResponse.json(users);
}
