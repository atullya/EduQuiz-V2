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
import { teacherStats } from "@/lib/store/teachers/teacherapi";

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
  assignedClasses?: AssignedClass[];
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

  // Fetch assigned classes for the teacher
  useEffect(() => {
    const fetchClasses = async () => {
      if (!user?._id || user.role !== "teacher") return;

      try {
        const response = await teacherStats(user._id);
        const classData: AssignedClass[] = response?.classStudentCounts || [];
        setAssignedClasses(classData);

        const uniqueGrades = [...new Set(classData.map((cls) => cls.grade))];
        setAvailableGrades(uniqueGrades);
      } catch (err: any) {
        console.error("Failed to fetch assigned classes:", err.message);
      }
    };

    fetchClasses();
  }, [user?._id, user?.role]);

  // Update available sections when grade changes
  useEffect(() => {
    if (!formData.class) {
      setAvailableSections([]);
      return;
    }

    const sections = assignedClasses
      .filter((cls) => cls.grade === formData.class)
      .map((cls) => cls.section);

    setAvailableSections([...new Set(sections)]);

    if (!sections.includes(formData.section) && formData.section !== "") {
      onSelectChange("section", "");
      onSelectChange("subject", "");
    }
  }, [formData.class, assignedClasses, formData.section, onSelectChange]);

  // Update available subjects when section changes
  useEffect(() => {
    if (!formData.class || !formData.section) {
      setAvailableSubjects([]);
      return;
    }

    const selectedClass = assignedClasses.find(
      (cls) => cls.grade === formData.class && cls.section === formData.section
    );

    setAvailableSubjects(selectedClass?.subject || []);

    if (
      selectedClass &&
      !selectedClass.subject.includes(formData.subject) &&
      formData.subject !== ""
    ) {
      onSelectChange("subject", "");
    }
  }, [
    formData.class,
    formData.section,
    assignedClasses,
    formData.subject,
    onSelectChange,
  ]);

  // Update classId when class or section changes
  useEffect(() => {
    if (formData.class && formData.section) {
      const selectedClass = assignedClasses.find(
        (cls) =>
          cls.grade === formData.class && cls.section === formData.section
      );

      const newClassId = selectedClass?.classId || "";
      if (newClassId !== formData.classId) {
        onSelectChange("classId", newClassId);
      }
    } else if (formData.classId !== "") {
      onSelectChange("classId", "");
    }
  }, [
    formData.class,
    formData.section,
    assignedClasses,
    formData.classId,
    onSelectChange,
  ]);

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg border border-gray-200">
      <div className="space-y-1">
        <h3 className="text-lg font-medium text-gray-900">Class & Section</h3>
        <p className="text-sm text-gray-500">
          Select the target class, section, and subject
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Grade Selector */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <GraduationCap className="h-4 w-4" />
            Grade
          </Label>
          <Select
            value={formData.class}
            onValueChange={(value) => onSelectChange("class", value)}
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

        {/* Section Selector */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Users className="h-4 w-4" />
            Section
          </Label>
          <Select
            value={formData.section || ""}
            onValueChange={(value) => onSelectChange("section", value)}
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

        {/* Subject Selector */}
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

      {/* Selected Info */}
      {formData.class && formData.section && (
        <div className="p-3 bg-gray-50 rounded border text-center">
          <span className="text-sm text-gray-600">
            Selected: Grade {formData.class}, Section {formData.section}
            {formData.subject && `, Subject: ${formData.subject}`}
            {formData.classId && ` `}
          </span>
        </div>
      )}
    </div>
  );
};

export default ClassSectionSelector;
