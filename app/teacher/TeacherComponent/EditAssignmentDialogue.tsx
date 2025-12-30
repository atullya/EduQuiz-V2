"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2, BookOpen, Users } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  teacherStats,
  updateAssignment,
} from "@/lib/store/teachers/teacherapi";

interface ClassItem {
  classId: string;
  grade: number;
  section: string;
  subject: string[]; // Ensure this is explicitly typed as string[]
}

interface Assignment {
  _id: string;
  title: string;
  description: string;
  subject: string;
  class?: {
    _id?: string;
    grade?: number;
    section?: string;
  };
  dueDate?: string | Date;
}

interface User {
  _id: string;
  role: string;
}

interface EditAssignmentDialogueProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssignmentUpdated: () => void;
  assignment: Assignment;
  user: User;
}

const EditAssignmentDialogue: React.FC<EditAssignmentDialogueProps> = ({
  open,
  onOpenChange,
  onAssignmentUpdated,
  assignment,
  user,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(false);
  const [teacherClasses, setTeacherClasses] = useState<ClassItem[]>([]);
  const [subjectArray, setSubjectArray] = useState<string[]>([]);

  useEffect(() => {
    const getAllAssignedClasses = async () => {
      try {
        const data = await teacherStats(user?._id);
        setTeacherClasses(data.classStudentCounts || []);
        setSubjectArray([
          ...new Set(
            data.classStudentCounts.flatMap(
              (value: ClassItem) => value.subject
            ) as string[]
          ),
        ]);
      } catch (err: any) {
        console.error("Failed to fetch assigned classes:", err.message);
      }
    };

    if (user && user.role === "teacher") {
      getAllAssignedClasses();
    }
  }, [user?._id]);

  useEffect(() => {
    if (assignment) {
      setTitle(assignment.title || "");
      setDescription(assignment.description || "");
      setSubject(assignment.subject || "");
      setDueDate(
        assignment.dueDate ? new Date(assignment.dueDate) : new Date()
      );

      if (assignment.class?._id) {
        setSelectedClassId(assignment.class._id);
      } else if (teacherClasses.length > 0) {
        const matchedClass = teacherClasses.find(
          (tc) =>
            tc.grade === assignment.class?.grade &&
            tc.section === assignment.class?.section
        );
        if (matchedClass) {
          setSelectedClassId(matchedClass.classId);
        }
      }
    }
  }, [assignment, teacherClasses]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const updatedAssignment = {
        title,
        description,
        subject,
        class: selectedClassId,
        dueDate,
      };

      const res = await updateAssignment(assignment._id, updatedAssignment);

      if (res.success) {
        onAssignmentUpdated();
        onOpenChange(false);
      } else {
        console.error("Failed to update assignment:", res.message);
      }
    } catch (error: any) {
      console.error("Error updating assignment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Assignment</DialogTitle>
          <DialogDescription>
            Modify the details of this assignment.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">
              Subject
            </Label>
            <Select
              onValueChange={setSubject}
              value={subject}
              disabled={loading}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjectArray.map((subj) => (
                  <SelectItem key={subj} value={subj}>
                    <BookOpen className="mr-2 h-4 w-4" /> {subj}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="class" className="text-right">
              Class
            </Label>
            <Select
              onValueChange={setSelectedClassId}
              value={selectedClassId}
              disabled={loading}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {teacherClasses.map((c) => (
                  <SelectItem key={c.classId} value={c.classId}>
                    <Users className="mr-2 h-4 w-4" /> Grade {c.grade} (sec{" "}
                    {c.section})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right">
              Due Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 pl-3 text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                  disabled={loading}
                >
                  {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditAssignmentDialogue;
