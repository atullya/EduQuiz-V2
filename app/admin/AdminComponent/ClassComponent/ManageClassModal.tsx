"use client";

import { useState, useEffect } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Settings,
  MapPin,
  Clock,
  CheckCircle,
  Loader2,
  Save,
} from "lucide-react";
import { getStudent, getTeacher } from "@/lib/store/slices/auth/authapi";

interface Teacher {
  _id: string;
  username: string;
  email?: string;
  profile?: { firstName?: string; lastName?: string };
}
interface Student {
  _id: string;
  username: string;
  email?: string;
  profile?: { firstName?: string; lastName?: string };
}

export interface ClassFormData {
  name: string;
  section: string;
  grade: string;
  roomNo: string;
  subjects: string[];
  schedule: string[];
  teacher: string;
  students: string[];
  time: string;
}

interface ManageClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: ClassFormData) => void;
  initialData?: any;
  classId: string | null;
}

export default function ManageClassModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  classId,
}: ManageClassModalProps) {
  const defaultState: ClassFormData = {
    name: "",
    section: "",
    grade: "",
    roomNo: "",
    subjects: [],
    schedule: [],
    teacher: "",
    students: [],
    time: "",
  };

  const [formData, setFormData] = useState<ClassFormData>(defaultState);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  // --- 1. DATA PROCESSOR ---
  // Converts the Incoming Data to Form Format
  const processDataToForm = (data: any): ClassFormData => {
    if (!data) return defaultState;

    // Handle Teacher (Object or String)
    let teacherId = "none";
    if (data.teacher) {
      teacherId =
        typeof data.teacher === "object" ? data.teacher._id : data.teacher;
    }

    // Handle Students (Array of Objects or Strings)
    let studentIds: string[] = [];
    if (data.students && Array.isArray(data.students)) {
      studentIds = data.students.map((s: any) =>
        typeof s === "object" ? s._id : s
      );
    }

    return {
      name: data.name || "",
      section: data.section || "",
      grade: data.grade ? String(data.grade) : "", // Ensure String for Select
      roomNo: data.roomNo || "",
      time: data.time || "",
      subjects: data.subjects || [],
      schedule: data.schedule || [],
      teacher: teacherId,
      students: studentIds,
    };
  };

  // --- 2. SET DATA ON OPEN ---
  useEffect(() => {
    if (isOpen && initialData) {
      // We use the data passed from parent immediately.
      // We DO NOT fetch the class data again to prevent the "reset" bug.
      setFormData(processDataToForm(initialData));
    } else if (isOpen && !initialData) {
      setFormData(defaultState);
    }
  }, [isOpen, initialData]);

  // --- 3. FETCH ONLY TEACHERS AND STUDENTS ---
  useEffect(() => {
    if (!isOpen) return;

    const loadOptions = async () => {
      setFetching(true);
      try {
        // ONLY fetch the dropdown options.
        // Do NOT fetch class details here.
        const [tData, sData] = await Promise.all([getTeacher(), getStudent()]);

        setTeachers(tData || []);
        setStudents(sData || []);
      } catch (err) {
        console.error("Error loading options", err);
        // Don't show error to user, just log it, so form remains usable
      } finally {
        setFetching(false);
      }
    };

    loadOptions();
  }, [isOpen]); // Only run when modal opens

  // --- HANDLERS ---
  const handleChange = (name: keyof ClassFormData, value: any) =>
    setFormData((p) => ({ ...p, [name]: value }));

  const handleArrayChange = (
    name: keyof ClassFormData,
    value: string,
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked
        ? [...(prev[name] as string[]), value]
        : (prev[name] as string[]).filter((v) => v !== value),
    }));
  };

  const handleSave = () => {
    setLoading(true);
    setSuccess(false);
    onSuccess(formData);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const getTeacherName = (id: string) => {
    const t = teachers.find((t) => t._id === id);
    return t
      ? t.profile?.firstName
        ? `${t.profile.firstName} ${t.profile.lastName}`
        : t.username
      : "Unknown";
  };
  const getStudentName = (id: string) => {
    const s = students.find((s) => s._id === id);
    return s
      ? s.profile?.firstName
        ? `${s.profile.firstName} ${s.profile.lastName}`
        : s.username
      : "Unknown";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="flex justify-center gap-2 items-center">
            <Settings className="text-blue-600" /> Manage Class
          </DialogTitle>
          <DialogDescription>Edit class details</DialogDescription>
        </DialogHeader>

        {success && (
          <Alert className="bg-green-50 mb-4">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>Saved!</AlertDescription>
          </Alert>
        )}

        {fetching && teachers.length === 0 ? (
          <div className="flex justify-center py-4">
            <Loader2 className="animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Class Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>
              <div>
                <Label>Section *</Label>
                <Select
                  value={formData.section}
                  onValueChange={(v) => handleChange("section", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {["A", "B", "C", "D", "E"].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Grade *</Label>
                <Select
                  value={formData.grade}
                  onValueChange={(v) => handleChange("grade", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {["9", "10", "11", "12"].map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Room No</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-9"
                    value={formData.roomNo}
                    onChange={(e) => handleChange("roomNo", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label>Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-9"
                    value={formData.time}
                    onChange={(e) => handleChange("time", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Subjects</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 border p-3 rounded bg-slate-50">
                {[
                  "Mathematics",
                  "Science",
                  "English",
                  "History",
                  "Geography",
                  "Physics",
                  "Chemistry",
                  "Biology",
                  "Computer Science",
                  "Art",
                  "Music",
                  "Physical Education",
                ].map((sub) => (
                  <div key={sub} className="flex items-center space-x-2">
                    <Checkbox
                      id={`sub-${sub}`}
                      checked={formData.subjects.includes(sub)}
                      onCheckedChange={(c) =>
                        handleArrayChange("subjects", sub, c === true)
                      }
                    />
                    <label
                      htmlFor={`sub-${sub}`}
                      className="text-sm cursor-pointer"
                    >
                      {sub}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Schedule</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 border p-3 rounded bg-slate-50">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ].map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${day}`}
                      checked={formData.schedule.includes(day)}
                      onCheckedChange={(c) =>
                        handleArrayChange("schedule", day, c === true)
                      }
                    />
                    <label
                      htmlFor={`day-${day}`}
                      className="text-sm cursor-pointer"
                    >
                      {day}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Teacher</Label>
              <Select
                value={formData.teacher}
                onValueChange={(v) => handleChange("teacher", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Teacher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Teacher</SelectItem>
                  {teachers.map((t) => (
                    <SelectItem key={t._id} value={t._id}>
                      {getTeacherName(t._id)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Students ({formData.students.length} selected)</Label>
              <ScrollArea className="h-48 border rounded-md mt-1 p-2 bg-white">
                {students.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">
                    No students available
                  </p>
                ) : (
                  students.map((s) => (
                    <div
                      key={s._id}
                      className="flex items-center space-x-2 py-1 hover:bg-slate-50 px-1 rounded"
                    >
                      <Checkbox
                        id={`stu-${s._id}`}
                        checked={formData.students.includes(s._id)}
                        onCheckedChange={(c) =>
                          handleArrayChange("students", s._id, c === true)
                        }
                      />
                      <label
                        htmlFor={`stu-${s._id}`}
                        className="text-sm cursor-pointer w-full flex flex-col"
                      >
                        <span>{getStudentName(s._id)}</span>
                        <span className="text-xs text-gray-400">{s.email}</span>
                      </label>
                    </div>
                  ))
                )}
              </ScrollArea>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
