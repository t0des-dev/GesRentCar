import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let isRedirecting = false;

api.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("vectoria_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    isRedirecting = false;
    return response;
  },
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const url = error.config?.url || "";

      // Don't handle 401 for auth endpoints (login/register)
      const isAuthEndpoint = url.includes("/auth/login") || url.includes("/auth/register");

      // Don't redirect if already on login/register page
      const currentPath = window.location.pathname;
      const isOnAuthPage = currentPath === "/login" || currentPath === "/register";

      if (!isAuthEndpoint && !isOnAuthPage && !isRedirecting) {
        isRedirecting = true;
        localStorage.removeItem("vectoria_user");
        localStorage.removeItem("vectoria_token");
        window.location.href = "/login";
      }
    }
    if (error.response?.status && error.response.status < 500) {
      isRedirecting = false;
    }
    return Promise.reject(error);
  }
);

export default api;
