import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/lib/middleware/authMiddleware";
import MCQ from "@/lib/models/MCQ.model";
import Classs from "@/lib/models/class.model";
import User from "@/lib/models/user.model";
import QuizAttempt from "@/lib/models/QuizAttempt";
import mongoose from "mongoose";
import { withAuth } from "@/lib/middleware/withAuth";

// Define the shape of the incoming answer from the request body
interface RawAnswer {
  mcqId: string;
  selectedOption: string; // The ID of the option selected by student
}

export const POST = withAuth(async (req: NextRequest, user: any) => {
  try {
    const body = await req.json();
    const {
      studentId,
      classId,
      section,
      subject,
      chapter,
      answers,
    }: {
      studentId: string;
      classId: string;
      section: string;
      subject: string;
      chapter: string;
      answers: RawAnswer[];
    } = body;

    // 1. Validation: Check if all required fields exist
    if (
      !studentId ||
      !classId ||
      !section ||
      !subject ||
      !chapter ||
      !answers
    ) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    // 2. Student Verification
    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return NextResponse.json(
        { success: false, message: "Valid student not found." },
        { status: 404 }
      );
    }

    // 3. Fetch all MCQs involved in this quiz
    const mcqIds = answers.map((a) => a.mcqId);
    const mcqs = await MCQ.find({ _id: { $in: mcqIds } });

    if (mcqs.length === 0) {
      return NextResponse.json(
        { success: false, message: "No MCQs found. Quiz cannot be graded." },
        { status: 400 }
      );
    }

    // 4. Grading Logic
    let correctCount = 0;

    const detailedAnswers = answers.map((ans) => {
      // Find the corresponding MCQ document
      const mcqDoc = mcqs.find((m) => m._id.toString() === ans.mcqId);

      if (!mcqDoc) {
        return {
          mcqId: new mongoose.Types.ObjectId(ans.mcqId),
          selectedOption: ans.selectedOption,
          correctAnswer: "N/A",
          isCorrect: false,
        };
      }

      // Find the option selected by the student to get its Key (A, B, C, etc.)
      const selectedOptionObj = mcqDoc.options.find(
        (o: any) => o._id.toString() === ans.selectedOption
      );

      // Compare selected key with the stored correct_answer
      const isCorrect = selectedOptionObj?.key === mcqDoc.correct_answer;

      if (isCorrect) correctCount++;

      return {
        mcqId: mcqDoc._id,
        selectedOption: ans.selectedOption || null,
        correctAnswer: mcqDoc.correct_answer,
        isCorrect,
      };
    });

    // 5. Calculate final percentage score
    const score = (correctCount / mcqs.length) * 100;

    // 6. Save the Attempt using the QuizAttempt model
    const quizAttempt = new QuizAttempt({
      student: studentId,
      class: classId,
      section,
      subject,
      chapter,
      mcqs: detailedAnswers,
      score,
      correctAnswers: correctCount,
      submittedAt: new Date(),
    });

    await quizAttempt.save();

    // Success Response
    return NextResponse.json({
      success: true,
      message: "Quiz submitted successfully",
      score: score.toFixed(2), // Send as string for UI display
      totalQuestions: mcqs.length,
      correctAnswers: correctCount,
      quizAttemptId: quizAttempt._id,
      chapter,
    });
  } catch (error) {
    console.error("[ERROR] /student/submit", error);
    return NextResponse.json(
      { success: false, message: "Server error occurred during submission." },
      { status: 500 }
    );
  }
});
