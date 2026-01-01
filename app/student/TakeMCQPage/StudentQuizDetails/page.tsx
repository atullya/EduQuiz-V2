"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { viewStudentQuizDetails } from "@/lib/store/smcq/sapi";

interface Option {
  _id: string;
  key: string;
  value: string;
}

interface QuizDetailItem {
  questionId: string;
  question: string;
  options: Option[];
  selectedOption: string | null;
  correctAnswer: string;
  isCorrect: boolean;
}

interface QuizDetailsResponse {
  success: boolean;
  quizDetails: QuizDetailItem[];
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  message?: string;
}

const QuizDetailsContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const classId = searchParams.get("classId") ?? "";
  const section = searchParams.get("section") ?? "";
  const subject = searchParams.get("subject") ?? "";
  const chapter = searchParams.get("chapter") ?? "";
  const studentId = searchParams.get("userId") ?? "";

  const [quizDetails, setQuizDetails] = useState<QuizDetailItem[]>([]);
  const [score, setScore] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      if (!studentId || !classId || !section || !subject || !chapter) {
        setError(
          "Missing required parameters. Please access via the class list page."
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res: QuizDetailsResponse = await viewStudentQuizDetails(
          studentId,
          classId,
          section,
          subject,
          chapter
        );

        if (res.success) {
          setQuizDetails(res.quizDetails);
          setScore(res.score);
          setTotalQuestions(res.totalQuestions);
          setCorrectAnswers(res.correctAnswers);
        } else {
          setError(res.message || "Failed to fetch quiz details.");
        }
      } catch (err: any) {
        console.error("Error fetching quiz details:", err);
        setError("Failed to fetch quiz details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDetails();
  }, [studentId, classId, section, subject, chapter]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Loading quiz details...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto font-sans">
      {error ? (
        <div className="mb-6">
          <Alert
            variant="destructive"
            className="flex flex-col items-center text-center p-6"
          >
            <AlertTitle className="text-xl font-bold mb-2">Error</AlertTitle>
            <AlertDescription className="mb-6">{error}</AlertDescription>
            <Button
              onClick={() => router.back()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            >
              Go Back
            </Button>
          </Alert>
        </div>
      ) : (
        <>
          <div className="mb-8 border-b pb-4">
            <h2 className="text-3xl font-bold text-gray-900">
              Quiz Results: {subject}
            </h2>
            <p className="text-lg text-gray-600 mt-2">
              Chapter: {chapter} | Section: {section}
            </p>
            <div className="flex gap-4 mt-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <span className="block text-sm text-blue-600 font-semibold uppercase">
                  Score
                </span>
                <span className="text-2xl font-bold">{score.toFixed(2)}%</span>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <span className="block text-sm text-green-600 font-semibold uppercase">
                  Correct
                </span>
                <span className="text-2xl font-bold">
                  {correctAnswers} / {totalQuestions}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {quizDetails.map((q, idx) => (
              <Card
                key={q.questionId}
                className="overflow-hidden border-l-4 shadow-sm"
                style={{ borderLeftColor: q.isCorrect ? "#22c55e" : "#ef4444" }}
              >
                <CardContent className="p-5 space-y-4">
                  <div className="font-bold text-gray-800 text-lg">
                    {idx + 1}. {q.question}
                  </div>

                  <RadioGroup
                    value={q.selectedOption || ""}
                    disabled
                    className="space-y-3"
                  >
                    {q.options.map((opt) => {
                      const isSelected = q.selectedOption === opt._id;
                      return (
                        <div
                          key={opt._id}
                          className="flex items-center space-x-3"
                        >
                          <RadioGroupItem
                            value={opt._id}
                            id={`${q.questionId}-${opt.key}`}
                          />
                          <Label
                            htmlFor={`${q.questionId}-${opt.key}`}
                            className={`text-base cursor-default ${
                              isSelected
                                ? q.isCorrect
                                  ? "text-green-600 font-bold"
                                  : "text-red-600 font-bold"
                                : "text-gray-700"
                            }`}
                          >
                            <span className="font-semibold">{opt.key}.</span>{" "}
                            {opt.value}
                            {isSelected && (
                              <span className="ml-2 text-sm italic">
                                (
                                {q.isCorrect
                                  ? "Your Correct Answer"
                                  : "Your Answer"}
                                )
                              </span>
                            )}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>

                  <div
                    className={`mt-2 p-3 rounded text-sm ${
                      q.isCorrect
                        ? "bg-green-50 text-green-800"
                        : "bg-red-50 text-red-800"
                    }`}
                  >
                    <strong>Correct Answer:</strong> {q.correctAnswer}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button
              onClick={() => router.back()}
              className="bg-gray-800 hover:bg-gray-900 text-white px-10 py-2 rounded-xl"
            >
              Return to Dashboard
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default function StudentQuizDetails() {
  return (
    <Suspense
      fallback={<div className="p-6 text-center">Loading search params...</div>}
    >
      <QuizDetailsContent />
    </Suspense>
  );
}
