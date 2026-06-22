export interface Reservation {
  id: number;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  client?: { 
    name: string; 
    email?: string;
    phone?: string;
    cin_image_url?: string; 
    license_image_url?: string; 
  };
  vehicle?: { brand: string; model: string; plate: string };
  contract?: {
    file_path: string;
  };
}

export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  plate: string;
  price_per_day: number;
  status: 'available' | 'rented' | 'maintenance';
  category?: string;
  type?: string;
  mileage?: number;
  fuel_type?: string;
  horsepower?: string;
  year?: number;
  color?: string;
  image_url?: string;
  photos?: string[];
  total_revenue?: number;
  total_maintenance_cost?: number;
  insurance_date?: string;
  tech_inspection_date?: string;
  vignette_date?: string;
  description_fr?: string;
  seo_title?: string;
  seo_description?: string;
  og_image_url?: string;
}

export interface Maintenance {
  id: number;
  vehicle_id: number;
  title?: string;
  type?: string;
  description?: string;
  cost: number;
  date?: string;
  maintenance_date?: string;
  mileage?: number;
  status?: "pending" | "in_progress" | "completed";
  vehicle?: Vehicle;
  created_at?: string;
}

export interface Expense {
  id: number;
  title: string;
  amount: number;
  expense_date: string;
  category: string;
  vehicle_id?: number | null;
  payment_method?: string;
  receipt_url?: string;
  notes?: string;
  vehicle?: Vehicle;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  revenue: number;
  reservations_count: number;
  active_bookings: number;
  occupancy_rate: number;
  maintenance_alerts?: { vehicle: string; plate: string; days: number }[];
  partner_due?: number;
  revenue_history?: { month: string; revenue: number }[];
  fleet_distribution?: { name: string; value: number }[];
  top_vehicles?: { brand: string; model: string; count: number; revenue: number }[];
  payment_status?: { name: string; value: number }[];
}
