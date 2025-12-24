"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import ProtectedRoute from "@/app/ProtectedRoute";
import AddStudentModal from "./AddStudentModal";
import { getStudents } from "@/lib/store/students/studentsapi";
import EditStudentModal from "./EditStudentModal";

const StudentSegment = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentDetails, setStudentDetails] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const students = await getStudents();
        setStudentDetails(students);
        setFilteredStudents(students);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredStudents(studentDetails);
    } else {
      setFilteredStudents(
        studentDetails.filter(
          (student) =>
            student.username.toLowerCase().includes(term.toLowerCase()) ||
            student.email.toLowerCase().includes(term.toLowerCase())
        )
      );
    }
  };

  const handleEditStudent = (student: any) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      const updatedList = studentDetails.filter((s) => s._id !== id);
      setStudentDetails(updatedList);
      setFilteredStudents(updatedList);
    }
  };

  const handleStudentAdded = (student: any) => {
    const updatedList = [...studentDetails, student];
    setStudentDetails(updatedList);
    setFilteredStudents(updatedList);
  };

  const handleStudentUpdated = (student: any) => {
    const updatedList = studentDetails.map((s) =>
      s._id === student._id ? student : s
    );
    setStudentDetails(updatedList);
    setFilteredStudents(updatedList);
  };

  return (
    <ProtectedRoute>
      <div className="p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Students</h1>

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full"
              />
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-500 hover:bg-green-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-8 text-gray-500">
            Loading students...
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-red-500 font-medium">
            {error}
          </div>
        )}

        {!loading && !error && filteredStudents.length > 0 && (
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <Card key={student._id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {student?.profile?.firstName &&
                        student?.profile?.lastName
                          ? `${student.profile.firstName[0]}${student.profile.lastName[0]}`
                          : student.username.substring(0, 2).toUpperCase()}
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold">
                          {student.username}
                        </h3>
                        <p className="text-gray-600 mb-1">
                          <strong>Name:</strong>{" "}
                          {student?.profile?.firstName &&
                          student?.profile?.lastName
                            ? `${student.profile.firstName} ${student.profile.lastName}`
                            : "Not provided"}
                        </p>
                        <p className="text-gray-600 mb-1">
                          <strong>Email:</strong> {student.email}
                        </p>
                        <p className="text-gray-600 mb-1">
                          <strong>Phone:</strong>{" "}
                          {student?.profile?.phone || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleEditStudent(student)}
                        className="border-blue-500 text-blue-500 hover:bg-blue-50"
                      >
                        <Edit className="mr-1 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDeleteStudent(student._id)}
                        className="border-red-500 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && !error && filteredStudents.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No students available</p>
          </div>
        )}

        <AddStudentModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onStudentAdded={handleStudentAdded}
        />

        <EditStudentModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          student={selectedStudent}
          onStudentUpdated={handleStudentUpdated}
        />
      </div>
    </ProtectedRoute>
  );
};

export default StudentSegment;
