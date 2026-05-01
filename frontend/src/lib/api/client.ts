import axios from "axios";

/**
 * Configured Axios instance pointing to the Laravel API.
 * - Base URL is set via NEXT_PUBLIC_API_URL environment variable.
 * - Automatically sends cookies (for Sanctum/CSRF authentication).
 * - Sets JSON headers by default.
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  withCredentials: true, // Required for Laravel Sanctum cookie auth
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

import { getSession } from "next-auth/react";

// Request interceptor: attach Bearer token if stored (fallback for token-based auth)
api.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    const session = await getSession();
    const token = (session as any)?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

import { signOut } from "next-auth/react";

// Response interceptor: handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        signOut({ callbackUrl: "/login" });
      }
    }
    return Promise.reject(error);
  }
);

export default api;
