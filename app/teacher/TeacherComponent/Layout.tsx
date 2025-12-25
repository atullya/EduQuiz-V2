"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import OverviewPage from "./OverviewPage";


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
          {activeTab === "overview" && (<OverviewPage setActiveTab={setActiveTab}/>)}
          {activeTab === "classes" && "asdfasf"}
          {activeTab === "assignments" && "asdfasf"}
          {activeTab === "analytics" && "asdfasf"}
          {activeTab === "reports" && "asdfasf"}


        </div>
      </main>
    </div>
  );
};

export default Layout;
