"use client";

import { Home, GraduationCap, Users, BookOpen, Settings } from "lucide-react";

interface SideBarItemsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const SideBarItems = ({ activeTab, setActiveTab }: SideBarItemsProps) => {
  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "students", label: "Students", icon: GraduationCap },
    { id: "teachers", label: "Teachers", icon: Users },
    { id: "classes", label: "Classes", icon: BookOpen },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="p-2 sm:p-4 space-y-1">
      {sidebarItems.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={`w-full flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-left transition-colors duration-200 ${
            activeTab === id
              ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base font-medium">{label}</span>
        </button>
      ))}
    </nav>
  );
};