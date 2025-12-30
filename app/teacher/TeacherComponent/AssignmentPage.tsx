"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import AddAssignmentDialogue from "./AddAssignmentDialogue";
import EditAssignmentDialogue from "./EditAssignmentDialogue";
import AssignmentDetailsDialogue from "./AssignmentDetailsDialogue";
import {
  deleteAssignedAssignment,
  getMyAssignedWithSubmissions,
} from "@/lib/store/teachers/teacherapi";

interface User {
  readonly _id: string;
  role: "teacher" | "student" | "admin";
}

interface ClassInfo {
  readonly _id: string;
  grade: number;
  section: string;
  name?: string;
}

interface Assignment {
  readonly _id: string;
  title: string;
  class: ClassInfo;
  dueDate: string;
  submittedCount: number;
  totalStudents: number;
  description: string;
  subject: string;
}

interface AssignmentPageProps {
  setActiveTab?: (tab: string) => void;
}

const AssignmentPage = ({ setActiveTab }: AssignmentPageProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);

  const fetchAssignments = async () => {
    try {
      const data: Assignment[] = await getMyAssignedWithSubmissions();
      setAssignments(data);
    } catch (error: any) {
      console.error("Error fetching assignments:", error.message);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this?");
    if (!confirmDelete) return;

    try {
      const res = await deleteAssignedAssignment(id);
      if (res.success) {
        alert("Assignment deleted.");
        fetchAssignments();
      } else {
        alert("Failed to delete assignment.");
      }
    } catch (error) {
      alert("Error deleting assignment.");
    }
  };

  const handleEdit = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setShowEditDialog(true);
  };

  const handleView = (id: string) => {
    setSelectedAssignment({ _id: id } as Assignment);
    setShowDetailsDialog(true);
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Assignments</h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage your class assignments
          </p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Assignment
        </Button>
      </div>

      {user && user._id && (
        <AddAssignmentDialogue
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onAssignmentAdded={fetchAssignments}
          user={user as User}
        />
      )}

      {selectedAssignment && showEditDialog && (
        <EditAssignmentDialogue
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          assignment={selectedAssignment}
          onAssignmentUpdated={fetchAssignments}
          user={user as User}
        />
      )}

      {selectedAssignment && showDetailsDialog && (
        <AssignmentDetailsDialogue
          open={showDetailsDialog}
          onOpenChange={setShowDetailsDialog}
          assignmentId={selectedAssignment._id}
        />
      )}

      <div className="space-y-4">
        {assignments.length === 0 ? (
          <Card className="p-8 text-center">
            <CardContent>
              <div className="text-gray-500">
                <Calendar className="mx-auto h-12 w-12 mb-3 text-gray-300" />
                <p className="text-lg font-medium">No assignments yet</p>
                <p className="text-sm">
                  Create your first assignment to get started
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          
          assignments.map((a) => (
            <Card key={a._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {a.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center">
                        <Users className="mr-1 h-4 w-4" />
                        Grade {a.class.grade}, Section {a.class.section}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        Due: {a.dueDate.slice(0, 10)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700">
                        Submitted: {a.submittedCount}/{a.totalStudents}
                      </span>
                      <div className="flex-1 max-w-xs">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${
                                (a.submittedCount / a.totalStudents) * 100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {Math.round((a.submittedCount / a.totalStudents) * 100)}
                        %
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(a._id)}
                      className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(a)}
                      className="text-gray-600 hover:text-gray-700 border-gray-200 hover:border-gray-300"
                    >
                      <Edit className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(a._id)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AssignmentPage;
