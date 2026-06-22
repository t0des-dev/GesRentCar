"use client";

import { useState, useMemo, useEffect } from "react";
import { BookingState } from "@/types/booking";

interface BookingVehicle {
  id: number;
  price: number;
  brand?: string;
  model?: string;
  type?: string;
  img?: string;
}

export function useBooking(initialVehicles: BookingVehicle[] = []) {
  const [step, setStep] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [previewVehicle, setPreviewVehicle] = useState<BookingVehicle | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);

  const [booking, setBooking] = useState<BookingState>(() => {
    if (typeof window === "undefined") {
      return {
        vehicleId: null, startDate: "", endDate: "", location: "", 
        flexibility: "best_price", mileage: "limited",
        client: { 
          name: "", email: "", phone: "", cin: "", licenseNumber: "",
          cinImageUrl: "", licenseImageUrl: "", verified: false 
        },
        paymentMethod: "deposit_card",
      };
    }
    const params = new URLSearchParams(window.location.search);
    return {
      vehicleId: params.get("vehicle") ? Number(params.get("vehicle")) : null,
      startDate: params.get("start_date") || localStorage.getItem('vrc_search_start') || "",
      endDate: params.get("end_date") || localStorage.getItem('vrc_search_end') || "",
      location: params.get("location") || localStorage.getItem('vrc_search_location') || "",
      flexibility: "best_price", mileage: "limited",
      client: { 
        name: "", email: "", phone: "", cin: "", licenseNumber: "",
        cinImageUrl: "", licenseImageUrl: "", verified: false 
      },
      paymentMethod: "deposit_card",
    };
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("vehicle")) {
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

  const basePrice = vehicle ? vehicle.price * days : 0;
  const isHighSeason = booking.startDate && (new Date(booking.startDate).getMonth() === 6 || new Date(booking.startDate).getMonth() === 7);
  const dynamicBasePrice = Math.round(basePrice * (isHighSeason ? 1.15 : 1));
  
  const flexibilityPrice = booking.flexibility === 'flexible' ? 60 * days : 0;
  const mileagePrice = booking.mileage === 'unlimited' ? 140 * days : 0;

  const total = dynamicBasePrice + flexibilityPrice + mileagePrice;
  const deposit = Math.round(total * 0.1);

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
