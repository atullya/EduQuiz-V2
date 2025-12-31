"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen, User, Eye, Send, Edit } from "lucide-react";

import { format } from "date-fns";
import SubmissionViewDialogueStudent from "./SubmissionViewDialogueStudent";
import SubmitAssignmentDialogue from "./SubmitAssignmentDialogue";
import { getStudentAssignments } from "@/lib/store/students/studentsapi";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { Assignment, Submission } from "@/lib/types/assignment";

interface User {
  _id: string;
  role: string;
  profile?: {
    firstName?: string;
    lastName?: string;
  };
}

interface AssignmentStudentProps {
  setActiveTab: (tab: string) => void;
}

const AssignmentStudent: React.FC<AssignmentStudentProps> = ({
  setActiveTab,
}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [assignmentToSubmit, setAssignmentToSubmit] =
    useState<Assignment | null>(null);

  const [isViewSubmissionOpen, setIsViewSubmissionOpen] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState<Submission | null>(
    null
  );
  const [currentAssignmentTitle, setCurrentAssignmentTitle] =
    useState<string>("");

  const fetchAssignments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getStudentAssignments();
      console.log("Assignments fetched:", res);
      if (res.success) setAssignments(res.data?.result);
      else setError(res.message || "Failed to fetch assignments.");
    } catch (err: any) {
      setError(err.message || "Error fetching assignments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "student") fetchAssignments();
    else if (user) {
      setError("You are not authorized to view this page.");
      setLoading(false);
    }
  }, [user?._id]);

  const openSubmitDialog = (assignment: Assignment) => {
    setAssignmentToSubmit(assignment);
    setIsSubmitDialogOpen(true);
  };

  const openViewDialog = (submission: Submission, title: string) => {
    setCurrentSubmission(submission);
    setCurrentAssignmentTitle(title);
    setIsViewSubmissionOpen(true);
  };

  if (!user || loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading assignments...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-extrabold mb-4">
          <BookOpen className="inline-block h-10 w-10 mr-3 text-purple-700" />
          My Assignments
        </h2>
        <p className="text-lg text-gray-600">View and submit your tasks.</p>
      </div>

      <div className="space-y-6">
        {(assignments || []).length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl shadow-lg">
            {/* <Calendar className="w-16 h-16 text-gray-400 mb-6" /> */}
            <h3 className="text-2xl font-semibold mb-2">No Assignments Yet!</h3>
            <p className="text-md text-gray-600">Check back later!</p>
          </div>
        ) : (
          assignments.map((assignment: any) => (
            <Card
              key={assignment._id}
              className="bg-white/70 backdrop-blur-sm shadow-xl hover:shadow-2xl"
            >
              <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-2 flex-grow">
                  <div className="flex items-center space-x-3">
                    <h4 className="text-xl font-bold">{assignment.title}</h4>
                    {assignment.subject && (
                      <Badge className="bg-blue-100 text-blue-800 text-sm">
                        {assignment.subject}
                      </Badge>
                    )}
                    {assignment.isSubmitted ? (
                      <Badge className="bg-green-100 text-green-800 text-sm">
                        Submitted
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-red-300 text-red-800 text-sm"
                      >
                        Not Submitted
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-700">{assignment.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    Due: {format(new Date(assignment.dueDate), "PPP")}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-1" />
                    Assigned by: {assignment.teacher.firstName}{" "}
                    {assignment.teacher.lastName}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
                  {assignment.isSubmitted && assignment.submission ? (
                    <>
                      <Button
                        onClick={() =>
                          openViewDialog(
                            assignment.submission!,
                            assignment.title
                          )
                        }
                      >
                        <Eye className="mr-2 h-4 w-4" /> View Submission
                      </Button>
                      <Button
                        onClick={() => openSubmitDialog(assignment)}
                        variant="outline"
                      >
                        <Edit className="mr-2 h-4 w-4" /> Edit Submission
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => openSubmitDialog(assignment)}>
                      <Send className="mr-2 h-4 w-4" /> Submit Assignment
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {assignmentToSubmit && (
        <SubmitAssignmentDialogue
          open={isSubmitDialogOpen}
          onOpenChange={setIsSubmitDialogOpen}
          assignment={assignmentToSubmit}
          onSubmissionSuccess={fetchAssignments}
        />
      )}

      <SubmissionViewDialogueStudent
        open={isViewSubmissionOpen}
        onOpenChange={setIsViewSubmissionOpen}
        submission={currentSubmission}
        assignmentTitle={currentAssignmentTitle}
      />
    </div>
  );
};

export default AssignmentStudent;
