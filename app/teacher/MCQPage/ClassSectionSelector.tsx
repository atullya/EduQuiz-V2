"use client";

import { FC, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap, Users, BookOpenCheck } from "lucide-react";

interface AssignedClass {
  classId: string;
  grade: string;
  section: string;
  subject: string[];
}

interface FormData {
  class: string;
  section: string;
  subject: string;
  classId: string;
}

interface ClassSectionSelectorProps {
  user: { _id?: string; role?: string };
  formData: FormData;
  onSelectChange: (field: keyof FormData, value: string) => void;
  isGenerating: boolean;
  assignedClasses?: AssignedClass[]; // optional, can be passed later
}

const ClassSectionSelector: FC<ClassSectionSelectorProps> = ({
  user,
  formData,
  onSelectChange,
  isGenerating,
  assignedClasses: initialAssignedClasses = [],
}) => {
  const [assignedClasses, setAssignedClasses] = useState<AssignedClass[]>(
    initialAssignedClasses
  );
  const [availableGrades, setAvailableGrades] = useState<string[]>([]);
  const [availableSections, setAvailableSections] = useState<string[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);

  // Setup grades from assignedClasses
  useEffect(() => {
    const uniqueGrades = [...new Set(assignedClasses.map((cls) => cls.grade))];
    setAvailableGrades(uniqueGrades);
  }, [assignedClasses]);

  // Update sections based on selected grade
  useEffect(() => {
    if (formData.class) {
      const sections = assignedClasses
        .filter((cls) => cls.grade === formData.class)
        .map((cls) => cls.section);
      setAvailableSections([...new Set(sections)]);
    } else {
      setAvailableSections([]);
    }
  }, [formData.class, assignedClasses]);

  // Update subjects based on selected grade + section
  useEffect(() => {
    if (formData.class && formData.section) {
      const selectedClass = assignedClasses.find(
        (cls) =>
          cls.grade === formData.class && cls.section === formData.section
      );
      setAvailableSubjects(selectedClass?.subject || []);
    } else {
      setAvailableSubjects([]);
    }
  }, [formData.class, formData.section, assignedClasses]);

  // Update classId when class + section changes
  useEffect(() => {
    if (formData.class && formData.section) {
      const selectedClass = assignedClasses.find(
        (cls) =>
          cls.grade === formData.class && cls.section === formData.section
      );
      onSelectChange("classId", selectedClass?.classId || "");
    } else if (formData.classId !== "") {
      onSelectChange("classId", "");
    }
  }, [formData.class, formData.section, assignedClasses, onSelectChange]);

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg border border-gray-200">
      <div className="space-y-1">
        <h3 className="text-lg font-medium text-gray-900">Class & Section</h3>
        <p className="text-sm text-gray-500">
          Select the target class, section, and subject
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Grade */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <GraduationCap className="h-4 w-4" />
            Grade
          </Label>
          <Select
            value={formData.class}
            onValueChange={(value) => {
              onSelectChange("class", value);
              onSelectChange("section", "");
              onSelectChange("subject", "");
            }}
            disabled={isGenerating}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>
            <SelectContent>
              {availableGrades.map((grade) => (
                <SelectItem key={grade} value={grade}>
                  {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Section */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Users className="h-4 w-4" />
            Section
          </Label>
          <Select
            value={formData.section}
            onValueChange={(value) => {
              onSelectChange("section", value);
              onSelectChange("subject", "");
            }}
            disabled={isGenerating || !formData.class}
          >
            <SelectTrigger className="h-10">
              <SelectValue
                placeholder={
                  formData.class ? "Select section" : "Select grade first"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {availableSections.map((section) => (
                <SelectItem key={section} value={section}>
                  {section}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <BookOpenCheck className="h-4 w-4" />
            Subject
          </Label>
          <Select
            value={formData.subject || ""}
            onValueChange={(value) => onSelectChange("subject", value)}
            disabled={isGenerating || availableSubjects.length === 0}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {availableSubjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {formData.class && formData.section && (
        <div className="p-3 bg-gray-50 rounded border text-center">
          <span className="text-sm text-gray-600">
            Selected: Grade {formData.class}, Section {formData.section}
            {formData.subject && `, Subject: ${formData.subject}`}
            {formData.classId && ` (ID: ${formData.classId})`}
          </span>
        </div>
      )}
    </div>
  );
};

export default ClassSectionSelector;
