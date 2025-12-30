"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, CheckCircle, XCircle, User, Eye } from "lucide-react";

import { format } from "date-fns";
import { getAssignmentDetails } from "@/lib/store/teachers/teacherapi";

interface StudentProfile {
  firstName?: string;
  lastName?: string;
}

interface Student {
  _id: string;
  profile?: StudentProfile;
}

interface Submission {
  student: Student;
  submissionText?: string;
  submissionFile?: string;
  submittedAt?: string | Date;
}

interface AssignmentDetails {
  _id: string;
  assignmentTitle: string;
  submissions: Submission[];
  notSubmitted: Student[];
  submittedCount: number;
  totalStudents: number;
}

interface SubmissionViewDialogueProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submissionText?: string;
  submissionFile?: string;
  studentName?: string;
  assignmentTitle?: string;
}

const SubmissionViewDialogue: React.FC<SubmissionViewDialogueProps> = ({
  open,
  onOpenChange,
  submissionText,
  submissionFile,
  studentName,
  assignmentTitle,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Submission by {studentName}</DialogTitle>
          <DialogDescription>
            Assignment: <span className="font-semibold">{assignmentTitle}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow space-y-4 overflow-y-auto py-4">
          {submissionText && submissionText.trim() && (
            <div>
              <h4 className="font-semibold text-sm mb-1">Text Submission:</h4>
              <ScrollArea className="p-4 border rounded-md bg-gray-50 text-gray-800 whitespace-pre-wrap max-h-[200px]">
                <p>{submissionText}</p>
              </ScrollArea>
            </div>
          )}

          {submissionFile && (
            <div>
              <h4 className="font-semibold text-sm mb-1">PDF Submission:</h4>
              <div className="p-4 border rounded-md bg-green-50 flex justify-between items-center">
                <span className="text-sm text-gray-700">
                  📄 {submissionFile.split("/").pop()}
                </span>
                <Button
                  size="sm"
                  onClick={() => window.open(submissionFile, "_blank")}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View PDF
                </Button>
              </div>
            </div>
          )}

          {!submissionText?.trim() && !submissionFile && (
            <div className="p-8 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
              <p>No submission content found.</p>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface AssignmentDetailsDialogueProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignmentId: string;
}

const AssignmentDetailsDialogue: React.FC<AssignmentDetailsDialogueProps> = ({
  open,
  onOpenChange,
  assignmentId,
}) => {
  const [details, setDetails] = useState<AssignmentDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isSubmissionViewOpen, setIsSubmissionViewOpen] = useState(false);
  const [currentSubmissionText, setCurrentSubmissionText] =
    useState<string>("");
  const [currentSubmissionFile, setCurrentSubmissionFile] =
    useState<string>("");
  const [currentStudentName, setCurrentStudentName] = useState<string>("");

  const backendBaseUrl = "http://localhost:3000"; // Backend URL

  useEffect(() => {
    if (open && assignmentId) {
      const fetchDetails = async () => {
        setLoading(true);
        setError(null);
        try {
          const data: AssignmentDetails = await getAssignmentDetails(
            assignmentId
          );

          data.submissions = data.submissions.map((sub) => ({
            ...sub,
            submissionFile: sub.submissionFile
              ? `${backendBaseUrl}${sub.submissionFile}`
              : undefined,
          }));

          setDetails(data);
        } catch (err: any) {
          console.error("Failed to fetch assignment details:", err);
          setError(err.message || "Failed to load assignment details.");
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    } else {
      setDetails(null);
    }
  }, [open, assignmentId]);

  const handleViewSubmissionClick = (
    submissionText?: string,
    submissionFile?: string,
    studentName?: string
  ) => {
    setCurrentSubmissionText(submissionText || "");
    setCurrentSubmissionFile(submissionFile || "");
    setCurrentStudentName(studentName || "");
    setIsSubmissionViewOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Assignment Details
          </DialogTitle>
          <DialogDescription>
            {details?.assignmentTitle
              ? `Submissions for "${details.assignmentTitle}"`
              : "Loading assignment details..."}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 flex-grow">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
            <p className="text-gray-600">Loading submission details...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600 flex-grow">{error}</div>
        ) : !details ? (
          <div className="p-6 text-center text-gray-600 flex-grow">
            No details found.
          </div>
        ) : (
          <ScrollArea className="flex-grow pr-4 -mr-4">
            <div className="space-y-6 py-4">
              {/* Summary */}
              <div className="grid grid-cols-2 gap-4 text-lg font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Submitted: {details.submittedCount}
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  Not Submitted: {details.notSubmitted.length}
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-600" />
                  Total Students: {details.totalStudents}
                </div>
              </div>

              <Separator />

              {/* Submitted Students Table */}
              {details.submissions.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" /> Submitted
                    Students
                  </h3>
                  <div className="overflow-x-auto border rounded-lg shadow-sm">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead>Student Name</TableHead>
                          <TableHead>Submitted At</TableHead>
                          <TableHead className="text-right">
                            Submission
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {details.submissions.map((submission) => {
                          const studentName = `${
                            submission.student.profile?.firstName || ""
                          } ${
                            submission.student.profile?.lastName || ""
                          }`.trim();
                          return (
                            <TableRow
                              key={submission.student._id}
                              className="hover:bg-green-50 transition-colors"
                            >
                              <TableCell className="font-semibold text-base py-3">
                                {studentName}
                              </TableCell>
                              <TableCell className="text-sm text-gray-600">
                                {submission.submittedAt &&
                                  format(
                                    new Date(submission.submittedAt),
                                    "PPP p"
                                  )}
                              </TableCell>
                              <TableCell className="text-right">
                                {(submission.submissionText ||
                                  submission.submissionFile) && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleViewSubmissionClick(
                                        submission.submissionText,
                                        submission.submissionFile,
                                        studentName
                                      )
                                    }
                                  >
                                    <Eye className="mr-2 h-4 w-4" /> View
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* Not Submitted Students Table */}
              {details.notSubmitted.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600" /> Not Submitted
                    Students
                  </h3>
                  <div className="overflow-x-auto border rounded-lg shadow-sm">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead>Student Name</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {details.notSubmitted.map((student) => (
                          <TableRow
                            key={student._id}
                            className="hover:bg-red-50 transition-colors"
                          >
                            <TableCell className="font-semibold text-base py-3">
                              {student.profile?.firstName}{" "}
                              {student.profile?.lastName}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}

        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>

      <SubmissionViewDialogue
        open={isSubmissionViewOpen}
        onOpenChange={setIsSubmissionViewOpen}
        submissionText={currentSubmissionText}
        submissionFile={currentSubmissionFile}
        studentName={currentStudentName}
        assignmentTitle={details?.assignmentTitle}
      />
    </Dialog>
  );
};

export default AssignmentDetailsDialogue;
