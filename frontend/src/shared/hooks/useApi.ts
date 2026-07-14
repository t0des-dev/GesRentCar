import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vehicleService, VehicleFilters } from "@/lib/api/vehicles";
import { reservationService, CreateReservationPayload } from "@/lib/api/reservations";

// ─── Vehicles ────────────────────────────────────────────────────────────────

/**
 * Fetches paginated vehicles list with optional filters.
 * Falls back to mock data if API is unreachable.
 */
export function useVehicles(filters: VehicleFilters = {}, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["vehicles", filters],
    queryFn: () => vehicleService.getVehicles(filters),
    placeholderData: (prev) => prev,
    enabled: options?.enabled ?? true,
  });
}

export function useVehicle(id: number) {
  return useQuery({
    queryKey: ["vehicle", id],
    queryFn: () => vehicleService.getVehicle(id),
    enabled: !!id,
  });
}

export function useVehicleAvailability(vehicleId: number, startDate: string, endDate: string) {
  return useQuery({
    queryKey: ["availability", vehicleId, startDate, endDate],
    queryFn: () => vehicleService.checkAvailability(vehicleId, startDate, endDate),
    enabled: !!vehicleId && !!startDate && !!endDate,
  });
}

// ─── Reservations ─────────────────────────────────────────────────────────────

export function useMyReservations() {
  return useQuery({
    queryKey: ["reservations", "my"],
    queryFn: () => reservationService.getMyReservations(),
  });
}

export function useCreateReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReservationPayload) => reservationService.create(payload),
    onSuccess: () => {
      // Invalidate reservation list so dashboard refreshes
      queryClient.invalidateQueries({ queryKey: ["reservations", "my"] });
      // Also invalidate vehicles so availability updates
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}

export function useCancelReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reservationService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations", "my"] });
    },
  });
}

export function useGenerateContract() {
  return useMutation({
    mutationFn: ({ id, lang }: { id: number; lang?: string }) => reservationService.generateContract(id, lang),
  });
}

export function useSignContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, signature }: { id: number; signature: string }) => reservationService.signContract(id, signature),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reservation", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["reservations", "my"] });
    },
  });
}

// ─── Loyalty ─────────────────────────────────────────────────────────────────
export function useLoyaltyProfile() {
  return useQuery({
    queryKey: ["loyalty", "profile"],
    queryFn: async () => {
      const res = await import("@/shared/services/client").then(m => m.default.get("/loyalty/profile"));
      return res.data;
    },
  });
}

export function useLoyaltyHistory() {
  return useQuery({
    queryKey: ["loyalty", "history"],
    queryFn: async () => {
      const res = await import("@/shared/services/client").then(m => m.default.get("/loyalty/history"));
      return res.data;
    },
  });
}

export function useRedeemLoyalty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (points: number) => import("@/shared/services/client").then(m => m.default.post("/loyalty/redeem", { points })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty"] });
    },
  });
}

// ─── Reviews ─────────────────────────────────────────────────────────────────
export function useVehicleReviews(vehicleId: number) {
  return useQuery({
    queryKey: ["reviews", vehicleId],
    queryFn: async () => {
      const res = await import("@/shared/services/client").then(m => m.default.get(`/reviews/vehicle/${vehicleId}`));
      return res.data;
    },
    enabled: !!vehicleId,
  });
}

export function useVehicleReviewStats(vehicleId: number) {
  return useQuery({
    queryKey: ["reviews", "stats", vehicleId],
    queryFn: async () => {
      const res = await import("@/shared/services/client").then(m => m.default.get(`/reviews/vehicle/${vehicleId}/stats`));
      return res.data;
    },
    enabled: !!vehicleId,
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { vehicle_id: number; reservation_id: number; rating: number; title?: string; comment?: string; cleanliness?: number; performance?: number; value_for_money?: number }) =>
      import("@/shared/services/client").then(m => m.default.post("/reviews", data)),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.vehicle_id] });
    },
  });
}

// ─── Referrals ───────────────────────────────────────────────────────────────
export function useReferralCode() {
  return useQuery({
    queryKey: ["referral", "code"],
    queryFn: async () => {
      const res = await import("@/shared/services/client").then(m => m.default.get("/referral/code"));
      return res.data;
    },
  });
}

export function useReferralStats() {
  return useQuery({
    queryKey: ["referral", "stats"],
    queryFn: async () => {
      const res = await import("@/shared/services/client").then(m => m.default.get("/referral/stats"));
      return res.data;
    },
  });
}

// ─── Notifications ───────────────────────────────────────────────────────────
export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await import("@/shared/services/client").then(m => m.default.get("/notifications"));
      return res.data;
    },
    refetchInterval: 30000,
  });
}
