"use client";

import React, { useEffect, useState } from "react";
import ClassCard, { ClassItem } from "./ClassCard";
import ProgressDialog, { ProgressDataa } from "./ProgressDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import ViewMCQsModal, { MCQ } from "./ViewMCQsModal";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { getMCQwithClasses } from "@/lib/store/mcq/mcqapi";
import {
  deleteTeacherMCQs,
  getAllMCQs,
  getTeacherProgress,
} from "@/lib/store/smcq/sapi";

interface StatsPageProps {
  setActiveTab: (tab: string) => void;
}

export default function StatsPage({ setActiveTab }: StatsPageProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const [subjectsWithMCQs, setSubjectsWithMCQs] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [dialogClassOverview, setDialogClassOverview] =
    useState<ClassItem | null>(null);
  const [selectedClassProgress, setSelectedClassProgress] =
    useState<ProgressDataa | null>(null);
  const [dialogLoading, setDialogLoading] = useState<boolean>(false);
  const [dialogError, setDialogError] = useState<string | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<ClassItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [isMCQModalOpen, setIsMCQModalOpen] = useState<boolean>(false);
  const [mcqsData, setMcqsData] = useState<MCQ[]>([]);
  const [mcqsLoading, setMcqsLoading] = useState<boolean>(false);
  const [mcqsError, setMcqsError] = useState<string | null>(null);
  const [selectedClassForMCQs, setSelectedClassForMCQs] =
    useState<ClassItem | null>(null);

  const fetchSubjectsOverview = async () => {
    if (!user?._id) return setError("User ID is missing.");
    setLoading(true);
    setError(null);

    try {
      const response = await getMCQwithClasses(user._id);

      if (response.success && response.data?.subjectsWithMCQs) {
        setSubjectsWithMCQs(response.data.subjectsWithMCQs);
      } else {
        setSubjectsWithMCQs([]); 
        setError("Failed to fetch MCQ overview.");
      }
    } catch {
      setSubjectsWithMCQs([]); 
      setError("Something went wrong while fetching MCQs.");
    } finally {
      setLoading(false);
    }
  };

  const fetchClassProgress = async (classItem: ClassItem) => {
    setDialogLoading(true);
    setDialogError(null);
    try {
      if (!user?._id) return;
      const res = await getTeacherProgress(
        classItem.classId,
        classItem.section,
        classItem.subject,
        classItem.chapter
      );

      if (res.success) {
        const students = res.progress?.students || [];
        const progress: ProgressDataa = {
          totalStudentsAttempted: students.length,
          averageScore:
            students.length > 0
              ? students.reduce(
                  (sum: number, s: any) => sum + (s.score || 0),
                  0
                ) / students.length
              : 0,
          scoreDistribution: students.reduce(
            (dist: Record<string, number>, s: any) => {
              const score = s.score || 0;
              let range = "";
              if (score >= 90) range = "90-100";
              else if (score >= 80) range = "80-89";
              else if (score >= 70) range = "70-79";
              else if (score >= 60) range = "60-69";
              else if (score >= 50) range = "50-59";
              else range = "0-49";
              dist[range] = (dist[range] || 0) + 1;
              return dist;
            },
            {}
          ),
          studentResults: students.map((s: any) => ({
            studentId: s._id,
            name: s.name,
            email: s.email,
            submittedAt: s.submittedAt,
            correctAnswers: s.correctAnswers,
            totalQuestions: s.totalQuestions,
            score: s.score,
          })),
        };

        setSelectedClassProgress(progress);
      } else setDialogError("Failed to fetch progress.");
    } catch {
      setDialogError("Error getting progress.");
    } finally {
      setDialogLoading(false);
    }
  };

  const fetchMCQsForClass = async (classItem: ClassItem) => {
    setMcqsLoading(true);
    setMcqsError(null);
    try {
      if (!user?._id) return;
      const res = await getAllMCQs({
        classId: classItem.classId,
        teacherId: user._id,
        subject: classItem.subject,
        chapter: classItem.chapter,
      });
      if (res.success) {
        const transformedMCQs: MCQ[] = res.mcqs.map((mcq: any) => ({
          id: mcq._id,
          question: mcq.question,
          duration: mcq.duration || 60,
          correctAnswer: mcq.answer,
          explanation: mcq.explanation || "",
          createdAt: mcq.createdAt || new Date().toISOString(),
          teacher: mcq.teacher || { username: "Unknown" },
          options: mcq.options.map((opt: any, idx: number) => ({
            _id: opt._id || `${mcq._id}-${idx}`,
            key: opt.key || String.fromCharCode(65 + idx),
            value: opt.value || opt,
          })),
        }));
        setMcqsData(transformedMCQs);
      } else setMcqsError("Failed to fetch MCQs.");
    } catch {
      setMcqsError("Error loading MCQs.");
    } finally {
      setMcqsLoading(false);
    }
  };

  const handleDeleteClick = (classItem: ClassItem) => {
    setDeleteTarget(classItem);
    setIsDeleteDialogOpen(true);
  };
  const confirmDelete = async () => {
    if (!deleteTarget || !user?._id) return;
    setIsDeleting(true);
    try {
      const res = await deleteTeacherMCQs(
        user._id,
        deleteTarget.classId,
        deleteTarget.section,
        deleteTarget.subject,
        deleteTarget.chapter
      );
      if (res.success) fetchSubjectsOverview();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setDeleteTarget(null);
    }
  };
  const handleViewQuizzes = (classItem: ClassItem) => {
    setDialogClassOverview(classItem);
    setIsDialogOpen(true);
    fetchClassProgress(classItem);
  };
  const handleViewMCQs = (classItem: ClassItem) => {
    setSelectedClassForMCQs(classItem);
    setIsMCQModalOpen(true);
    fetchMCQsForClass(classItem);
  };

  useEffect(() => {
    if (user?.role === "teacher") fetchSubjectsOverview();
    else setLoading(false);
  }, [user?._id]);

  if (!user)
    return <div className="p-10 text-center">Loading user info...</div>;
  if (loading) return <div className="p-10 text-center">Loading data...</div>;
  if (error)
    return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen p-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold">Quiz Dashboard</h2>
          <p className="text-gray-600 text-sm mt-1">
            Your class-wise quiz list
          </p>
        </div>

        {!subjectsWithMCQs || subjectsWithMCQs.length === 0 ? (
          <div className="border border-gray-300 p-6 rounded text-center">
            <h3 className="text-lg font-medium mb-2">No Quizzes Found</h3>
            <p className="text-sm text-gray-600">
              You haven't created any quizzes yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {subjectsWithMCQs.map((item) => (
              <ClassCard
                key={`${item.classId}-${item.subject}-${item.chapter}`}
                classItem={{
                  ...item,
                  className: item.className || `Class ${item.section}`,
                  grade: item.grade || "N/A",
                  mcqCount: item.count || 0,
                  statusBreakdown: item.statusBreakdown || {
                    published: 0,
                    draft: 0,
                  },
                }}
                handleDeleteClick={handleDeleteClick}
                handleViewQuizzes={handleViewQuizzes}
                handleViewMCQs={handleViewMCQs}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        )}
      </div>

      <ProgressDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        classOverview={dialogClassOverview}
        loading={dialogLoading}
        error={dialogError}
        progressData={selectedClassProgress}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        classInfo={deleteTarget}
      />

      <ViewMCQsModal
        isOpen={isMCQModalOpen}
        onClose={() => setIsMCQModalOpen(false)}
        mcqs={mcqsData}
        loading={mcqsLoading}
        error={mcqsError}
        classInfo={selectedClassForMCQs}
      />
    </div>
  );
}
