"use server";

import { NextRequest, NextResponse } from "next/server";
import Classs from "@/lib/models/class.model";
import MCQ from "@/lib/models/MCQ.model";
import { asyncHandler } from "@/lib/middleware/asyncHandler";
import { withAuth } from "@/lib/middleware/withAuth";
import { APIError } from "@/lib/middleware/APIError";
import { successResponse } from "@/lib/utils/responseHandler";

export const GET = withAuth(
  asyncHandler(async (req: NextRequest, user: any) => {
    const teacherId = req.nextUrl.pathname.split("/").pop();
    if (!teacherId) throw new APIError("Teacher ID is required");

    if (user.role !== "teacher") throw new APIError("Not authorized");

    const classes = await Classs.find({ teacher: teacherId });
    if (!classes || classes.length === 0)
      return successResponse({
        success: true,
        totalSubject: 0,
        subjectsWithMCQs: [],
      });

    const subjectData = await Promise.all(
      classes.map(async (cls) => {
        const subjectsArray = Array.isArray(cls.subjects)
          ? cls.subjects
          : [cls.subjects];

        const chaptersData = await Promise.all(
          subjectsArray.map(async (subject: any) => {
            const chapters = await MCQ.distinct("chapter", {
              class: cls._id,
              section: cls.section,
              subject,
              teacher: teacherId,
            });

            const chapterResults = await Promise.all(
              chapters.map(async (chapter) => {
                const publishedCount = await MCQ.countDocuments({
                  class: cls._id,
                  section: cls.section,
                  subject,
                  chapter,
                  teacher: teacherId,
                  status: "published",
                });

                const draftCount = await MCQ.countDocuments({
                  class: cls._id,
                  section: cls.section,
                  subject,
                  chapter,
                  teacher: teacherId,
                  status: "draft",
                });

                const totalCount = publishedCount + draftCount;
                if (totalCount > 0) {
                  return {
                    classId: cls._id,
                    className: cls.name,
                    section: cls.section,
                    grade: cls.grade,
                    subject,
                    chapter,
                    quizCount: totalCount,
                    statusBreakdown: {
                      published: publishedCount,
                      draft: draftCount,
                    },
                  };
                } else {
                  return null;
                }
              })
            );

            return chapterResults.filter(Boolean);
          })
        );

        return chaptersData.flat();
      })
    );

    const flatResults = subjectData.flat();

    return successResponse({
      success: true,
      totalSubjects: flatResults.length,
      subjectsWithMCQs: flatResults,
    });
  })
);
