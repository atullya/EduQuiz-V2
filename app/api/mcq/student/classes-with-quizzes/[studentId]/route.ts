import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Classs from "@/lib/models/class.model";
import MCQ from "@/lib/models/MCQ.model";
import { asyncHandler } from "@/lib/middleware/asyncHandler";
import { withAuth } from "@/lib/middleware/withAuth";
import { APIError } from "@/lib/middleware/APIError";

export const GET = withAuth(
  asyncHandler(async (req: NextRequest, user: any) => {
    const studentId = req.nextUrl.pathname.split("/").pop();

    if (!studentId) {
      throw new APIError("Student ID is required", 400);
    }

    if (user.role !== "student" && user._id !== studentId) {
      throw new APIError("Not authorized", 403);
    }

    // Fetch classes where the student is enrolled
    const classes = await Classs.find({ students: studentId })
      .populate("teacher", "username email profile.firstName profile.lastName")
      .populate("students", "_id username email");

    const classesWithQuizInfo = await Promise.all(
      classes.map(async (cls) => {
        const subjectsArray = Array.isArray(cls.subjects)
          ? cls.subjects
          : [cls.subjects];

        console.log(
          "Processing class:",
          cls._id,
          "with subjects:",
          subjectsArray
        );

        const subjectData = await Promise.all(
          subjectsArray.map(async (subjectRaw: string) => {
            const subject = subjectRaw.trim();

            const classId = new mongoose.Types.ObjectId(cls._id);

            let chapters = await MCQ.distinct("chapter", {
              class: classId,
              section: cls.section.trim(),
              subject: { $regex: `^${subject}$`, $options: "i" },
              status: "published",
            });
            console.log("Chapters for subject", subject, ":", chapters);

            if (!chapters.length) chapters = [null];
            const chapterQuizzes = await Promise.all(
              chapters.map(async (chapter) => {
                const count = await MCQ.countDocuments({
                  class: classId,
                  section: cls.section.trim(),
                  subject: { $regex: `^${subject}$`, $options: "i" },
                  chapter,
                  status: "published",
                });

                return { chapter: chapter || "General", quizCount: count };
              })
            );

            return {
              subject,
              chapters: chapterQuizzes,
              totalQuizzes: chapterQuizzes.reduce(
                (sum, c) => sum + c.quizCount,
                0
              ),
            };
          })
        );

        return {
          classId: cls._id,
          className: cls.name,
          section: cls.section,
          grade: cls.grade,
          roomNo: cls.roomNo,
          schedule: cls.schedule,
          time: cls.time,
          totalStudents: cls.students.length,
          teacher: {
            id: cls.teacher?._id || null,
            name: cls.teacher
              ? `${cls.teacher.profile.firstName} ${cls.teacher.profile.lastName}`
              : "Unknown",
            email: cls.teacher?.email || "N/A",
          },
          subjects: subjectData,
        };
      })
    );

    return NextResponse.json({
      success: true,
      totalClasses: classes.length,
      enrolledClasses: classesWithQuizInfo,
    });
  })
);
