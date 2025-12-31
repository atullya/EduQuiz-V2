import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware/withAuth";
import { asyncHandler } from "@/lib/middleware/asyncHandler";
import MCQ from "@/lib/models/MCQ.model";

export const runtime = "nodejs";

const saveMCQHandler = async (req: NextRequest) => {
  const { mcqs, classId, section, teacherId, duration, subject, chapter } =
    await req.json();

  if (!mcqs || !Array.isArray(mcqs) || mcqs.length === 0) {
    return NextResponse.json(
      { success: false, message: "No MCQs provided" },
      { status: 400 }
    );
  }

  if (!classId || !section || !teacherId) {
    return NextResponse.json(
      { success: false, message: "Missing required fields" },
      { status: 400 }
    );
  }

  const formatted = mcqs.map((mcq) => ({
    question: mcq.question,
    options: mcq.options,
    correct_answer: mcq.correct_answer,
    explanation: mcq.explanation || "",
    class: classId,
    section,
    subject,
    chapter,
    duration,
    createdBy: teacherId,
  }));

  await MCQ.insertMany(formatted);

  return NextResponse.json({
    success: true,
    savedCount: formatted.length,
  });
};

export const POST = withAuth(asyncHandler(saveMCQHandler));
