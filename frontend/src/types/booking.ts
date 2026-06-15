export interface BookingClient {
  name: string;
  email: string;
  phone: string;
  cin: string;
  licenseNumber: string;
  cinImageUrl?: string;
  licenseImageUrl?: string;
  verified?: boolean;
}

export interface BookingState {
  vehicleId: number | null;
  startDate: string;
  endDate: string;
  location: string;
  flexibility: "best_price" | "flexible";
  mileage: "limited" | "unlimited";
  client: BookingClient;
  paymentMethod: "deposit_card" | "full_card";
}

export interface BookingStepProps {
  booking: BookingState;
  update: (key: keyof BookingState, val: any) => void;
  next?: () => void;
  prev?: () => void;
}
