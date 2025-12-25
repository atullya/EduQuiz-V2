"use client";

import { School, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SideBarItems } from "./SideBarItems";
import { logoutUser } from "@/lib/store/slices/auth/authapi";
import { useDispatch } from "react-redux";
import { logout } from "@/lib/store/slices/auth/authSlice";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
}: SidebarProps) => {
  const dispatch = useDispatch();
  const handleLogout = async () => {
    const res = await logoutUser();
    dispatch(logout());
  };
  return (
    <div>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <School className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h2 className="text-lg font-semibold text-gray-900">EduDash</h2>
                <p className="text-sm text-gray-500">Admin Portal</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Profile Section */}
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-base sm:text-lg">
                A
              </div>
              <div className="flex-1 min-w-0 hidden sm:block">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Admin
                </p>
                <p className="text-xs text-gray-500 truncate">
                  System Administrator
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <SideBarItems activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Logout */}
          <div className="p-4 border-t border-gray-100 mt-auto">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="mr-3 h-5 w-5" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Sidebar;
