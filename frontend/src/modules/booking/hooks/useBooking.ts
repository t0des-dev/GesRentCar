"use client";

import { useState, useMemo, useEffect } from "react";
import { BookingState } from "@/types/booking";

const MOCK_OPTIONS = [
  { id: "chauffeur", price: 1500, type: "per_day" },
  { id: "airport_vip", price: 500, type: "fixed" },
  { id: "champagne", price: 1200, type: "fixed" },
  { id: "vip_insure", price: 300, type: "per_day" },
];

export function useBooking(initialVehicles: any[] = []) {
  const [step, setStep] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [previewVehicle, setPreviewVehicle] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);

  const [booking, setBooking] = useState<BookingState>({
    vehicleId: null, startDate: "", endDate: "", location: "", options: [],
    client: { 
      name: "", email: "", phone: "", cin: "", licenseNumber: "",
      cinImageUrl: "", licenseImageUrl: "", verified: false 
    },
    paymentMethod: "deposit_card",
  });

  useEffect(() => {
    // Read from URL and localStorage to prepopulate booking
    const params = new URLSearchParams(window.location.search);
    const vId = params.get("vehicle");
    const sDate = params.get("start_date") || localStorage.getItem('vrc_search_start') || "";
    const eDate = params.get("end_date") || localStorage.getItem('vrc_search_end') || "";
    const loc = params.get("location") || localStorage.getItem('vrc_search_location') || "";

    setBooking(prev => ({
      ...prev,
      vehicleId: vId ? Number(vId) : prev.vehicleId,
      startDate: sDate,
      endDate: eDate,
      location: loc
    }));

    if (vId) {
      setStep(1); // Auto advance to period step if vehicle is already selected
    }
  }, []);

  const update = (key: keyof BookingState, val: any) => setBooking(prev => ({ ...prev, [key]: val }));

  const vehicle = initialVehicles.find(v => v.id === booking.vehicleId);

  const days = useMemo(() => {
    if (!booking.startDate || !booking.endDate) return 0;
    const diff = new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime();
    return Math.max(1, Math.round(diff / 86400000));
  }, [booking.startDate, booking.endDate]);

  const basePrice = vehicle ? vehicle.price * days : 0;
  const isHighSeason = booking.startDate && (new Date(booking.startDate).getMonth() === 6 || new Date(booking.startDate).getMonth() === 7);
  const dynamicBasePrice = Math.round(basePrice * (isHighSeason ? 1.15 : 1));
  
  const optionsPrice = booking.options.reduce((sum, optId) => {
    const opt = MOCK_OPTIONS.find(o => o.id === optId);
    if (!opt) return sum;
    return sum + (opt.type === "per_day" ? opt.price * days : opt.price);
  }, 0);

  const total = dynamicBasePrice + optionsPrice;
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
