"use client";

import { BookingState } from "@/types/booking";
import { useCurrency } from "@/hooks/useCurrency";
import { ShieldCheck, Info, Calendar, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";

interface BookingSummaryProps {
  booking: BookingState;
  days: number;
  total: number;
  deposit: number;
  vehicle: any;
}

export default function BookingSummary({ booking, days, total, deposit, vehicle }: BookingSummaryProps) {
  const { convert } = useCurrency();

  return (
    <aside className="w-full lg:w-1/3 sticky top-32">
      <div className="bg-white rounded-[48px] border border-slate-100 shadow-[0_40px_100px_rgba(0,0,0,0.05)] overflow-hidden">
        {/* Header Preview - Premium Dark Mode */}
        <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-[80px] rounded-full" />
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-3">Récapitulatif</p>
            <h3 className="text-3xl font-black tracking-tighter">Votre Sélection <span className="text-white/40 font-light tracking-normal italic">Prestige</span></h3>
          </div>
        </div>

        <div className="p-10 space-y-10">
          {vehicle ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-8"
            >
              <div className="w-28 h-24 bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 shrink-0 shadow-sm relative group">
                <img src={vehicle.img} alt={vehicle.model} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-colors" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Star size={10} className="fill-primary text-primary" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">{vehicle.type}</p>
                </div>
                <h4 className="text-xl font-black text-slate-900 leading-tight">{vehicle.brand}</h4>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">{vehicle.model}</p>
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center gap-6 text-slate-300 py-6 border-2 border-dashed border-slate-50 rounded-[32px] justify-center bg-slate-50/50">
              <Info size={24} />
              <p className="text-xs font-black uppercase tracking-widest">Aucun véhicule choisi</p>
            </div>
          )}

          <div className="space-y-5 border-y border-slate-50 py-8">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-3 text-slate-400 font-bold">
                <Calendar size={16} />
                <span>Durée de location</span>
              </div>
              <span className="font-black text-slate-900">{days} {days > 1 ? "jours" : "jour"}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-3 text-slate-400 font-bold">
                <MapPin size={16} />
                <span>Lieu de retrait</span>
              </div>
              <span className="font-black text-slate-900">{booking.location || "Non défini"}</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <span className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Total Net à payer</span>
              <span className="text-3xl font-black text-slate-900 tracking-tighter">{total.toLocaleString()} DH</span>
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-emerald-50 rounded-[32px] p-8 border border-emerald-100/50 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex justify-between items-center">
                <div>
                  <span className="text-emerald-700 font-black text-[10px] uppercase tracking-[0.2em] block mb-1">Acompte Immédiat (10%)</span>
                  <span className="text-[10px] text-emerald-600/60 font-bold italic">Pour bloquer la réservation</span>
                </div>
                <span className="text-2xl font-black text-emerald-700 tracking-tighter">{deposit.toLocaleString()} DH</span>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center gap-3 py-4 px-6 bg-slate-50 rounded-2xl border border-slate-100">
            <ShieldCheck size={18} className="text-emerald-500" />
            <p className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">Paiement Sécurisé & Confidentialité Garantie</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
