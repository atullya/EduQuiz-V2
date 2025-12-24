"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("auth_token"); 
    if (!token) {
      router.push("/auth"); 
    }
  }, [router]);

  return <>{children}</>;
};

export default ProtectedRoute;
