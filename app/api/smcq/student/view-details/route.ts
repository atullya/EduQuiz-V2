import QuizAttempt from "@/lib/models/QuizAttempt";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const classId = searchParams.get("classId");
    const section = searchParams.get("section");
    const subject = searchParams.get("subject");
    const chapter = searchParams.get("chapter");

    if (!studentId || !classId || !section || !subject || !chapter)
      return NextResponse.json(
        { success: false, message: "All fields required" },
        { status: 400 }
      );

    const quizAttempt = await QuizAttempt.findOne({
      student: studentId,
      class: classId,
      section,
      subject,
      chapter,
    }).populate({
      path: "mcqs.mcqId",
      model: "MCQ",
      select: "_id question options correct_answer chapter",
    });

    if (!quizAttempt)
      return NextResponse.json(
        { success: false, message: "No attempt found" },
        { status: 404 }
      );

    const detailedQuiz = quizAttempt.mcqs.map((item: any) => ({
      questionId: item.mcqId._id,
      question: item.mcqId.question,
      options: item.mcqId.options,
      correctAnswer: item.mcqId.correct_answer,
      selectedOption: item.selectedOption,
      isCorrect: item.isCorrect,
      chapter: item.mcqId.chapter,
    }));

    return NextResponse.json({
      success: true,
      studentId,
      classId,
      section,
      subject,
      chapter,
      score: quizAttempt.score,
      totalQuestions: quizAttempt.mcqs.length,
      correctAnswers: quizAttempt.correctAnswers,
      quizDetails: detailedQuiz,
      submittedAt: quizAttempt.submittedAt,
    });
  } catch (error) {
    console.error("[ERROR] /student/view-details", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
};
