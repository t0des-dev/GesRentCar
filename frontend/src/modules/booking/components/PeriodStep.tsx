"use client";

import { cn } from "@/shared/utils";
import { Calendar, MapPin, Clock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { BookingState } from "@/types/booking";

interface PeriodStepProps {
  booking: BookingState;
  update: <K extends keyof BookingState>(key: K, val: BookingState[K]) => void;
  getFieldError: (field: string) => string | null;
  handleBlur: (field: string, value: string) => void;
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

export default function PeriodStep({ booking, update, getFieldError, handleBlur }: PeriodStepProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div 
        className={cn(
          "bg-surface-0 p-8 rounded-3xl border transition-all duration-300 space-y-4",
          getFieldError("startDate") ? "border-red-200 bg-red-50/30" : "border-border/80 shadow-sm group focus-within:border-primary/30"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
            <Calendar size={18} />
          </div>
          <label htmlFor="startDate" className="text-xs font-semibold uppercase tracking-wider text-ink-2">Départ du séjour</label>
        </div>
        <input 
          id="startDate"
          type="date" 
          value={booking.startDate} 
          onChange={(e) => update("startDate", e.target.value)} 
          onBlur={(e) => handleBlur("startDate", e.target.value)}
          className={cn(
            "w-full bg-surface-1 border rounded-xl px-6 py-4 font-medium text-ink-1 focus:bg-surface-0 focus:border-primary/20 transition-all outline-none",
            getFieldError("startDate") ? "border-red-200 bg-red-50" : "border-border"
          )}
          suppressHydrationWarning 
        />
        <FieldError error={getFieldError("startDate")} />
      </motion.div>

      <motion.div 
        className={cn(
          "bg-surface-0 p-8 rounded-3xl border transition-all duration-300 space-y-4",
          getFieldError("endDate") ? "border-red-200 bg-red-50/30" : "border-border/80 shadow-sm group focus-within:border-primary/30"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
            <Clock size={18} />
          </div>
          <label htmlFor="endDate" className="text-xs font-semibold uppercase tracking-wider text-ink-2">Fin du séjour</label>
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
            getFieldError("endDate") ? "border-red-200 bg-red-50" : "border-border"
          )}
          suppressHydrationWarning 
        />
        <FieldError error={getFieldError("endDate")} />
      </motion.div>

      <motion.div 
        className={cn(
          "bg-surface-0 p-8 rounded-3xl border transition-all duration-300 space-y-4 md:col-span-2",
          getFieldError("location") ? "border-red-200 bg-red-50/30" : "border-border/80 shadow-sm group focus-within:border-primary/30"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
            <MapPin size={18} />
          </div>
          <label htmlFor="location" className="text-xs font-semibold uppercase tracking-wider text-ink-2">Point de rencontre / Aéroport</label>
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
            getFieldError("location") ? "border-red-200 bg-red-50" : "border-border"
          )}
        />
        <FieldError error={getFieldError("location")} />
      </motion.div>
    </div>
  );
}
