import * as bcrypt from "bcrypt";
import { NextRequest } from "next/server";
import { asyncHandler } from "@/lib/middleware/asyncHandler";
import { APIError } from "@/lib/middleware/APIError";
import User from "@/lib/models/user.model";
import Classs from "@/lib/models/class.model";
import { successResponse } from "@/lib/utils/responseHandler";
import { connectDB } from "@/lib/utils/db";

export const POST = asyncHandler(async (req: NextRequest) => {
  await connectDB();
  const body = await req.json();

  const { username, email, password, role, profile } = body;

  if (!username || !email || !password) {
    throw new APIError("All fields are required", 400);
  }

  if (password.length < 6) {
    throw new APIError("Password must be at least 6 characters", 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new APIError("User already exists with this email", 400);
  }

  let targetClass = null;

  if (role === "student" || role === "teacher") {
    if (!profile?.class || !profile?.section) {
      throw new APIError(
        "Class and Section are required for students/teachers",
        400
      );
    }

    targetClass = await Classs.findOne({
      grade: profile.class,
      section: profile.section,
    });

    if (!targetClass) {
      throw new APIError(
        "No class found with the provided grade & section",
        404
      );
    }

    if (role === "student") {
      const existingStudent = await User.findOne({
        "profile.studentId": profile.studentId,
      });
      if (existingStudent) {
        const studentAssigned = await Classs.findOne({
          students: existingStudent._id,
        });

        if (studentAssigned) {
          throw new APIError(
            "Student is already assigned to a class and section",
            400
          );
        }
      }
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    role,
    profile,
  });

  if (role === "student") {
    if (!targetClass.students.includes(newUser._id)) {
      targetClass.students.push(newUser._id);
      await targetClass.save();
    }
  } else if (role === "teacher") {
    targetClass.teacher = newUser._id;
    await targetClass.save();
  }

  return successResponse(
    {
      success: true,
      message: "Registration successful",
      user: newUser,
    },
    201
  );
});
