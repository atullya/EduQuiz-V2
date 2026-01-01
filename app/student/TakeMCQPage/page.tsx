"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Timer,
  AlertCircle,
  CheckCircle2,
  Loader2,
  BookOpen,
  Clock,
  FileText,
  ChevronRight,
  Award,
} from "lucide-react";
import { fetchStudentQuizzes, submitStudentQuiz } from "@/lib/store/smcq/sapi";

// ----------------------------------------
// Types / Interfaces
// ----------------------------------------

interface Option {
  _id: string;
  key: string;
  value: string;
}

interface MCQ {
  _id: string;
  question: string;
  options: Option[];
}

interface QuizResponse {
  success: boolean;
  mcqs: MCQ[];
  alreadyAttempted: boolean;
  duration?: number;
  message?: string;
}

// ----------------------------------------
// Main Quiz Content Component
// ----------------------------------------

const QuizContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- Query params ---
  const classId = searchParams.get("classId") ?? "";
  const section = searchParams.get("section") ?? "";
  const subject = searchParams.get("subject") ?? "";
  const chapter = searchParams.get("chapter") ?? "";
  const userId = searchParams.get("userId") ?? "";

  // --- States ---
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alreadyAttempted, setAlreadyAttempted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Prevent page unload while quiz is active ---
  useEffect(() => {
    if (!showQuiz || isSubmitting) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue =
        "You have an active quiz. Are you sure you want to leave? Your progress will not be saved.";
      return e.returnValue;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [showQuiz, isSubmitting]);

  // --- Fetch MCQs using centralized API ---
  useEffect(() => {
    if (!classId || !section || !subject || !chapter || !userId) {
      setError("Missing quiz parameters.");
      setLoading(false);
      return;
    }

    const loadQuiz = async () => {
      try {
        setLoading(true);

        // ✅ call centralized fetchStudentQuizzes
        const res: QuizResponse = await fetchStudentQuizzes(
          userId,
          classId,
          section,
          subject,
          chapter
        );

        if (res.success) {
          setMcqs(res.mcqs || []);
          setAlreadyAttempted(res.alreadyAttempted || false);
          const d = res.duration || 10;
          setDuration(d);
          setTimeLeft(d * 60);
        } else {
          setError(res.message || "Failed to load quiz.");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching quiz data.");
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [classId, section, subject, chapter, userId]);

  // --- Submit Quiz using centralized API ---
  const handleSubmit = useCallback(
    async (auto = false) => {
      if (!auto && !window.confirm("Submit quiz?")) return;

      setIsSubmitting(true);

      try {
        // Only send answered questions
        const payload: { mcqId: string; selectedOption: string }[] = mcqs
          .filter((q) => answers[q._id])
          .map((q) => ({
            mcqId: q._id,
            selectedOption: answers[q._id] as string,
          }));

        // ✅ use centralized submitStudentQuiz
        const res = await submitStudentQuiz(
          userId,
          classId,
          section,
          subject,
          chapter,
          payload
        );

        if (res.success) {
          alert("Quiz submitted successfully!");
          router.push("/studentDashboard");
        } else {
          alert(res.message || "Failed to submit quiz.");
          setIsSubmitting(false);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to submit quiz.");
        setIsSubmitting(false);
      }
    },
    [answers, mcqs, classId, section, subject, chapter, userId, router]
  );

  // --- Timer ---
  useEffect(() => {
    if (showQuiz && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }

    if (timeLeft === 0 && showQuiz) handleSubmit(true);
  }, [showQuiz, timeLeft, handleSubmit]);

  // --- Loading state ---
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-16 h-16 animate-spin text-primary opacity-20" />
        <p className="mt-6 text-lg text-muted-foreground animate-pulse">
          Preparing your quiz session...
        </p>
      </div>
    );

  // --- Error state ---
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="max-w-md w-full border-destructive/20 shadow-2xl">
          <CardContent className="pt-10 pb-8 text-center">
            <div className="bg-destructive/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Quiz Unavailable</h2>
            <p className="text-muted-foreground mb-8">{error}</p>
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="w-full"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );

  // --- Already attempted state ---
  if (alreadyAttempted)
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="max-w-md w-full border-primary/20 shadow-2xl">
          <CardContent className="pt-10 pb-8 text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Quiz Completed</h2>
            <p className="text-muted-foreground mb-8">
              You have already submitted this quiz.
            </p>
            <Button
              onClick={() => router.back()}
              className="w-full bg-primary hover:bg-primary/90 transition-all"
            >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );

  // --- Quiz UI ---
  return (
    <div className="min-h-screen bg-background font-sans">
      {!showQuiz ? (
        <StartScreen
          duration={duration}
          mcqsCount={mcqs.length}
          setShowQuiz={setShowQuiz}
        />
      ) : (
        <QuizInterface
          mcqs={mcqs}
          answers={answers}
          setAnswers={setAnswers}
          timeLeft={timeLeft}
          duration={duration}
          subject={subject}
          chapter={chapter}
          section={section}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

// ----------------------------------------
// Start Screen Component
// ----------------------------------------

const StartScreen = ({
  duration,
  mcqsCount,
  setShowQuiz,
}: {
  duration: number;
  mcqsCount: number;
  setShowQuiz: (val: boolean) => void;
}) => (
  <div className="flex items-center justify-center min-h-screen p-4">
    <Card className="max-w-2xl w-full overflow-hidden shadow-2xl">
      <div className="bg-primary p-8 text-primary-foreground">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/20 p-2 rounded-lg">
            <BookOpen className="w-6 h-6" />
          </div>
          <span className="uppercase tracking-wider text-xs font-bold opacity-80">
            Online Assessment
          </span>
        </div>
        <h2 className="text-4xl font-extrabold mb-2 leading-tight">
          📋 Quiz Instructions
        </h2>
        <p className="text-primary-foreground/80">
          Please read the instructions carefully before starting the assessment.
        </p>
      </div>
      <CardContent className="p-8 space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <InfoBox
            icon={<Clock className="w-5 h-5" />}
            title="Duration"
            value={`${duration} Minutes`}
          />
          <InfoBox
            icon={<FileText className="w-5 h-5" />}
            title="Questions"
            value={`${mcqsCount} MCQs`}
          />
        </div>
        <Rules />
      </CardContent>
      <CardFooter className="p-8 pt-0">
        <Button
          onClick={() => setShowQuiz(true)}
          className="w-full py-6 text-lg font-bold bg-primary hover:bg-primary/90 transition-all shadow-xl rounded-xl flex gap-2"
        >
          Start Quiz Now <ChevronRight className="w-5 h-5" />
        </Button>
      </CardFooter>
    </Card>
  </div>
);

// ----------------------------------------
// Info Box
// ----------------------------------------

const InfoBox = ({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) => (
  <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border">
    <div className="bg-primary/10 p-2 rounded-lg text-primary">{icon}</div>
    <div>
      <p className="text-xs text-muted-foreground font-medium uppercase">
        {title}
      </p>
      <p className="font-bold">{value}</p>
    </div>
  </div>
);

// ----------------------------------------
// Rules
// ----------------------------------------

const Rules = () => (
  <div className="space-y-4">
    <h3 className="font-bold text-lg flex items-center gap-2">
      <Award className="w-5 h-5 text-primary" /> Rules & Guidelines
    </h3>
    <ul className="space-y-3">
      {[
        "Each question has only one correct option.",
        "Ensure a stable internet connection before starting.",
        "The quiz will auto-submit once the timer expires.",
        "Do not refresh the page while the quiz is in progress.",
      ].map((rule, i) => (
        <li key={i} className="flex gap-3 text-sm text-muted-foreground">
          <div className="w-5 h-5 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold text-xs mt-0.5">
            {i + 1}
          </div>
          {rule}
        </li>
      ))}
    </ul>
  </div>
);

// ----------------------------------------
// Quiz Interface
// ----------------------------------------

const QuizInterface = ({
  mcqs,
  answers,
  setAnswers,
  timeLeft,
  duration,
  subject,
  chapter,
  section,
  handleSubmit,
}: {
  mcqs: MCQ[];
  answers: Record<string, string>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  timeLeft: number;
  duration: number;
  subject: string;
  chapter: string;
  section: string;
  handleSubmit: (auto?: boolean) => void;
}) => (
  <div className="pb-20">
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary">{subject}</h1>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            Chapter {chapter} • Section {section}
          </p>
        </div>
        <div
          className={`flex items-center gap-3 px-4 py-2 rounded-full border-2 transition-colors ${
            timeLeft < 60
              ? "bg-destructive/5 border-destructive text-destructive animate-pulse"
              : "bg-secondary border-border text-foreground"
          }`}
        >
          <Timer
            className={`w-5 h-5 ${
              timeLeft < 60 ? "text-destructive" : "text-primary"
            }`}
          />
          <span className="font-mono text-lg font-bold">
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
          </span>
        </div>
      </div>
      <div className="h-1 bg-secondary w-full">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${
            timeLeft < 60 ? "bg-destructive" : "bg-primary"
          }`}
          style={{ width: `${(timeLeft / (duration * 60)) * 100}%` }}
        />
      </div>
    </header>

    <main className="max-w-3xl mx-auto p-6 space-y-8 mt-4">
      {mcqs.map((q, idx) => (
        <Card
          key={q._id}
          className="border-none shadow-lg shadow-secondary/20 overflow-hidden group"
        >
          <CardHeader className="bg-secondary/30 group-hover:bg-secondary/50 transition-colors border-b border-border/50">
            <div className="flex gap-4">
              <span className="bg-primary text-primary-foreground w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">
                {idx + 1}
              </span>
              <CardTitle className="text-lg leading-relaxed pt-0.5">
                {q.question}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <RadioGroup
              value={answers[q._id] || ""}
              onValueChange={(val) =>
                setAnswers((prev) => ({ ...prev, [q._id]: val }))
              }
              className="grid gap-4"
            >
              {q.options.map((opt) => (
                <div key={opt._id} className="relative">
                  <RadioGroupItem
                    value={opt._id}
                    id={`${q._id}-${opt.key}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`${q._id}-${opt.key}`}
                    className="flex items-center gap-4 p-4 rounded-xl border-2 border-border cursor-pointer transition-all hover:bg-secondary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:shadow-inner"
                  >
                    <div className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center text-xs font-bold transition-colors peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground">
                      {opt.key}
                    </div>
                    <span className="text-base font-medium">{opt.value}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      ))}

      <div className="pt-8 flex justify-center">
        <Button
          onClick={() => handleSubmit(false)}
          size="lg"
          className="px-12 py-7 text-xl font-bold bg-primary hover:bg-primary/90 transition-all shadow-xl rounded-2xl group"
        >
          Submit Quiz{" "}
          <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </main>
  </div>
);

// ----------------------------------------
// Page wrapper with Suspense
// ----------------------------------------

const StartQuiz = () => (
  <Suspense
    fallback={
      <Loader2 className="w-16 h-16 animate-spin text-primary m-auto mt-40" />
    }
  >
    <QuizContent />
  </Suspense>
);

export default StartQuiz;
