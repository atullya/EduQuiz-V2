"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Zap } from "lucide-react";

interface ActionButtonsProps {
  onReset: () => void;
  onGenerate: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isGenerating: boolean;
  isSetupNeeded: boolean;
}

const ActionButtons: FC<ActionButtonsProps> = ({
  onReset,
  onGenerate,
  isGenerating,
  isSetupNeeded,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
      <Button
        type="button"
        variant="outline"
        onClick={onReset}
        className="flex-1 h-14 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
        disabled={isGenerating || isSetupNeeded}
      >
        Reset Form
      </Button>
      <Button
        onClick={onGenerate}
        className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm hover:shadow-md transition-all text-lg"
        disabled={isGenerating || isSetupNeeded}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Generating MCQs...
          </>
        ) : (
          <>
            <Zap className="mr-2 h-5 w-5" />
            Generate MCQs
          </>
        )}
      </Button>
    </div>
  );
};

export default ActionButtons;
