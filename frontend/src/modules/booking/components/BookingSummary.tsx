"use client";

import { BookingState } from "@/types/booking";
import { useCurrency } from "@/shared/hooks/useCurrency";
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
      <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm overflow-hidden">
        <div className="bg-slate-900 p-8 text-white">
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">Récapitulatif</p>
            <h3 className="text-2xl font-bold tracking-tight">Votre Sélection</h3>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {vehicle ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-6"
            >
              <div className="w-24 h-20 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shrink-0 shadow-sm">
                <img src={vehicle.img} alt={vehicle.model} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Star size={10} className="fill-primary text-primary" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">{vehicle.type}</p>
                </div>
                <h4 className="text-lg font-bold text-slate-900 leading-tight">{vehicle.brand}</h4>
                <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">{vehicle.model}</p>
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center gap-4 text-slate-300 py-5 border-2 border-dashed border-slate-100 rounded-2xl justify-center">
              <Info size={20} />
              <p className="text-xs font-semibold uppercase tracking-wider">Aucun véhicule choisi</p>
            </div>
          )}

          <div className="space-y-4 border-y border-slate-100 py-6">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar size={16} />
                <span>Durée de location</span>
              </div>
              <span className="font-semibold text-slate-900">{days} {days > 1 ? "jours" : "jour"}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin size={16} />
                <span>Lieu de retrait</span>
              </div>
              <span className="font-semibold text-slate-900">{booking.location || "Non défini"}</span>
            </div>
            {booking.flexibility === "flexible" && (
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <ShieldCheck size={16} />
                  <span>Flexibilité</span>
                </div>
                <span className="font-semibold text-slate-900">+{60 * days} DH</span>
              </div>
            )}
            {booking.mileage === "unlimited" && (
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <Info size={16} />
                  <span>Km illimités</span>
                </div>
                <span className="font-semibold text-slate-900">+{140 * days} DH</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Total Net à payer</span>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">{total.toLocaleString()} DH</span>
            </div>
            
            <motion.div 
              className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100/50"
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-emerald-700 font-semibold text-xs uppercase tracking-wider block mb-1">Acompte Immédiat (10%)</span>
                  <span className="text-xs text-emerald-600/60 italic">Pour bloquer la réservation</span>
                </div>
                <span className="text-xl font-bold text-emerald-700 tracking-tight">{deposit.toLocaleString()} DH</span>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center gap-2 py-3 px-5 bg-slate-50 rounded-xl border border-slate-100">
            <ShieldCheck size={16} className="text-emerald-500" />
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Paiement Sécurisé & Confidentialité Garantie</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
