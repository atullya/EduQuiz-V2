"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  Award,
  BarChart,
  Target,
  Users,
  ListChecks,
  User,
} from "lucide-react";
import { ClassItem } from "./ClassCard"; 


export interface StudentResult {
  studentId: string;
  name: string;
  email: string;
  submittedAt: string | Date;
  correctAnswers: number;
  totalQuestions: number;
  score: number;
}

export interface ProgressDataa {
  totalStudentsAttempted: number;
  averageScore: number;
  scoreDistribution: Record<string, number>; 
  studentResults: StudentResult[];
}

export interface ProgressDialogProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  classOverview: ClassItem | null;
  loading: boolean;
  error: string | null;
  progressData: ProgressDataa | null;
}


export default function ProgressDialog({
  isOpen,
  onClose,
  classOverview,
  loading,
  error,
  progressData,
}: ProgressDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!w-[60vw] !max-w-[80vw] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-gray-900">
            Progress for {classOverview?.className} - {classOverview?.subject}{" "}
            (Section {classOverview?.section})
          </DialogTitle>
          <DialogDescription>
            Detailed performance metrics and student results for this class.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
            <p className="text-gray-600">Loading progress details...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">{error}</div>
        ) : !progressData || progressData.totalStudentsAttempted === 0 ? (
          <div className="p-10 text-center text-gray-600">
            <Award className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-lg font-medium">
              No quiz attempts recorded for this class/subject yet.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Students need to complete quizzes to see data here.
            </p>
          </div>
        ) : (
          <div className="space-y-8 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Students Attempted
                  </CardTitle>
                  <Users className="h-5 w-5 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-blue-700">
                    {progressData.totalStudentsAttempted}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Score
                  </CardTitle>
                  <Target className="h-5 w-5 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-green-700">
                    {progressData.averageScore.toFixed(2)}%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Score Distribution
                  </CardTitle>
                  <BarChart className="h-5 w-5 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-md text-gray-700">
                    {Object.entries(progressData.scoreDistribution).map(
                      ([range, count]) => (
                        <p key={range}>
                          <span className="font-semibold">{range}%:</span>{" "}
                          {count} students
                        </p>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="p-6">
              <CardTitle className="text-2xl font-bold mb-6 flex items-center gap-2">
                <ListChecks className="h-6 w-6 text-gray-700" /> Student Results
              </CardTitle>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-[200px]">Student Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Last Attempt</TableHead>
                      <TableHead className="text-center">
                        Correct / Total
                      </TableHead>
                      <TableHead className="text-right">Score (%)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {progressData.studentResults.map((result) => (
                      <TableRow key={result.studentId}>
                        <TableCell className="font-medium flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          {result.name}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {result.email}
                        </TableCell>
                        <TableCell>
                          {new Date(result.submittedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-center">
                          {result.correctAnswers} / {result.totalQuestions}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          <span
                            className={`${
                              result.score >= 70
                                ? "text-green-600"
                                : result.score >= 50
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {result.score.toFixed(2)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
