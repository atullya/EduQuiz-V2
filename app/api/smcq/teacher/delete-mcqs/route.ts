import { NextRequest, NextResponse } from "next/server";

import MCQ from "@/lib/models/MCQ.model";
import { withAuth } from "@/lib/middleware/withAuth";

export const DELETE = withAuth(async (req: NextRequest, user: any) => {
  try {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacherId");
    const classId = searchParams.get("classId");
    const section = searchParams.get("section");
    const subject = searchParams.get("subject");
    const chapter = searchParams.get("chapter");

    if (!teacherId || !classId || !section || !subject)
      return NextResponse.json(
        { success: false, message: "All required" },
        { status: 400 }
      );

    if (user.role !== "teacher" && user._id !== teacherId)
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 403 }
      );

    const query: any = { teacher: teacherId, class: classId, section, subject };
    if (chapter) query.chapter = chapter;

    const result = await MCQ.deleteMany(query);
    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
      message: `${result.deletedCount} MCQs deleted`,
    });
  } catch (error) {
    console.error("[ERROR] /teacher/delete-mcqs", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
});
