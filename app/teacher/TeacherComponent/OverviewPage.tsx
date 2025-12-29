import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, FileText, BarChart3, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { teacherStats } from "@/lib/store/teachers/teacherapi";

interface Stats {
  totalClasses: number;
  totalAssignments: number;
  totalStudents: number;
}

interface OverviewPageProps {
  setActiveTab: (tab: string) => void;
}

const OverviewPage = ({ setActiveTab }: OverviewPageProps) => {
  const user = useSelector((state: RootState) => state.auth.user);

  const [stats, setStats] = useState<Stats>({
    totalClasses: 0,
    totalAssignments: 0,
    totalStudents: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (user?._id) {
          const response = await teacherStats(user._id);

          setStats({
            totalClasses: response.totalClasses,
            totalAssignments: 8,
            totalStudents: response.totalUniqueStudents,
          });
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, [user?._id]);

  return (
    <div className="max-w-8xl mx-auto p-6">
      <div className="bg-blue-500 rounded-lg p-6 text-white mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Hello, {user?.username || "Teacher"}
        </h1>
        <p className="text-blue-100">Here's what's happening in your classes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-1">My Classes</h3>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalClasses}
            </p>
            <p className="text-sm text-gray-500">Active classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-1">Students</h3>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalStudents}
            </p>
            <p className="text-sm text-gray-500">Total students</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="w-8 h-8 text-orange-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-1">Assignments</h3>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalAssignments}
            </p>
            <p className="text-sm text-gray-500">Pending review</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button
              className="w-full h-12 text-lg"
              onClick={() => setActiveTab("assignments")}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Assignment
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 text-lg"
              onClick={() => setActiveTab("reports")}
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewPage;
