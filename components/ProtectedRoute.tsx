"use client";

import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    const companyId = localStorage.getItem("company_id");
    
    if (!companyId) {
      router.push("/");
      return;
    }
  }, [router]);

  // Check company_id on render as well
  if (typeof window !== "undefined") {
    const companyId = localStorage.getItem("company_id");
    if (!companyId) {
      return null; // Don't render anything while redirecting
    }
  }

  return <>{children}</>;
}