import api from "@/shared/services/client";

export interface CreateReservationPayload {
  vehicle_id: number;
  start_date: string;
  end_date: string;
  client: {
    name: string;
    email: string;
    phone: string;
    cin: string;
    license_number?: string;
    cin_image_url?: string;
    license_image_url?: string;
  };
  payment_method: "cash" | "cmi" | "transfer" | "stripe" | "on_site";
  signature?: string;
  options?: Record<string, unknown>;
}

export interface Reservation {
  id: number;
  vehicle_id: number;
  client_id: number;
  start_date: string;
  end_date: string;
  status: string;
  total_price: number;
  deposit_amount: number;
  options: Record<string, unknown> | null;
  documents: string[] | null;
  vehicle?: { brand: string; model: string; plate: string };
  client?: { name: string; email: string; phone: string };
}

export const reservationService = {
  /**
   * Securely book a vehicle via the AvailabilityEngine (pessimistic lock).
   */
  async create(payload: CreateReservationPayload): Promise<Reservation> {
    const { data } = await api.post("/public/reservations", payload);
    return data.data ?? data;
  },

  /**
   * Fetch the authenticated client's reservations.
   */
  async getMyReservations(): Promise<Reservation[]> {
    const { data } = await api.get("/reservations/my");
    return data.data ?? data;
  },

  /**
   * Get a single reservation by ID.
   */
  async getReservation(id: number): Promise<Reservation> {
    const { data } = await api.get(`/reservations/${id}`);
    return data.data ?? data;
  },

  /**
   * Cancel a reservation.
   */
  async cancel(id: number): Promise<void> {
    await api.post(`/reservations/${id}/cancel`);
  },

  /**
   * Generate the contract PDF for a reservation.
   */
  async generateContract(reservationId: number, lang: string = 'fr'): Promise<{ url: string }> {
    const { data } = await api.post(`/reservations/${reservationId}/contract`, { lang });
    return data;
  },

  /**
   * Sign the contract for a reservation.
   */
  async signContract(reservationId: number, signature: string): Promise<{ url: string }> {
    const { data } = await api.post(`/reservations/${reservationId}/sign`, { signature });
    return data;
  },

  async getAll(params?: { status?: string; page?: number; per_page?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.set('status', params.status);
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.per_page) queryParams.set('per_page', params.per_page.toString());
    const qs = queryParams.toString();
    const res = await api.get(`/reservations${qs ? `?${qs}` : ''}`);
    return res.data;
  },

  async update(id: number, data: Record<string, unknown>) {
    const res = await api.put(`/reservations/${id}`, data);
    return res.data;
  },

  async accept(id: number) {
    const res = await api.post(`/reservations/${id}/accept`);
    return res.data;
  },

  async reject(id: number) {
    const res = await api.post(`/reservations/${id}/reject`);
    return res.data;
  },
};
