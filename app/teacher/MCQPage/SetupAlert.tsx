"use client";

import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Wrench, Loader2 } from "lucide-react";

interface SetupAlertProps {
  isSetupNeeded: boolean;
  isSettingUp: boolean;
  onSetup: () => void | Promise<void>;
}

const SetupAlert: React.FC<SetupAlertProps> = ({ 
  isSetupNeeded, 
  isSettingUp, 
  onSetup 
}) => {
  if (!isSetupNeeded) return null;

  return (
    <Alert className="border-orange-200 bg-orange-50">
      <Wrench className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800">
        <div className="flex items-center justify-between">
          <span>
            Python dependencies need to be installed before generating MCQs.
          </span>
          <Button
            onClick={onSetup}
            disabled={isSettingUp}
            className="ml-4 bg-orange-600 hover:bg-orange-700 text-white"
            size="sm"
          >
            {isSettingUp ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                <Wrench className="mr-2 h-4 w-4" />
                Setup Dependencies
              </>
            )}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default SetupAlert;