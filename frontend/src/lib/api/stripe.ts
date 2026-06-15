import api from "@/shared/services/client";

export interface StripeIntentPayload {
  vehicle_id: number;
  start_date: string;
  end_date: string;
  amount: number; // deposit in DH
  client: {
    name: string;
    email: string;
    phone: string;
    cin: string;
    license_number?: string;
  };
  signature?: string;
}

export interface StripeIntentResponse {
  client_secret: string;
  reservation_id: number;
  amount: number;
  total_price: number;
}

export const stripeService = {
  /**
   * Create a Stripe PaymentIntent and a pending reservation on the backend.
   * Returns the client_secret to confirm payment on the frontend.
   */
  async createIntent(payload: StripeIntentPayload): Promise<StripeIntentResponse> {
    const { data } = await api.post("/stripe/intent", payload);
    return data;
  },

  /**
   * After Stripe confirms the payment, notify the backend to finalize the reservation.
   */
  async confirm(reservationId: number, paymentIntentId: string): Promise<void> {
    await api.post("/stripe/confirm", {
      reservation_id: reservationId,
      payment_intent_id: paymentIntentId,
    });
  },
};
