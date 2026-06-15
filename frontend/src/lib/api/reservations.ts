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
  options?: any;
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
  options: any | null;
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
};
