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
