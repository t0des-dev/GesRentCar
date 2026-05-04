"use client";

import { BookingStepProps } from "@/types/booking";
import { Calendar, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function PeriodStep({ booking, update }: BookingStepProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <motion.div 
        whileHover={{ y: -4 }}
        className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] space-y-6 group focus-within:border-primary/30 transition-all duration-500"
      >
        <div className="flex items-center gap-4 text-primary mb-2">
          <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center">
            <Calendar size={20} />
          </div>
          <label className="text-[10px] font-black uppercase tracking-[0.3em]">Départ du séjour</label>
        </div>
        <input 
          type="date" 
          value={booking.startDate} 
          onChange={(e) => update("startDate", e.target.value)} 
          className="w-full bg-slate-50 border-2 border-slate-50 rounded-3xl px-8 py-5 font-black text-slate-900 focus:bg-white focus:border-primary/20 transition-all outline-none" 
          suppressHydrationWarning 
        />
      </motion.div>

      <motion.div 
        whileHover={{ y: -4 }}
        className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] space-y-6 group focus-within:border-primary/30 transition-all duration-500"
      >
        <div className="flex items-center gap-4 text-primary mb-2">
          <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center">
            <Clock size={20} />
          </div>
          <label className="text-[10px] font-black uppercase tracking-[0.3em]">Fin du séjour</label>
        </div>
        <input 
          type="date" 
          value={booking.endDate} 
          min={booking.startDate || undefined} 
          onChange={(e) => update("endDate", e.target.value)} 
          className="w-full bg-slate-50 border-2 border-slate-50 rounded-3xl px-8 py-5 font-black text-slate-900 focus:bg-white focus:border-primary/20 transition-all outline-none" 
          suppressHydrationWarning 
        />
      </motion.div>

      <motion.div 
        whileHover={{ y: -4 }}
        className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] space-y-6 md:col-span-2 group focus-within:border-primary/30 transition-all duration-500"
      >
        <div className="flex items-center gap-4 text-primary mb-2">
          <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center">
            <MapPin size={20} />
          </div>
          <label className="text-[10px] font-black uppercase tracking-[0.3em]">Point de rencontre / Aéroport</label>
        </div>
        <input 
          type="text" 
          placeholder="Ex: Aéroport Mohammed V (CMN)..." 
          value={booking.location} 
          onChange={(e) => update("location", e.target.value)} 
          className="w-full bg-slate-50 border-2 border-slate-50 rounded-3xl px-8 py-5 font-black text-slate-900 focus:bg-white focus:border-primary/20 transition-all outline-none placeholder:text-slate-300" 
        />
      </motion.div>
    </div>
  );
}
