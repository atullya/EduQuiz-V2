"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import OverviewPage from "./OverviewPage";
import AssignmentStudent from "./AssignmentStudent";

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
          {activeTab === "assignment" && (
            <AssignmentStudent setActiveTab={setActiveTab} />
          )}
          {activeTab === "teachers" && "asdfasdfsadf"}
          {activeTab === "classes" && "asdfasdf"}
          {activeTab === "quiz" && "asdfasdf"}
          {activeTab === "reports" && "asdfasdf"}
        </div>
      </main>
    </div>
  );
};

export default Layout;
