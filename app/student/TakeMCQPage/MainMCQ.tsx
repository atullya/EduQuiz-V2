"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, XCircle, Loader2 } from "lucide-react";
import { getClassesWithQuizzes } from "@/lib/store/smcq/sapi";
import { RootState } from "@/lib/store/store";
import { useSelector } from "react-redux";

interface Chapter {
  chapter: string | number;
  quizCount: number;
}

interface Subject {
  subject: string;
  chapters: Chapter[];
}

interface EnrolledClass {
  classId: string;
  className: string;
  section: string;
  grade: string;
  roomNo: string;
  teacher: string;
  totalStudents: number;
  subjects: Subject[];
}

interface ChapterCard {
  classId: string;
  className: string;
  section: string;
  grade: string;
  roomNo: string;
  teacher: string;
  subject: string;
  chapter: string | number;
  quizCount: number;
  totalStudents: number;
  hasQuizzes: boolean;
  alreadyAttempted: boolean;
}

interface User {
  _id: string;
  role: string;
}

interface MainMCQProps {
  setActiveTab: (tab: string) => void;
}

export default function MainMCQ({ setActiveTab }: MainMCQProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  const [chapterCards, setChapterCards] = useState<ChapterCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentClassesWithQuizzes = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await getClassesWithQuizzes(user._id);

      const classes =
        response?.enrolledClasses || response?.data?.enrolledClasses || [];

      if (!Array.isArray(classes) || classes.length === 0) {
        setChapterCards([]);
        setError("No classes found.");
        return;
      }

      const flattenedChapters: ChapterCard[] = [];

      classes.forEach((cls: any) => {
        cls.subjects.forEach((subject: any) => {
          subject.chapters.forEach((chapter: any) => {
            flattenedChapters.push({
              classId: cls.classId,
              className: cls.className,
              section: cls.section,
              grade: cls.grade,
              roomNo: cls.roomNo,
              teacher: cls.teacher.name, // simplified
              subject: subject.subject,
              chapter: chapter.chapter,
              quizCount: chapter.quizCount,
              totalStudents: cls.totalStudents,
              hasQuizzes: chapter.quizCount > 0,
              alreadyAttempted: false,
            });
          });
        });
      });

      setChapterCards(flattenedChapters);
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Failed to load quizzes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user._id && user.role === "student") {
      fetchStudentClassesWithQuizzes();
    } else if (user && user.role !== "student") {
      setError("You are not authorized to view student classes.");
      setLoading(false);
    }
  }, [user?._id, user?.role]);

  const handleStartQuiz = (item: ChapterCard) => {
    if (!user?._id) {
      alert("User not loaded yet!");
      return;
    }

    const query = new URLSearchParams({
      classId: item.classId,
      section: item.section,
      subject: item.subject,
      chapter: item.chapter.toString(),
      userId: user._id,
    }).toString();

    router.push(`/student/TakeMCQPage?${query}`);
  };

  const handleViewDetails = (item: ChapterCard) => {
    if (!user?._id) {
      alert("User not loaded yet!");
      return;
    }
    const query = new URLSearchParams({
      userId: user._id,
      classId: item.classId,
      section: item.section,
      subject: item.subject,
      chapter: item.chapter.toString(),
    }).toString();
    // router.push(
    //   `/student/TakeMCQPage/StudentQuizDetails=${user?._id}&classId=${item.classId}&section=${item.section}&subject=${item.subject}&chapter=${item.chapter}`
    // );
    router.push(`/student/TakeMCQPage/StudentQuizDetails?${query}`);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600">Loading user info...</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600 flex flex-col items-center">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        Loading your classes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 font-medium">{error}</div>
    );
  }

  const formatChapter = (chapter: string | number): string => {
    let ch = chapter.toString().trim();
    ch = ch.replace(/chapter\s*/i, "");
    return `Chapter ${ch}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          My Quiz Chapters
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {chapterCards.length === 0 ? (
            <div className="col-span-full p-12 text-center text-gray-500 bg-white rounded-xl border-2 border-dashed">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-lg">
                No quizzes found for your enrolled classes.
              </p>
            </div>
          ) : (
            chapterCards.map((item: any) => (
              <Card
                key={`${item.classId}-${item.subject}-${item.chapter}`}
                className="bg-white hover:shadow-md transition-shadow duration-200 border-none shadow-sm"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 w-full">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">
                          {item.className}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Teacher: {item.teacher?.profile?.firstName}{" "}
                          {item.teacher?.profile?.lastName}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-100"
                        >
                          {item.subject}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-purple-50 text-purple-700 border-purple-100"
                        >
                          {formatChapter(item.chapter)}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-gray-100 text-gray-600"
                        >
                          Sec {item.section}
                        </Badge>
                      </div>

                      <div className="pt-2 flex flex-col gap-2">
                        {item.hasQuizzes ? (
                          <>
                            <Button
                              onClick={() => handleStartQuiz(item)}
                              disabled={item.alreadyAttempted}
                              className={`w-full font-semibold ${
                                item.alreadyAttempted
                                  ? "bg-gray-200 text-gray-500"
                                  : "bg-green-600 hover:bg-green-700 text-white"
                              }`}
                            >
                              {item.alreadyAttempted
                                ? "Quiz Completed"
                                : `Start Quiz (${item.quizCount} MCQs)`}
                            </Button>

                            <Button
                              variant="secondary"
                              onClick={() => handleViewDetails(item)}
                              className="w-full bg-purple-50 text-purple-700 hover:bg-purple-100 border-none"
                            >
                              View Results & Details
                            </Button>
                          </>
                        ) : (
                          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded text-gray-500 text-sm italic">
                            <XCircle className="w-4 h-4" />
                            No quizzes available yet
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{item.totalStudents} peers enrolled</span>
                        </div>
                        <span>Room: {item.roomNo}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
