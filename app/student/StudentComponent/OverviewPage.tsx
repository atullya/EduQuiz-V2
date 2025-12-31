import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, FileText, BarChart3, ShieldHalf } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { classApi } from "@/lib/store/classes/classApi";

interface Stats {
  totalClasses: number;
  totalAssignments: number;
  totalQuizzes: number;
}
interface OverviewPageProps {
  setActiveTab: (tab: string) => void;
}

const OverviewPage = ({ setActiveTab }: OverviewPageProps) => {
  const user = useSelector((state: RootState) => state.auth.user);

  const [stats, setStats] = useState<Stats>({
    totalClasses: 0,
    totalAssignments: 0,
    totalQuizzes: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!user?._id) return;

        const response = await classApi.getStudentStats(user._id);
        console.log("Student Stats Response:", response);

        setStats({
          totalClasses: response.totalClasses || 0,
          totalAssignments: response.totalAssignments || 0,
          totalQuizzes: response.totalQuizzes || 0,
        });
      } catch (error) {
        console.error("Failed to fetch teacher stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?._id]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-green-600 to-yellow-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 tracking-tight">
                Welcome back, {user?.username}! 👨🏿‍🎓
              </h1>
              <p className="text-orange-100 text-lg font-medium">
                Manage your with confidence
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <ShieldHalf className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full"></div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Total Classes</p>
            <h2 className="text-2xl font-bold">
              {loading ? "..." : stats.totalClasses}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Total Assignments</p>
            <h2 className="text-2xl font-bold">
              {loading ? "..." : stats.totalAssignments}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Total Quizzes</p>
            <h2 className="text-2xl font-bold">
              {loading ? "..." : stats.totalQuizzes}
            </h2>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewPage;
