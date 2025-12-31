"use client";

import { FC, ChangeEvent } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

interface ContentInputFormData {
  platform: "" | "text" | "pdf";
  class: string;
  section: string;
  textContent: string;
  pdfFile: File | null;
}

interface ContentInputProps {
  formData: ContentInputFormData;
  onInputChange: (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isGenerating: boolean;
  isSetupNeeded: boolean;
}

const ContentInput: FC<ContentInputProps> = ({
  formData,
  onInputChange,
  onFileChange,
  isGenerating,
  isSetupNeeded,
}) => {
  const isClassSectionSelected = formData.class && formData.section;

  if (formData.platform === "text") {
    return (
      <div className="space-y-3 animate-in slide-in-from-top-5 duration-500">
        <Label
          htmlFor="textContent"
          className="text-lg font-semibold text-gray-700"
        >
          Text Content
        </Label>
        <Textarea
          id="textContent"
          name="textContent"
          placeholder="Paste your text content here... The AI will analyze this content and generate relevant multiple-choice questions."
          value={formData.textContent}
          onChange={onInputChange}
          className="min-h-[200px] text-base border-2 border-gray-200 focus:border-blue-500 resize-none"
          disabled={isGenerating || isSetupNeeded || !isClassSectionSelected}
        />
      </div>
    );
  }

  if (formData.platform === "pdf") {
    return (
      <div className="space-y-3 animate-in slide-in-from-top-5 duration-500">
        <Label className="text-lg font-semibold text-gray-700">
          Upload PDF File
        </Label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <div className="space-y-2">
            <p className="text-gray-600">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-500">PDF files only (Max 10MB)</p>
          </div>
          <Input
            type="file"
            accept=".pdf"
            onChange={onFileChange}
            className="mt-4"
            disabled={isGenerating || isSetupNeeded || !isClassSectionSelected}
          />
          {formData.pdfFile && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-green-800 font-medium">
                ✓ {formData.pdfFile.name}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default ContentInput;
