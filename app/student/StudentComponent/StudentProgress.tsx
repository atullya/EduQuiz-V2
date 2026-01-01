"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Trophy,
  Target,
  BarChart3,
  BookCheck,
  Loader2,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { getStudentProgress } from "@/lib/store/smcq/sapi";
interface QuizAttempt {
  _id: string;
  submittedAt: string;
  class:
    | {
        name: string;
        _id?: string;
      }
    | string;
  section: string;
  subject: string;
  chapter: string | number;
  score: number;
}

interface ProgressSummary {
  totalAttempts: number;
  averageScore: number;
  totalCorrectAnswers: number;
  totalQuestionsAnswered: number;
}

interface StudentProgressProps {
  setActiveTab: (tab: string) => void;
}

const StudentProgress: React.FC<StudentProgressProps> = ({ setActiveTab }) => {
  const studentId = useSelector((state: RootState) => state.auth.user);
  const [progress, setProgress] = useState<ProgressSummary | null>(null);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId) {
      setError("Student ID is required to view progress.");
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      if (!studentId._id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await getStudentProgress(studentId._id);
        console.log("Student Progress Response:", res);
        if (res.success) {
          setProgress(res?.progress);
          setAttempts(res?.attempts);
        } else {
          setError("Failed to fetch progress information.");
        }
      } catch (err) {
        console.error("Error fetching progress:", err);
        setError(
          "Error fetching progress. Please check your network connection."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [studentId]);

  const formatChapter = (chapter: string | number): string => {
    let ch = chapter.toString().trim();
    ch = ch.replace(/chapter\s*/i, "");
    return `Chapter ${ch}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            Loading your performance data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-red-100 max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Quiz Performance
          </h1>
          <p className="text-gray-600">
            Track your learning journey and improve your scores.
          </p>
        </div>

        {!progress || progress.totalAttempts === 0 ? (
          <Card className="border-2 border-dashed bg-white">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <BookCheck className="h-10 w-10 text-gray-400" />
              </div>
              <p className="text-xl font-semibold text-gray-700 mb-1">
                No quizzes attempted yet
              </p>
              <p className="text-gray-500">
                Your performance stats will appear here after your first quiz.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Total Attempts"
                value={progress.totalAttempts}
                icon={<BookCheck className="text-blue-600" />}
                color="blue"
              />
              <StatsCard
                title="Average Score"
                value={`${progress.averageScore.toFixed(1)}%`}
                icon={<Trophy className="text-green-600" />}
                color="green"
              />
              <StatsCard
                title="Correct Answers"
                value={progress.totalCorrectAnswers}
                icon={<Target className="text-purple-600" />}
                color="purple"
              />
              <StatsCard
                title="Total Questions"
                value={progress.totalQuestionsAnswered}
                icon={<BarChart3 className="text-orange-600" />}
                color="orange"
              />
            </div>

            {/* Performance Insight */}
            <div className="mb-10 overflow-hidden rounded-xl bg-white border shadow-sm flex flex-col md:flex-row">
              <div
                className={`w-2 shrink-0 ${
                  progress.averageScore >= 80
                    ? "bg-green-500"
                    : progress.averageScore >= 60
                    ? "bg-blue-500"
                    : "bg-orange-500"
                }`}
              />
              <div className="p-6 flex items-center justify-between w-full">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {progress.averageScore >= 80
                      ? "Excellent Performance! 🌟"
                      : progress.averageScore >= 60
                      ? "Great Progress! 📈"
                      : "Keep Practicing! 🎯"}
                  </h3>
                  <p className="text-gray-600">
                    {progress.averageScore >= 80
                      ? "You've mastered these topics. Keep maintaining this level!"
                      : progress.averageScore >= 60
                      ? "You're building a strong foundation. Aim for 80% next!"
                      : "Consistency is key. Review your incorrect answers to improve."}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Attempts Table */}
            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  Recent Quiz Attempts
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                    <tr>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Subject & Chapter</th>
                      <th className="px-6 py-4">Class</th>
                      <th className="px-6 py-4 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {attempts.map((attempt) => (
                      <tr
                        key={attempt._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                          {new Date(attempt.submittedAt).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-semibold text-gray-900">
                            {attempt.subject}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatChapter(attempt.chapter)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                          {typeof attempt.class === "object"
                            ? attempt.class.name
                            : attempt.class}
                          <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500">
                            Sec {attempt.section}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                              attempt.score >= 80
                                ? "bg-green-100 text-green-700"
                                : attempt.score >= 60
                                ? "bg-blue-100 text-blue-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {attempt.score.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// --- Helper Components ---

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => (
  <Card className="bg-white shadow-sm border-none ring-1 ring-gray-100">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className={`p-2 rounded-lg bg-${color}-50`}>{icon}</div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </CardContent>
  </Card>
);

export default StudentProgress;
