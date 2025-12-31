"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Download } from "lucide-react";

interface Submission {
  submissionText?: string;
  submissionFile?: string;
}

interface SubmissionViewDialogueStudentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission?: Submission | null;
  assignmentTitle: string;
}

const SubmissionViewDialogueStudent: React.FC<
  SubmissionViewDialogueStudentProps
> = ({ open, onOpenChange, submission, assignmentTitle }) => {
  const submissionData = submission || {};
  const submissionText = submissionData.submissionText || "";
  const fileUrl = submissionData.submissionFile || null;

  const getFileName = (url: string | null) =>
    url ? url.split("/").pop() : "document.pdf";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>My Submission</DialogTitle>
          <DialogDescription>
            Submission for "<strong>{assignmentTitle}</strong>"
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow space-y-4">
          {submissionText && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h4 className="font-semibold text-sm">Text Submission:</h4>
              </div>
              <ScrollArea className="p-4 border rounded-md bg-gray-50 max-h-[200px]">
                <p>{submissionText}</p>
              </ScrollArea>
            </div>
          )}

          {fileUrl && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Download className="w-4 h-4 text-green-600" />
                <h4 className="font-semibold text-sm">PDF Submission:</h4>
              </div>
              <div className="p-4 border rounded-md bg-green-50 flex justify-between items-center">
                <span>📄 {getFileName(fileUrl)}</span>
                {/* Uncomment this if you want a button to open PDF */}
                {/* <Button size="sm" onClick={() => window.open(fileUrl, "_blank")}>
                  <Download className="w-3 h-3 mr-1" /> View PDF
                </Button> */}
              </div>
            </div>
          )}

          {!submissionText && !fileUrl && (
            <div className="p-8 text-center text-gray-500 border-2 border-dashed rounded-lg">
              <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No submission found.</p>
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

export default SubmissionViewDialogueStudent;
