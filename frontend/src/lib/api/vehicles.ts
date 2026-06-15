import api from "@/shared/services/client";

export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  plate: string;
  price_per_day: number;
  mileage: number;
  status: "available" | "rented" | "maintenance";
  type: "internal" | "collaborator";
  image_url: string | null;
  photos: string[] | null;
  dynamic_price?: number;
  dynamic_reason?: string | null;
  
  // Technical specs
  year?: number;
  fuel_type?: string;
  transmission?: string;
  seats?: number;
  horsepower?: number;
  
  // Localized descriptions
  description_fr?: string;
  description_en?: string;
  description_ar?: string;
}

export interface VehicleFilters {
  type?: string;
  status?: string;
  min_price?: number;
  max_price?: number;
  start_date?: string;
  end_date?: string;
  page?: number;
  per_page?: number;
  ids?: number[];
}

export interface PaginatedVehicles {
  data: Vehicle[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

export const vehicleService = {
  /**
   * Fetch paginated, filtered list of available vehicles.
   */
  async getVehicles(filters: VehicleFilters = {}): Promise<PaginatedVehicles> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        params.append(k, String(v));
      }
    });
    const { data } = await api.get(`/vehicles?${params.toString()}`);
    return data;
  },

  /**
   * Get a single vehicle by ID.
   */
  async getVehicle(id: number): Promise<Vehicle> {
    const { data } = await api.get(`/vehicles/${id}`);
    return data.data ?? data;
  },

  /**
   * Check vehicle availability for a date range (no locking).
   */
  async checkAvailability(
    vehicleId: number,
    startDate: string,
    endDate: string
  ): Promise<{ available: boolean }> {
    const { data } = await api.get(`/vehicles/${vehicleId}/availability`, {
      params: { start_date: startDate, end_date: endDate },
    });
    return data;
  },
};
