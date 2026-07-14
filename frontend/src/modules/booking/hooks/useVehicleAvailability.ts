"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { vehicleService } from "@/lib/api/vehicles";

export type AvailabilityStatus = "idle" | "checking" | "available" | "unavailable" | "error";

export function useVehicleAvailability(
  vehicleId: number | null,
  startDate: string,
  endDate: string
) {
  const [status, setStatus] = useState<AvailabilityStatus>("idle");
  const abortRef = useRef<AbortController | null>(null);
  const lastKeyRef = useRef<string>("");

  const check = useCallback(async () => {
    if (!vehicleId || !startDate || !endDate) {
      return;
    }

    if (startDate >= endDate) {
      setStatus("unavailable");
      return;
    }

    // Cancel previous request
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus("checking");

    try {
      const result = await vehicleService.checkAvailability(
        vehicleId,
        startDate,
        endDate
      );
      if (!controller.signal.aborted) {
        setStatus(result.available ? "available" : "unavailable");
      }
    } catch (err: any) {
      if (!controller.signal.aborted) {
        const is404 = err?.response?.status === 404;
        setStatus(is404 ? "unavailable" : "error");
      }
    }
  }, [vehicleId, startDate, endDate]);

  // Derive idle state without calling setState in effect
  const isIdle = !vehicleId || !startDate || !endDate;
  const hasInvalidRange = !!startDate && !!endDate && startDate >= endDate;
  const effectiveStatus = isIdle ? "idle" : hasInvalidRange ? "unavailable" : status;

  // Debounce: check 600ms after dates settle
  useEffect(() => {
    if (isIdle) {
      // Cancel any pending check
      if (abortRef.current) {
        abortRef.current.abort();
      }
      lastKeyRef.current = "";
      return;
    }

    const key = `${vehicleId}|${startDate}|${endDate}`;
    if (key === lastKeyRef.current) return;
    lastKeyRef.current = key;

    const timer = setTimeout(check, 600);
    return () => {
      clearTimeout(timer);
    };
  }, [check, isIdle, vehicleId, startDate, endDate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  return { status: effectiveStatus, recheck: check };
}
