"use client";
import { useState } from "react";
import AdminOverview from "./AdminComponent/AdminOverview";
import Sidebar from "./AdminComponent/Sidebar";
import StudentSegment from "./AdminComponent/StudentSegment";
import ClassSegment from "./AdminComponent/ClassComponent/ClassSegment";
import TeacherSegment from "./AdminComponent/TeacherSegment";
// import { ClassSegment } from "./AdminComponent/ClassComponent/ClassSegment";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main
        className={`transition-all duration-300 ease-in-out ${
          sidebarOpen ? "lg:ml-64" : "ml-0"
        }`}
      >
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Render content based on active tab */}
          {activeTab === "overview" && (
            <AdminOverview setActiveTab={setActiveTab} />
          )}
          {activeTab === "students" && <StudentSegment />}
          {activeTab === "teachers" && <TeacherSegment />}
          {activeTab === "classes" && <ClassSegment />}
        </div>
      </main>
    </div>
  );
};

export default Layout;
