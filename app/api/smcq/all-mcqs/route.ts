import { asyncHandler } from "@/lib/middleware/asyncHandler";
import { NextRequest, NextResponse } from "next/server";
import MCQ from "@/lib/models/MCQ.model";

export const GET = asyncHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const classId = searchParams.get("classId");
  const teacherId = searchParams.get("teacherId");
  const subject = searchParams.get("subject");
  const chapter = searchParams.get("chapter");

  const filter: any = {};
  if (classId) filter.class = classId;
  if (teacherId) filter.teacher = teacherId;
  if (subject) filter.subject = subject;
  if (chapter) filter.chapter = chapter;

  const mcqs = await MCQ.find(filter)
    .populate("class", "name grade section")
    .populate("teacher", "username email")
    .sort({ createdAt: -1 });

  const formatted = mcqs.map((mcq) => ({
    id: mcq._id,
    question: mcq.question,
    options: mcq.options,
    correctAnswer: mcq.correct_answer,
    explanation: mcq.explanation,
    subject: mcq.subject,
    chapter: mcq.chapter,
    duration: mcq.duration,
    questionType: mcq.question_type,
    class: mcq.class
      ? {
          name: mcq.class.name,
          grade: mcq.class.grade,
          section: mcq.class.section,
        }
      : null,
    teacher: mcq.teacher
      ? { username: mcq.teacher.username, email: mcq.teacher.email }
      : null,
    createdAt: mcq.createdAt,
  }));

  return NextResponse.json({ success: true, mcqs: formatted });
});
