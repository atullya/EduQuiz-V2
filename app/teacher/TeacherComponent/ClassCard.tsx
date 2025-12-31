"use client";

import React from "react";
import {
  BookOpen,
  FileText,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  List,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


export interface ClassItem {
  classId: string;
  className?: string; 
  grade?: string | number;
  section: string;
  subject: string;
  chapter: string;
  mcqCount?: number;
  count?: number; 
  statusBreakdown?: {
    published: number;
    draft: number;
  };
}

interface ClassCardProps {
  classItem: ClassItem;
  handleDeleteClick: (item: ClassItem) => void;
  handleViewQuizzes: (item: ClassItem) => void;
  handleViewMCQs: (item: ClassItem) => void;
  isDeleting: boolean;
}

const ClassCard: React.FC<ClassCardProps> = ({
  classItem,
  handleDeleteClick,
  handleViewQuizzes,
  handleViewMCQs,
  isDeleting,
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {classItem.className || `Class ${classItem.section}`}
            </h3>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="text-gray-600">
                Grade {classItem.grade || "N/A"}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">Section {classItem.section}</span>
              <span className="text-gray-600">
                Chapter <span className="text-gray-400">•</span>{" "}
                {classItem.chapter}
              </span>

              {classItem.subject && (
                <span className="text-blue-600 font-medium">
                  {classItem.subject}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-900">
              Total MCQs: {classItem.mcqCount ?? classItem.count ?? 0}
            </span>
          </div>

          {classItem.statusBreakdown && (
            <div className="flex gap-3">
              {classItem.statusBreakdown.published > 0 && (
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">
                    {classItem.statusBreakdown.published} Published
                  </span>
                </div>
              )}
              {classItem.statusBreakdown.draft > 0 && (
                <div className="flex items-center gap-1">
                  <XCircle className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {classItem.statusBreakdown.draft} Draft
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2 pt-2 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewQuizzes(classItem)}
            className="w-full text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
          >
            <Eye className="mr-2 h-4 w-4" />
            View Progress
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewMCQs(classItem)}
            className="w-full text-green-600 hover:text-green-700 border-green-200 hover:border-green-300 hover:bg-green-50"
          >
            <List className="mr-2 h-4 w-4" />
            View MCQs
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteClick(classItem)}
            disabled={isDeleting}
            className="w-full text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassCard;
