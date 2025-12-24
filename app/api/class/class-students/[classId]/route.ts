import { NextRequest } from "next/server";
import Classs from "@/lib/models/class.model";
import { asyncHandler } from "@/lib/middleware/asyncHandler";
import { withAuth } from "@/lib/middleware/withAuth";
import { NextResponse } from "next/server";

export const GET = withAuth(
  asyncHandler(async (req: NextRequest, user: any) => {
    const classId = req.nextUrl.pathname.split("/").pop();
    if (!classId)
      return NextResponse.json(
        { message: "Class ID required" },
        { status: 400 }
      );

    const cls = await Classs.findById(classId).populate("students", "username");
    if (!cls)
      return NextResponse.json({ message: "Class not found" }, { status: 404 });

    if (
      user.role !== "admin" &&
      !(user.role === "teacher" && user._id === cls.teacher.toString())
    ) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    const studentNames = cls.students.map((s: { username: any }) => s.username);

    return NextResponse.json({ className: cls.name, studentNames });
  })
);
