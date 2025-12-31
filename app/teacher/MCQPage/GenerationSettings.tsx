"use client";

import { FC, ChangeEvent } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface MCQFormData {
  numberOfQuestions: string;
  chapter: string;
  mcqDuration: string;
  platform: "text" | "pdf" | "";
}

interface GenerationSettingsProps {
  formData: MCQFormData;
  onSelectChange: (name: keyof MCQFormData, value: string) => void;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isGenerating: boolean;
}

const GenerationSettings: FC<GenerationSettingsProps> = ({
  formData,
  onSelectChange,
  onInputChange,
  isGenerating,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Number of Questions Select */}
      <div className="space-y-2">
        <Label htmlFor="numberOfQuestions">Number of Questions</Label>
        <Select
          name="numberOfQuestions"
          value={formData.numberOfQuestions}
          onValueChange={(value) => onSelectChange("numberOfQuestions", value)}
          disabled={isGenerating}
        >
          <SelectTrigger id="numberOfQuestions">
            <SelectValue placeholder="Select number of questions" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <SelectItem key={num} value={String(num)}>
                {num}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Chapter Input */}
      <div className="space-y-2">
        <Label htmlFor="chapter">Chapter</Label>
        <Input
          id="chapter"
          name="chapter"
          type="text"
          placeholder="Enter chapter name"
          value={formData.chapter}
          onChange={onInputChange}
          disabled={isGenerating}
        />
      </div>

      {/* MCQ Duration Input */}
      <div className="space-y-2">
        <Label htmlFor="mcqDuration">MCQ Duration (minutes)</Label>
        <Input
          id="mcqDuration"
          name="mcqDuration"
          type="number"
          placeholder="e.g., 30"
          value={formData.mcqDuration}
          onChange={onInputChange}
          disabled={isGenerating}
          min={1}
        />
      </div>

      {/* Platform Select */}
      <div className="space-y-2">
        <Label htmlFor="platform">Content Platform</Label>
        <Select
          name="platform"
          value={formData.platform}
          onValueChange={(value) => onSelectChange("platform", value)}
          disabled={isGenerating}
        >
          <SelectTrigger id="platform">
            <SelectValue placeholder="Select content platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text Content</SelectItem>
            <SelectItem value="pdf">PDF File</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default GenerationSettings;
