"use client";

import { cn } from "@/shared/utils";
import { Calendar, MapPin, Clock, AlertCircle, CheckCircle2, Loader2, WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BookingState } from "@/types/booking";
import type { AvailabilityStatus } from "../hooks/useVehicleAvailability";

interface PeriodStepProps {
  booking: BookingState;
  update: <K extends keyof BookingState>(key: K, val: BookingState[K]) => void;
  getFieldError: (field: string) => string | null;
  handleBlur: (field: string, value: string) => void;
  availability?: AvailabilityStatus;
}

function FieldError({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1.5 text-xs font-semibold text-red-500 mt-1"
    >
      <AlertCircle size={12} />
      {error}
    </motion.p>
  );
}

function AvailabilityBadge({ status }: { status: AvailabilityStatus }) {
  if (status === "idle") return null;

  const config = {
    checking: {
      bg: "bg-blue-50 border-blue-200",
      text: "text-blue-700",
      icon: <Loader2 size={14} className="animate-spin" />,
      label: "Vérification de la disponibilité...",
    },
    available: {
      bg: "bg-emerald-50 border-emerald-200",
      text: "text-emerald-700",
      icon: <CheckCircle2 size={14} />,
      label: "Véhicule disponible pour ces dates",
    },
    unavailable: {
      bg: "bg-red-50 border-red-200",
      text: "text-red-700",
      icon: <AlertCircle size={14} />,
      label: "Véhicule non disponible — veuillez modifier vos dates",
    },
    error: {
      bg: "bg-amber-50 border-amber-200",
      text: "text-amber-700",
      icon: <WifiOff size={14} />,
      label: "Impossible de vérifier la disponibilité",
    },
  } as const;

  const c = config[status];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="col-span-full overflow-hidden"
    >
      <div
        className={cn(
          "flex items-center gap-2.5 px-5 py-3 rounded-2xl border text-sm font-semibold",
          c.bg,
          c.text
        )}
      >
        {c.icon}
        {c.label}
      </div>
    </motion.div>
  );
}

export default function PeriodStep({
  booking,
  update,
  getFieldError,
  handleBlur,
  availability = "idle",
}: PeriodStepProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div
        className={cn(
          "bg-surface-0 p-8 rounded-3xl border transition-all duration-300 space-y-4",
          getFieldError("startDate")
            ? "border-red-200 bg-red-50/30"
            : "border-border/80 shadow-sm group focus-within:border-primary/30"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
            <Calendar size={18} />
          </div>
          <label
            htmlFor="startDate"
            className="text-xs font-semibold uppercase tracking-wider text-ink-2"
          >
            Départ du séjour
          </label>
        </div>
        <input
          id="startDate"
          type="date"
          value={booking.startDate}
          onChange={(e) => update("startDate", e.target.value)}
          onBlur={(e) => handleBlur("startDate", e.target.value)}
          className={cn(
            "w-full bg-surface-1 border rounded-xl px-6 py-4 font-medium text-ink-1 focus:bg-surface-0 focus:border-primary/20 transition-all outline-none",
            getFieldError("startDate")
              ? "border-red-200 bg-red-50"
              : "border-border"
          )}
          suppressHydrationWarning
        />
        <FieldError error={getFieldError("startDate")} />
      </motion.div>

      <motion.div
        className={cn(
          "bg-surface-0 p-8 rounded-3xl border transition-all duration-300 space-y-4",
          getFieldError("endDate")
            ? "border-red-200 bg-red-50/30"
            : "border-border/80 shadow-sm group focus-within:border-primary/30"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
            <Clock size={18} />
          </div>
          <label
            htmlFor="endDate"
            className="text-xs font-semibold uppercase tracking-wider text-ink-2"
          >
            Fin du séjour
          </label>
        </div>
        <input
          id="endDate"
          type="date"
          value={booking.endDate}
          min={booking.startDate || undefined}
          onChange={(e) => update("endDate", e.target.value)}
          onBlur={(e) => handleBlur("endDate", e.target.value)}
          className={cn(
            "w-full bg-surface-1 border rounded-xl px-6 py-4 font-medium text-ink-1 focus:bg-surface-0 focus:border-primary/20 transition-all outline-none",
            getFieldError("endDate")
              ? "border-red-200 bg-red-50"
              : "border-border"
          )}
          suppressHydrationWarning
        />
        <FieldError error={getFieldError("endDate")} />
      </motion.div>

      <motion.div
        className={cn(
          "bg-surface-0 p-8 rounded-3xl border transition-all duration-300 space-y-4 md:col-span-2",
          getFieldError("location")
            ? "border-red-200 bg-red-50/30"
            : "border-border/80 shadow-sm group focus-within:border-primary/30"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
            <MapPin size={18} />
          </div>
          <label
            htmlFor="location"
            className="text-xs font-semibold uppercase tracking-wider text-ink-2"
          >
            Point de rencontre / Aéroport
          </label>
        </div>
        <input
          id="location"
          type="text"
          placeholder="Ex: Aéroport Mohammed V (CMN)..."
          value={booking.location}
          onChange={(e) => update("location", e.target.value)}
          onBlur={(e) => handleBlur("location", e.target.value)}
          className={cn(
            "w-full bg-surface-1 border rounded-xl px-6 py-4 font-medium text-ink-1 focus:bg-surface-0 focus:border-primary/20 transition-all outline-none placeholder:text-ink-4",
            getFieldError("location")
              ? "border-red-200 bg-red-50"
              : "border-border"
          )}
        />
        <FieldError error={getFieldError("location")} />
      </motion.div>

      <AnimatePresence>
        <AvailabilityBadge status={availability} />
      </AnimatePresence>
    </div>
  );
}
