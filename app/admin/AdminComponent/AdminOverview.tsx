"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, GraduationCap, BarChart3, Plus } from "lucide-react";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { getSystemInfo } from "@/lib/store/admin/adminapi";

const AdminOverview = ({
  setActiveTab,
}: {
  setActiveTab: (tab: string) => void;
}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [count, _setCount] = useState<{
    totalStudents: number | null;
    totalTeachers: number | null;
    totalClasses: number | null;
  }>({
    totalStudents: null,
    totalTeachers: null,
    totalClasses: null,
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSystemInfo();
        _setCount({
          totalStudents: data.students,
          totalTeachers: data.teachers,
          totalClasses: data.classes,
        });
      } catch (error) {
        console.error("Error fetching system info:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 sm:p-6 text-white mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Welcome back, {user?.username || ""} 👑
        </h1>
        <p className="text-blue-100 text-sm sm:text-base">
          Manage your school with confidence
        </p>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500 mx-auto mb-3" />
            <h3 className="text-base sm:text-lg font-semibold mb-1">
              Total Students
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              {count?.totalStudents || 0}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              Enrolled this year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <Users className="w-8 h-8 sm:w-10 sm:h-10 text-green-500 mx-auto mb-3" />
            <h3 className="text-base sm:text-lg font-semibold mb-1">
              Total Teachers
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              {count?.totalTeachers || 0}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">Active faculty</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500 mx-auto mb-3" />
            <h3 className="text-base sm:text-lg font-semibold mb-1">
              Total Classes
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              {count?.totalClasses || 0}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">Active classes</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons - Responsive Grid */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button
              className="h-10 sm:h-12 text-base sm:text-lg bg-blue-600 hover:bg-blue-700"
              onClick={() => setActiveTab("students")}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Add Student
            </Button>
            <Button
              className="h-10 sm:h-12 text-base sm:text-lg bg-green-600 hover:bg-green-700"
              onClick={() => setActiveTab("teachers")}
            >
              <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Add Teacher
            </Button>
            <Button
              className="h-10 sm:h-12 text-base sm:text-lg bg-purple-600 hover:bg-purple-700"
              onClick={() => setActiveTab("classes")}
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Create Class
            </Button>
            <Button
              variant="outline"
              className="h-10 sm:h-12 text-base sm:text-lg"
            >
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
