"use client";

import { useState, useMemo, useEffect } from "react";
import { BookingState } from "@/types/booking";
import { calculatePrice } from "@/shared/utils/pricing";

export interface DisplayVehicle {
  id: number;
  price: number;
  brand?: string;
  model?: string;
  type?: string;
  img?: string;
  desc?: string;
  specs?: {
    transmission?: string;
    fuel?: string;
    seats?: number;
    mileage?: number;
  };
}

export function useBooking(initialVehicles: DisplayVehicle[] = []) {
  const [step, setStep] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [previewVehicle, setPreviewVehicle] = useState<DisplayVehicle | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);

  const [booking, setBooking] = useState<BookingState>(() => ({
    vehicleId: null, startDate: "", endDate: "", location: "",
    flexibility: "best_price", mileage: "limited",
    client: {
      name: "", email: "", phone: "", cin: "", licenseNumber: "",
      cinImageUrl: "", licenseImageUrl: "", verified: false
    },
    paymentMethod: "deposit_card",
  }));

  // Sync from URL params + localStorage AFTER hydration to avoid mismatch
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const vehicleId = params.get("vehicle") ? Number(params.get("vehicle")) : null;
    const startDate = params.get("start_date") || localStorage.getItem('vrc_search_start') || "";
    const endDate = params.get("end_date") || localStorage.getItem('vrc_search_end') || "";
    const location = params.get("location") || localStorage.getItem('vrc_search_location') || "";

    setBooking(prev => ({
      ...prev,
      vehicleId: vehicleId ?? prev.vehicleId,
      startDate: startDate || prev.startDate,
      endDate: endDate || prev.endDate,
      location: location || prev.location,
    }));

    if (vehicleId) {
      setStep(1);
    }
  }, []);

  const update = <K extends keyof BookingState>(key: K, val: BookingState[K]) => setBooking(prev => ({ ...prev, [key]: val }));

  const vehicle = initialVehicles.find(v => v.id === booking.vehicleId);

  const days = useMemo(() => {
    if (!booking.startDate || !booking.endDate) return 0;
    const diff = new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime();
    return Math.max(1, Math.round(diff / 86400000));
  }, [booking.startDate, booking.endDate]);

  const pricing = useMemo(() => {
    const pricePerDay = vehicle?.price ?? 0;
    return calculatePrice({
      pricePerDay,
      days: days || 1,
      startDate: booking.startDate,
      flexibility: booking.flexibility,
      mileage: booking.mileage,
    });
  }, [vehicle?.price, days, booking.startDate, booking.flexibility, booking.mileage]);

  const { total, deposit } = pricing;

  const canNext = () => {
    if (step === 0) return booking.vehicleId !== null;
    if (step === 1) return !!booking.startDate && !!booking.endDate && !!booking.location;
    if (step === 3) return !!(booking.client.name && booking.client.phone && booking.client.cin);
    if (step === 4) return !!signature;
    return true;
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => Math.max(0, prev - 1));

  return {
    step, setStep, nextStep, prevStep, canNext,
    confirmed, setConfirmed,
    reservationId, setReservationId,
    previewVehicle, setPreviewVehicle,
    isScanning, setIsScanning,
    signature, setSignature,
    booking, update,
    vehicle, days, total, deposit
  };
}
