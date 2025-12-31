import { NextResponse } from "next/server";
// import QuizAttempt from "@/lib/models/QuizAttempt.model";
import Classs from "@/lib/models/class.model";
import QuizAttempt from "@/lib/models/QuizAttempt";

interface Params {
  studentId: string;
}

export const GET = async (req: Request, { params }: { params: Params }) => {
  try {
    const { studentId } = params;
    const attempts = await QuizAttempt.find({ student: studentId }).populate(
      "class",
      "name grade section"
    );

    if (!attempts.length)
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
      a.mcqs.forEach((mcq) => {
        totalQuestionsAnswered++;
        if (mcq.isCorrect) totalCorrectAnswers++;
      })
    );
    const averageScore =
      attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length;

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
};
