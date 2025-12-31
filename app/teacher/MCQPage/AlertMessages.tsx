"use client";

import { FC } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

interface AlertMessagesProps {
  error: string;
  success: boolean;
  numberOfQuestions: string | number;
  successMessage?: string;
}

const AlertMessages: FC<AlertMessagesProps> = ({
  error,
  success,
  numberOfQuestions,
  successMessage,
}) => {
  return (
    <>
      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {successMessage
              ? successMessage
              : `Successfully generated ${numberOfQuestions} MCQ${
                  Number(numberOfQuestions) > 1 ? "s" : ""
                }!`}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default AlertMessages;
