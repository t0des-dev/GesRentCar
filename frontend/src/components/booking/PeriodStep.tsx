"use client";

import { BookingStepProps } from "@/types/booking";

export default function PeriodStep({ booking, update }: BookingStepProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-3">
        <label className="text-[10px] font-black uppercase text-slate-500">Date de départ</label>
        <input 
          type="date" 
          value={booking.startDate} 
          onChange={(e) => update("startDate", e.target.value)} 
          className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" 
          suppressHydrationWarning 
        />
      </div>
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-3">
        <label className="text-[10px] font-black uppercase text-slate-500">Date de retour</label>
        <input 
          type="date" 
          value={booking.endDate} 
          min={booking.startDate || undefined} 
          onChange={(e) => update("endDate", e.target.value)} 
          className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" 
          suppressHydrationWarning 
        />
      </div>
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-3 md:col-span-2">
        <label className="text-[10px] font-black uppercase text-slate-500">Lieu de prise en charge</label>
        <input 
          type="text" 
          placeholder="Ex: Aéroport Mohammed V..." 
          value={booking.location} 
          onChange={(e) => update("location", e.target.value)} 
          className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" 
        />
      </div>
    </div>
  );
}
