import api from "@/shared/services/client";
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface ScanSession {
  session_id: number;
  token: string;
  qr_token: string;
  expires_at: string;
  scan_url: string;
}

export interface ScanSessionStatus {
  id: number;
  token: string;
  status: "pending" | "scanning" | "completed" | "expired";
  cin_name: string | null;
  cin_number: string | null;
  cin_image_url: string | null;
  license_number: string | null;
  license_image_url: string | null;
  expires_at: string | null;
}

export const scanSessionService = {
  async create(): Promise<ScanSession> {
    const { data } = await api.post("/scan-sessions");
    return data.data;
  },

  async getStatus(sessionId: number): Promise<ScanSessionStatus> {
    const { data } = await api.get(`/scan-sessions/${sessionId}`);
    return data.data;
  },

  async phoneStatus(token: string): Promise<{ status: string; cin_number: string | null; license_number: string | null }> {
    const { data } = await axios.get(`${baseURL}/scan-sessions/${token}/status`);
    return data.data;
  },

  async upload(token: string, type: "cin" | "license", file: File): Promise<{ success: boolean; data: Record<string, string>; status: string }> {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", type);
    const { data } = await axios.post(`${baseURL}/scan-sessions/${token}/upload`, formData);
    return data;
  },
};
