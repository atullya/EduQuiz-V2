import React from "react";
import ProtectedRoute from "../ProtectedRoute";
import Layout from "./TeacherComponent/Layout";


const page = () => {
  return (
    <div>
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Layout/>
        </div>
      </ProtectedRoute>
    </div>
  );
};

export default page;
