"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = { id: number; name: string; email: string; role: string };

export function useAuthGuard(requiredRole?: "admin" | "agent") {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token  = localStorage.getItem("vectoria_token");
    const stored = localStorage.getItem("vectoria_user");

    if (!token || !stored) {
      router.replace("/login");
      return;
    }

    try {
      const parsed: User = JSON.parse(stored);

      // Vérifier le rôle si requis
      if (requiredRole && parsed.role !== requiredRole) {
        // Rediriger vers la bonne page selon le rôle réel
        router.replace(parsed.role === "admin" ? "/admin" : "/agent");
        return;
      }

      setUser(parsed);
    } catch {
      router.replace("/login");
    } finally {
      setChecking(false);
    }
  }, [router, requiredRole]);

  return { user, checking };
}
