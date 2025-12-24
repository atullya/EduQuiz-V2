"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  School,
  MapPin,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { createClass } from "@/lib/store/classes/classSlices";
// import { createClass } from "@/store/classSlice"; // Redux action

interface AddClassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClassAdded?: () => void;
}

const AddClassModal: React.FC<AddClassModalProps> = ({
  open,
  onOpenChange,
  onClassAdded,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    name: "",
    section: "",
    grade: "",
    subjects: [] as string[],
    roomNo: "",
    schedule: [] as string[],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const grades = ["9", "10", "11", "12"];
  const sections = ["A", "B", "C", "D", "E"];
  const availableSubjects = [
    "Science",
    "English",
    "Physics",
    "Chemistry",
    "Computer Science",
    "Mathematics",
    "Biology",
    "History",
    "Geography",
  ];
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleScheduleChange = (day: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      schedule: checked ? [...prev.schedule, day] : prev.schedule.filter((d) => d !== day),
    }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) return setError("Class name is required"), false;
    if (!formData.section) return setError("Section is required"), false;
    if (!formData.grade) return setError("Grade is required"), false;
    if (formData.subjects.length !== 1)
      return setError("Exactly one subject must be selected"), false;
    if (!formData.roomNo.trim()) return setError("Room number is required"), false;
    if (formData.schedule.length === 0)
      return setError("At least one schedule day is required"), false;

    const roomRegex = /^\d{1,4}[A-Z]?$/;
    if (!roomRegex.test(formData.roomNo))
      return setError("Invalid room number format (e.g., 202, 101A)"), false;

    return true;
  };

  const resetForm = () => {
    setFormData({ name: "", section: "", grade: "", subjects: [], roomNo: "", schedule: [] });
    setError("");
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError("");
    try {
      const result = dispatch(createClass(formData));
      if (createClass.rejected.match(result)) {
        throw new Error(typeof result.payload === 'string' ? result.payload : "Failed to create class");
      }

      setSuccess(true);
      setTimeout(() => {
        resetForm();
        onOpenChange(false);
        onClassAdded?.();
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to create class");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center justify-center gap-2">
            <School className="h-5 w-5 text-blue-600" /> Create New Class
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Set up a new class with subjects, schedule, and room assignment
          </DialogDescription>
        </DialogHeader>

        {success && (
          <Alert className="border-green-200 bg-green-50 mb-4">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Class created successfully!
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Class Name *</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Grade 10 Science"
                  disabled={isSubmitting}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Section *</Label>
                <Select
                  value={formData.section}
                  onValueChange={(v) => handleSelectChange("section", v)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section} value={section}>
                        Section {section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Grade *</Label>
                <Select
                  value={formData.grade}
                  onValueChange={(v) => handleSelectChange("grade", v)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        Grade {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Room Number *</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    name="roomNo"
                    value={formData.roomNo}
                    onChange={handleInputChange}
                    placeholder="e.g., 202, 101A"
                    disabled={isSubmitting}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Subject *</h3>
            <Select
              value={formData.subjects[0] || ""}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, subjects: [value] }))
              }
              disabled={isSubmitting}
            >
              <SelectTrigger className="mt-1">
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

          {/* Schedule */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Schedule *</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {weekDays.map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${day}`}
                    checked={formData.schedule.includes(day)}
                    onCheckedChange={(checked) => handleScheduleChange(day, checked === true)}
                    disabled={isSubmitting}
                  />
                  <Label htmlFor={`day-${day}`} className="text-sm text-gray-700 cursor-pointer">
                    {day}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Class...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" /> Create Class
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClassModal;
