import api from "./client";

export interface LoginPayload { email: string; password: string; }
export interface RegisterPayload { name: string; email: string; password: string; password_confirmation: string; }
export interface AuthUser { id: number; name: string; email: string; role: "admin" | "agent" | "client"; }

export const authService = {
  async login(payload: LoginPayload): Promise<{ token: string; user: AuthUser }> {
    const { data } = await api.post("/auth/login", payload);

    if (data.token && typeof window !== "undefined") {
      localStorage.setItem("auth_token", data.token);
    }
    return data;
  },

  async register(payload: RegisterPayload): Promise<{ token: string; user: AuthUser }> {
    const { data } = await api.post("/auth/register", payload);
    if (data.token && typeof window !== "undefined") {
      localStorage.setItem("auth_token", data.token);
    }
    return data;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  },

  async me(): Promise<AuthUser> {
    const { data } = await api.get("/auth/me");
    return data;
  },
};
