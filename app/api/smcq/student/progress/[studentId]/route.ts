import { NextRequest, NextResponse } from "next/server";
import Classs from "@/lib/models/class.model";
import QuizAttempt from "@/lib/models/QuizAttempt";

interface RouteContext {
  params: Promise<{ studentId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { studentId } = await params;

    const attempts = await QuizAttempt.find({ student: studentId }).populate(
      "class",
      "name grade section"
    );

    if (!attempts || attempts.length === 0)
      return NextResponse.json({
        success: true,
        message: "No attempts",
        progress: {
          totalAttempts: 0,
          averageScore: 0,
          totalCorrectAnswers: 0,
          totalQuestionsAnswered: 0,
        },
      });

    let totalCorrectAnswers = 0,
      totalQuestionsAnswered = 0;

    attempts.forEach((a) =>
      a.mcqs.forEach((mcq: any) => {
        totalQuestionsAnswered++;
        if (mcq.isCorrect) totalCorrectAnswers++;
      })
    );

    const averageScore =
      attempts.reduce((sum, a) => sum + (a.score || 0), 0) / attempts.length;

    return NextResponse.json({
      success: true,
      progress: {
        totalAttempts: attempts.length,
        averageScore,
        totalCorrectAnswers,
        totalQuestionsAnswered,
      },
      attempts,
    });
  } catch (error) {
    console.error("[ERROR] /student/progress", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
