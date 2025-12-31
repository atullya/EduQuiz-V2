"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import OverviewPage from "./OverviewPage";
import AssignmentPage from "./AssignmentPage";
import ClassesPage from "./ClassesPage";
import MCQmain from "../MCQPage/MCQmain";
import StatsPage from "./Statspage";

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
          {activeTab === "overview" && (
            <OverviewPage setActiveTab={setActiveTab} />
          )}
          {activeTab === "classes" && (
            <ClassesPage setActiveTab={setActiveTab} />
          )}
          {activeTab === "assignments" && (
            <AssignmentPage setActiveTab={setActiveTab} />
          )}
          {activeTab === "analytics" && <MCQmain setActiveTab={setActiveTab} />}
          {activeTab === "reports" && <StatsPage setActiveTab={setActiveTab} />}
        </div>
      </main>
    </div>
  );
};

export default Layout;
