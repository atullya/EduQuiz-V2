"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { ClassItem } from "./ClassCard";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  isDeleting: boolean;
  classInfo: ClassItem | null;
}

// --- Component ---

export default function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  classInfo,
}: DeleteConfirmationDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete all MCQs
            associated with{" "}
            <span className="font-semibold text-gray-900">
              {classInfo?.className} - {classInfo?.subject} (Section{" "}
              {classInfo?.section})
            </span>{" "}
            from your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              // Prevents the dialog from closing immediately if you want to control it via state
              e.preventDefault();
              onConfirm();
            }}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
