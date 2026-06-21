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
      // Rediriger vers la bonne page selon le rôle réel
      router.replace(user.role === "admin" ? "/admin" : "/agent");
      return;
    }
  }, [user, loading, router, requiredRole]);

  return { user, checking: loading };
}
