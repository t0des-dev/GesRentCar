"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import api from "@/lib/api/client";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || (process.env.NEXT_PUBLIC_API_URL || "${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}")).replace(/\/api$/, "");

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("vectoria_token") : null;
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      await fetch(`${API_BASE}/sanctum/csrf-cookie`, { credentials: "include" });
      const res = await api.get("/user");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    await fetch(`${API_BASE}/sanctum/csrf-cookie`, { credentials: "include" });
    const res = await api.post("/auth/login", { email, password });
    const u: User = { id: res.data.user.id, name: res.data.user.name, email: res.data.user.email, role: res.data.user.role || "client" };
    setUser(u);
    localStorage.setItem("vectoria_user", JSON.stringify(u));
    if (res.data.token) localStorage.setItem("vectoria_token", res.data.token);
    return u;
  };

  const logout = async () => {
    try { await api.post("/auth/logout"); } catch { /* ignore */ }
    setUser(null);
    localStorage.removeItem("vectoria_user");
    localStorage.removeItem("vectoria_token");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
