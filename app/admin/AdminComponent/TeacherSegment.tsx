"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import TeacherModal from "./TeacherModal";
import EditTeacherModal from "./EditTeacherModal";
import { getTeachers } from "@/lib/store/teachers/teacherapi";
// import { getTeachers } from "@/api/teacherApi";

const TeacherSegment = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teacherDetails, setTeacherDetails] = useState<any[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<any[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTeacherDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const teachers = await getTeachers();
      setTeacherDetails(teachers);
      setFilteredTeachers(teachers);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load teachers");
    } finally {
      setLoading(false);
    }
  };

  const handleStudentAdded = () => {
    getTeacherDetails();
  };

  const handleTeacherUpdated = () => {
    getTeacherDetails();
  };

  const handleEditTeacher = (teacher: any) => {
    setSelectedTeacher(teacher);
    setIsEditModalOpen(true);
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        // ⚠️ keep your existing delete API if already working
        // await deleteTeacher(teacherId)
        getTeacherDetails();
      } catch (error) {
        alert("Failed to delete teacher. Please try again.");
      }
    }
  };

  const handleSearch = (e: any) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term) {
      setFilteredTeachers(teacherDetails);
    } else {
      const filtered = teacherDetails.filter((teacher) => {
        const fullName = `${teacher?.profile?.firstName || ""} ${
          teacher?.profile?.lastName || ""
        }`.toLowerCase();
        return (
          fullName.includes(term) ||
          teacher.username.toLowerCase().includes(term) ||
          teacher.email.toLowerCase().includes(term) ||
          (teacher?.profile?.phone || "").includes(term) ||
          (teacher?.profile?.address || "").toLowerCase().includes(term)
        );
      });
      setFilteredTeachers(filtered);
    }
  };

  useEffect(() => {
    getTeacherDetails();
  }, []);

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Teachers</h1>

        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full"
            />
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Teacher
          </Button>
        </div>
      </div>

      {/* ⏳ LOADING */}
      {loading && (
        <div className="text-center py-8 text-gray-500">
          Loading teachers...
        </div>
      )}

      {/* ❌ ERROR */}
      {error && (
        <div className="text-center py-8 text-red-500 font-medium">{error}</div>
      )}

      {/* 📋 UI BELOW IS 100% UNCHANGED */}
      <div className="space-y-4">
        {!loading && !error && filteredTeachers.length > 0
          ? filteredTeachers.map((teacher) => (
              <Card key={teacher._id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {teacher?.profile?.firstName &&
                        teacher?.profile?.lastName
                          ? `${teacher.profile.firstName[0]}${teacher.profile.lastName[0]}`
                          : teacher.username.substring(0, 2).toUpperCase()}
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold">
                          {teacher.username}
                        </h3>
                        <p className="text-gray-600 mb-1">
                          <strong>Name:</strong>{" "}
                          {teacher?.profile?.firstName &&
                          teacher?.profile?.lastName
                            ? `${teacher.profile.firstName} ${teacher.profile.lastName}`
                            : "Not provided"}
                        </p>
                        <p className="text-gray-600 mb-1">
                          <strong>Email:</strong> {teacher.email}
                        </p>
                        <p className="text-gray-600 mb-1">
                          <strong>Phone:</strong>{" "}
                          {teacher?.profile?.phone || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleEditTeacher(teacher)}
                        className="border-blue-500 text-blue-500 hover:bg-blue-50"
                      >
                        <Edit className="mr-1 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDeleteTeacher(teacher._id)}
                        className="border-red-500 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          : !loading &&
            !error && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No teachers available</p>
              </div>
            )}
      </div>

      <TeacherModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onStudentAdded={handleStudentAdded}
      />

      <EditTeacherModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        teacher={selectedTeacher}
        onTeacherUpdated={handleTeacherUpdated}
      />
    </div>
  );
};

export default TeacherSegment;
