import { NextRequest, NextResponse } from "next/server";
import MCQ from "@/lib/models/MCQ.model";

import mongoose from "mongoose";
import QuizAttempt from "@/lib/models/QuizAttempt";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId");
    const section = searchParams.get("section");
    const subject = searchParams.get("subject");
    const chapter = searchParams.get("chapter");
    const studentId = searchParams.get("studentId");

    if (!classId || !section || !subject || !studentId)
      return NextResponse.json(
        {
          success: false,
          message: "classId, section, subject, studentId required",
        },
        { status: 400 }
      );

    const filter: any = {
      class: classId,
      section: section.trim(),
      subject: subject.trim(),
      status: "published",
    };
    if (chapter) filter.chapter = chapter.trim();

    const mcqs = await MCQ.find(filter).select(
      "_id question options duration correct_answer chapter"
    );

    if (mcqs.length === 0)
      return NextResponse.json(
        { success: false, message: "No quizzes found for this chapter." },
        { status: 404 }
      );

    const existingAttempt = await QuizAttempt.findOne({
      student: studentId,
      class: classId,
      section,
      subject,
      ...(chapter ? { chapter } : {}),
    });

    return NextResponse.json({
      success: true,
      mcqs,
      duration: mcqs[0]?.duration || 0,
      total: mcqs.length,
      alreadyAttempted: !!existingAttempt,
    });
  } catch (error) {
    console.error("[ERROR] /student/quizzes", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
};
