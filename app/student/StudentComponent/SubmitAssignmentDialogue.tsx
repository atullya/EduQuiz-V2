"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, FileText, Upload } from "lucide-react";
import { submitAssignemnt } from "@/lib/store/students/studentsapi";

interface Submission {
  submissionText?: string;
  submissionFile?: string;
}

interface Assignment {
  _id: string;
  title: string;
  isSubmitted?: boolean;
  submission?: Submission;
}

interface SubmitAssignmentDialogueProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignment?: Assignment | null;
  onSubmissionSuccess: () => void;
}

const SubmitAssignmentDialogue: React.FC<SubmitAssignmentDialogueProps> = ({
  open,
  onOpenChange,
  assignment,
  onSubmissionSuccess,
}) => {
  const [submissionText, setSubmissionText] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [submissionType, setSubmissionType] = useState<"text" | "pdf">("text");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [existingPdfName, setExistingPdfName] = useState<string>("");

  useEffect(() => {
    if (open && assignment) {
      const submission = assignment.submission || {};
      setSubmissionText(submission.submissionText || "");

      if (submission.submissionFile && !submission.submissionText) {
        setSubmissionType("pdf");
        setExistingPdfName(submission.submissionFile.split("/").pop() || "");
      } else if (submission.submissionText && !submission.submissionFile) {
        setSubmissionType("text");
      } else if (submission.submissionText && submission.submissionFile) {
        setSubmissionType("text");
        setExistingPdfName(submission.submissionFile.split("/").pop() || "");
      }

      setFile(null);
      setError(null);
    }
  }, [open, assignment]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile && selectedFile.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      setFile(null);
    } else {
      setFile(selectedFile);
      setExistingPdfName("");
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (submissionType === "text" && !submissionText.trim()) {
      setError("Please provide submission text.");
      return;
    }

    if (submissionType === "pdf" && !file && !existingPdfName) {
      setError("Please upload a PDF file.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append(
        "submissionText",
        submissionType === "text" ? submissionText : ""
      );

      if (submissionType === "pdf" && file) {
        formData.append("file", file);
      }

      if (!assignment) throw new Error("No assignment selected.");

      const res = await submitAssignemnt(assignment._id, formData);

      if (res.success) {
        onSubmissionSuccess();
        onOpenChange(false);
      } else {
        setError(res.message || "Failed to submit assignment.");
      }
    } catch (err: any) {
      setError(err.message || "Error submitting assignment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {assignment?.isSubmitted ? "Edit Submission" : "Submit Assignment"}
          </DialogTitle>
          <DialogDescription>
            {assignment?.isSubmitted
              ? `You can update your submission for "${assignment?.title}".`
              : `Submit your work for "${assignment?.title}".`}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-3">
            <Label>Choose Submission Type</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="submissionType"
                  value="text"
                  checked={submissionType === "text"}
                  onChange={(e) =>
                    setSubmissionType(e.target.value as "text" | "pdf")
                  }
                  disabled={loading}
                />
                <Label className="flex items-center cursor-pointer">
                  <FileText className="w-4 h-4 mr-1" /> Text
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="submissionType"
                  value="pdf"
                  checked={submissionType === "pdf"}
                  onChange={(e) =>
                    setSubmissionType(e.target.value as "text" | "pdf")
                  }
                  disabled={loading}
                />
                <Label className="flex items-center cursor-pointer">
                  <Upload className="w-4 h-4 mr-1" /> PDF
                </Label>
              </div>
            </div>
          </div>

          {submissionType === "text" && (
            <div className="space-y-2">
              <Label>Your Submission (Text)</Label>
              <Textarea
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                rows={8}
                disabled={loading}
              />
            </div>
          )}

          {submissionType === "pdf" && (
            <div className="space-y-2">
              <Label>Upload PDF File</Label>
              {existingPdfName && !file && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  Current file: <span>{existingPdfName}</span>
                </div>
              )}
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                disabled={loading}
              />
              {file && <p>New file selected: {file.name}</p>}
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading
              ? "Submitting..."
              : assignment?.isSubmitted
              ? "Update Submission"
              : "Submit Assignment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitAssignmentDialogue;
