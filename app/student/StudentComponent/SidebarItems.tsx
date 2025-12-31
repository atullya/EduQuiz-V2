import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BookOpen,
  Users,
  GraduationCap,
  Settings,
  LogOut,
  Edit,
  MapPin,
  School,
  UserCheck,
  BarChart3,
  TrendingUp,
  Activity,
  Plus,
  Search,
  Menu,
  X,
  Bell,
  Home,
  FileText,
  ChevronRight,
  Sparkles,
  Target,
  Shield,
  Database,
  Calendar,
} from "lucide-react";
interface SideBarItemsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
export const SideBarItems = ({
  activeTab,
  setActiveTab,
}: SideBarItemsProps) => {
  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "assignment", label: "Assignment", icon: GraduationCap },

    { id: "classes", label: "Classes", icon: BookOpen },
    { id: "quiz", label: "Quiz", icon: FileText },
    { id: "reports", label: "Reports", icon: BarChart3 },
  ];
  return (
    <div>
      {" "}
      <nav className="p-4 space-y-2">
        {sidebarItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
              activeTab === id
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{label}</span>
            {activeTab === id && <ChevronRight className="h-4 w-4 ml-auto" />}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default SideBarItems;
