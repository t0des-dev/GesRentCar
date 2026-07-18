"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/modules/auth/context/context";

export function useAuthGuard(requiredRole?: "admin" | "agent") {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    // Vérifier le rôle si requis
    if (requiredRole && user.role !== requiredRole) {
      router.replace(user.role === "admin" ? "/admin" : user.role === "agent" ? "/agent" : "/dashboard");
      return;
    }
  }, [user, loading, router, requiredRole]);

  return { user, checking: loading };
}
