"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import api from "@/shared/services/client";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1").replace(/\/api\/v1$/, "");

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
  register: (name: string, email: string, password: string, password_confirmation: string) => Promise<User>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const CSRF_REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes

async function safeCsrf() {
  try {
    await fetch("/api/sanctum/csrf-cookie", { credentials: "include" });
  } catch {}
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const logoutTimerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const csrfTimerRef = useRef<any>(null);
  const lastActivityRef = useRef(Date.now());

  const scheduleLogout = useCallback(() => {
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    logoutTimerRef.current = setTimeout(() => {
      setUser(null);
      localStorage.removeItem("vectoria_user");
      localStorage.removeItem("vectoria_token");
      localStorage.removeItem("auth_token");
      window.location.href = "/login?reason=timeout";
    }, SESSION_TIMEOUT);
  }, []);

  const refreshCsrf = useCallback(async () => {
    const token = localStorage.getItem("vectoria_token");
    if (token) await safeCsrf();
  }, []);

  useEffect(() => {
    csrfTimerRef.current = setInterval(refreshCsrf, CSRF_REFRESH_INTERVAL);
    return () => { if (csrfTimerRef.current) clearInterval(csrfTimerRef.current); };
  }, [refreshCsrf]);

  useEffect(() => {
    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    const resetTimer = () => {
      lastActivityRef.current = Date.now();
      scheduleLogout();
    };
    events.forEach(e => document.addEventListener(e, resetTimer, { passive: true }));
    scheduleLogout();
    return () => {
      clearTimeout(logoutTimerRef.current);
      events.forEach(e => document.removeEventListener(e, resetTimer));
    };
  }, [scheduleLogout]);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("vectoria_token");
    if (!token) { setLoading(false); return; }
    try {
      const res = await api.get("/user");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = localStorage.getItem("vectoria_token");
      if (!token) { if (!cancelled) setLoading(false); return; }
      try {
        const res = await api.get("/user");
        if (!cancelled) setUser(res.data);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const login = async (email: string, password: string) => {
    await safeCsrf();
    const res = await api.post("/auth/login", { email, password });
    const u: User = { id: res.data.user.id, name: res.data.user.name, email: res.data.user.email, role: res.data.user.role || "client" };
    setUser(u);
    localStorage.setItem("vectoria_user", JSON.stringify(u));
    if (res.data.token) {
      localStorage.setItem("vectoria_token", res.data.token);
      localStorage.setItem("auth_token", res.data.token);
    }
    scheduleLogout();
    return u;
  };

  const register = async (name: string, email: string, password: string, password_confirmation: string) => {
    await safeCsrf();
    const res = await api.post("/auth/register", { name, email, password, password_confirmation });
    const u: User = { id: res.data.user.id, name: res.data.user.name, email: res.data.user.email, role: res.data.user.role || "client" };
    setUser(u);
    localStorage.setItem("vectoria_user", JSON.stringify(u));
    if (res.data.token) {
      localStorage.setItem("vectoria_token", res.data.token);
      localStorage.setItem("auth_token", res.data.token);
    }
    scheduleLogout();
    return u;
  };

  const logout = async () => {
    try { await api.post("/auth/logout"); } catch {}
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    setUser(null);
    localStorage.removeItem("vectoria_user");
    localStorage.removeItem("vectoria_token");
    localStorage.removeItem("auth_token");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
