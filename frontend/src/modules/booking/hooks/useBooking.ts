"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { BookingState } from "@/types/booking";
import { calculatePrice } from "@/shared/utils/pricing";
import { useVehicleAvailability } from "./useVehicleAvailability";

export interface DisplayVehicle {
  id: number;
  price: number;
  brand?: string;
  model?: string;
  type?: string;
  category?: string;
  img?: string;
  desc?: string;
  specs?: {
    transmission?: string;
    fuel?: string;
    seats?: number;
    mileage?: number;
  };
}

function validateFieldValue(field: string, value: string, context?: { startDate?: string }): string | null {
  if (!value.trim()) return "Ce champ est requis";

  switch (field) {
    case "startDate": {
      const d = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (d < today) return "La date doit être aujourd'hui ou dans le futur";
      return null;
    }
    case "endDate": {
      if (context?.startDate && value < context.startDate) return "La date de fin doit être après la date de départ";
      return null;
    }
    case "location":
      return value.trim().length < 3 ? "Minimum 3 caractères" : null;
    case "name":
      return value.trim().length < 2 ? "Minimum 2 caractères" : null;
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : "Email invalide";
    case "phone": {
      const digits = value.replace(/\D/g, "");
      return digits.length < 10 ? "Minimum 10 chiffres" : null;
    }
    case "cin":
      return value.trim().length < 4 ? "Minimum 4 caractères" : null;
    case "licenseNumber":
      return value.trim().length < 4 ? "Minimum 4 caractères" : null;
    default:
      return null;
  }
}

const STEP_FIELDS: Record<number, string[]> = {
  1: ["startDate", "endDate", "location"],
  3: ["name", "email", "phone", "cin", "licenseNumber"],
};

function getStepFieldValues(stepNum: number, booking: BookingState): Record<string, string> {
  if (stepNum === 1) return { startDate: booking.startDate, endDate: booking.endDate, location: booking.location };
  if (stepNum === 3) return { name: booking.client.name, email: booking.client.email, phone: booking.client.phone, cin: booking.client.cin, licenseNumber: booking.client.licenseNumber };
  return {};
}

export function useBooking(initialVehicles: DisplayVehicle[] = []) {
  const [step, setStep] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [reservationStatus, setReservationStatus] = useState<string>("confirmed");
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

  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Availability check
  const { status: availabilityStatus, recheck: recheckAvailability } = useVehicleAvailability(
    booking.vehicleId,
    booking.startDate,
    booking.endDate
  );

  // Sync from URL params + localStorage AFTER hydration to avoid mismatch
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const vehicleId = params.get("vehicle") ? Number(params.get("vehicle")) : null;
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

    const storedStart = localStorage.getItem('vrc_search_start');
    const storedEnd = localStorage.getItem('vrc_search_end');

    const startDate = params.get("start_date") || (storedStart && storedStart >= today ? storedStart : today);
    const endDate = params.get("end_date") || (storedEnd && storedEnd >= today ? storedEnd : tomorrow);
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

  const setFieldTouched = useCallback((field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const validateField = useCallback((field: string, value: string) => {
    const context = field === "endDate" || field === "startDate" ? { startDate: booking.startDate } : undefined;
    const error = validateFieldValue(field, value, context);
    setErrors(prev => ({ ...prev, [field]: error }));
    return error;
  }, [booking.startDate]);

  const getFieldError = useCallback((field: string): string | null => {
    return touched[field] ? (errors[field] ?? null) : null;
  }, [touched, errors]);

  const handleBlur = useCallback((field: string, value: string) => {
    setFieldTouched(field);
    validateField(field, value);
  }, [setFieldTouched, validateField]);

  const handleFieldChange = useCallback(<K extends keyof BookingState>(key: K, val: BookingState[K]) => {
    update(key, val);
    if (key === "client" && typeof val === "object") return;
    const field = key as string;
    if (touched[field]) {
      validateField(field, val as string);
    }
  }, [update, touched, validateField]);

  const clientFieldChange = useCallback((field: string, value: string) => {
    setBooking(prev => ({ ...prev, client: { ...prev.client, [field]: value } }));
    if (touched[field]) {
      validateField(field, value);
    }
  }, [touched, validateField]);

  const validateStep = useCallback((): boolean => {
    const fields = STEP_FIELDS[step] || [];
    const values = getStepFieldValues(step, booking);
    let allValid = true;
    const newErrors: Record<string, string | null> = {};
    const newTouched: Record<string, boolean> = {};

    for (const f of fields) {
      const context = f === "endDate" ? { startDate: booking.startDate } : undefined;
      const error = validateFieldValue(f, values[f] || "", context);
      newErrors[f] = error;
      newTouched[f] = true;
      if (error) allValid = false;
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    setTouched(prev => ({ ...prev, ...newTouched }));
    return allValid;
  }, [step, booking]);

  const canNext = useCallback(() => {
    if (step === 0) return booking.vehicleId !== null;
    if (step === 1) {
      const fields = ["startDate", "endDate", "location"];
      const values = [booking.startDate, booking.endDate, booking.location];
      if (values.some(v => !v)) return false;
      const fieldsValid = fields.every(f => {
        const v = f === "startDate" ? booking.startDate : f === "endDate" ? booking.endDate : booking.location;
        return validateFieldValue(f, v, f === "endDate" ? { startDate: booking.startDate } : undefined) === null;
      });
      if (!fieldsValid) return false;
      // Block if availability check is ongoing or vehicle is unavailable
      if (availabilityStatus === "checking") return false;
      if (availabilityStatus === "unavailable") return false;
      return true;
    }
    if (step === 3) {
      const fields = ["name", "email", "phone", "cin", "licenseNumber"];
      const values = fields.map(f => booking.client[f as keyof typeof booking.client] as string);
      if (values.some(v => !v)) return false;
      return fields.every(f => validateFieldValue(f, booking.client[f as keyof typeof booking.client] as string) === null);
    }
    if (step === 4) return !!signature;
    return true;
  }, [step, booking, signature, availabilityStatus]);

  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };
  const prevStep = () => setStep(prev => Math.max(0, prev - 1));

  return {
    step, setStep, nextStep, prevStep, canNext,
    confirmed, setConfirmed,
    reservationId, setReservationId,
    reservationStatus, setReservationStatus,
    previewVehicle, setPreviewVehicle,
    isScanning, setIsScanning,
    signature, setSignature,
    booking, setBooking, update,
    vehicle, days, total, deposit,
    errors, touched,
    availabilityStatus, recheckAvailability,
    getFieldError, setFieldTouched, validateField, handleBlur, handleFieldChange, clientFieldChange, validateStep,
  };
}
