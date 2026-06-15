"use client";

import { BookingStepProps } from "@/types/booking";
import { Calendar, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function PeriodStep({ booking, update }: BookingStepProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div 
        className="bg-white p-8 rounded-3xl border border-slate-100/80 shadow-sm space-y-4 group focus-within:border-primary/30 transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
            <Calendar size={18} />
          </div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Départ du séjour</label>
        </div>
        <input 
          type="date" 
          value={booking.startDate} 
          onChange={(e) => update("startDate", e.target.value)} 
          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-6 py-4 font-medium text-slate-900 focus:bg-white focus:border-primary/20 transition-all outline-none" 
          suppressHydrationWarning 
        />
      </motion.div>

      <motion.div 
        className="bg-white p-8 rounded-3xl border border-slate-100/80 shadow-sm space-y-4 group focus-within:border-primary/30 transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
            <Clock size={18} />
          </div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Fin du séjour</label>
        </div>
        <input 
          type="date" 
          value={booking.endDate} 
          min={booking.startDate || undefined} 
          onChange={(e) => update("endDate", e.target.value)} 
          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-6 py-4 font-medium text-slate-900 focus:bg-white focus:border-primary/20 transition-all outline-none" 
          suppressHydrationWarning 
        />
      </motion.div>

      <motion.div 
        className="bg-white p-8 rounded-3xl border border-slate-100/80 shadow-sm space-y-4 md:col-span-2 group focus-within:border-primary/30 transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
            <MapPin size={18} />
          </div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Point de rencontre / Aéroport</label>
        </div>
        <input 
          type="text" 
          placeholder="Ex: Aéroport Mohammed V (CMN)..." 
          value={booking.location} 
          onChange={(e) => update("location", e.target.value)} 
          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-6 py-4 font-medium text-slate-900 focus:bg-white focus:border-primary/20 transition-all outline-none placeholder:text-slate-300" 
        />
      </motion.div>
    </div>
  );
}
