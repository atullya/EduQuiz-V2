import QuizAttempt from "@/lib/models/QuizAttempt";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId");
    const section = searchParams.get("section");
    const subject = searchParams.get("subject");
    const chapter = searchParams.get("chapter");

    if (!classId || !section || !subject || !chapter)
      return NextResponse.json(
        { success: false, message: "All fields required" },
        { status: 400 }
      );

    const attempts = await QuizAttempt.find({
      class: classId,
      section,
      subject,
      chapter,
    })
      .populate("student", "username email")
      .sort({ submittedAt: -1 });

    if (!attempts.length)
      return NextResponse.json({
        success: true,
        message: "No attempts",
        progress: {
          totalStudentsAttempted: 0,
          averageScore: 0,
          scoreDistribution: {},
          studentResults: [],
        },
      });

    const latestMap = new Map<string, any>();
    attempts.forEach((a) => {
      const id = a.student._id.toString();
      if (!latestMap.has(id)) latestMap.set(id, a);
    });
    const latestAttempts = Array.from(latestMap.values());

    const totalStudentsAttempted = latestAttempts.length;
    const averageScore =
      latestAttempts.reduce((sum, a) => sum + a.score, 0) /
      totalStudentsAttempted;

    const scoreDistribution = {
      "0-49": 0,
      "50-69": 0,
      "70-89": 0,
      "90-100": 0,
    };
    latestAttempts.forEach((a) => {
      if (a.score < 50) scoreDistribution["0-49"]++;
      else if (a.score < 70) scoreDistribution["50-69"]++;
      else if (a.score < 90) scoreDistribution["70-89"]++;
      else scoreDistribution["90-100"]++;
    });

    const studentResults = latestAttempts.map((a) => ({
      studentId: a.student._id,
      name: a.student.username,
      email: a.student.email,
      correctAnswers: a.correctAnswers,
      totalQuestions: a.mcqs.length,
      score: a.score,
      submittedAt: a.submittedAt,
    }));

    return NextResponse.json({
      success: true,
      progress: {
        totalStudentsAttempted,
        averageScore,
        scoreDistribution,
        studentResults,
      },
    });
  } catch (error) {
    console.error("[ERROR] /teacher/progress", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
};
