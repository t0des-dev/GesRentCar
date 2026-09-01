import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  timeout: 15000, // 15s — évite les requêtes pendantes infinies
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
  (response) => response,
  (error) => {
    // Timeout (408 serveur ou ECONNABORTED client)
    const isTimeout =
      error.code === "ECONNABORTED" ||
      error.response?.status === 408 ||
      error.message?.includes("timeout");

    if (isTimeout) {
      return Promise.reject({
        ...error,
        isTimeout: true,
        message: "La requête a expiré. Vérifiez votre connexion et réessayez.",
      });
    }

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
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
