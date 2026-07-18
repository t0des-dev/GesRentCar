import api from "@/shared/services/client";

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
    const { data } = await api.get(`/scan-sessions/${token}/status`);
    return data.data;
  },

  async upload(token: string, type: "cin" | "license", file: File): Promise<{ success: boolean; data?: Record<string, string>; status?: string; message?: string }> {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", type);
    try {
      const { data } = await api.post(`/scan-sessions/${token}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { success: boolean; message?: string } } };
      if (axiosError.response?.data) {
        return axiosError.response.data;
      }
      return { success: false, message: "Erreur réseau. Vérifiez votre connexion." };
    }
  },
};
