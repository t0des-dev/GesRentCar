"use client";

import { BookingState } from "@/types/booking";
import { useCurrency } from "@/shared/hooks/useCurrency";
import Image from "next/image";
import { ShieldCheck, Info, Calendar, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useDirection } from "@/shared/hooks/useDirection";
import { PRICING_OPTIONS } from "@/lib/config/pricing";
import { fmt } from "@/shared/utils/format";
import { Loader2 } from "lucide-react";

interface SummaryVehicle {
  brand?: string;
  model?: string;
  type?: string;
  img?: string;
}

interface BookingSummaryProps {
  booking: BookingState;
  days: number;
  total: number;
  deposit: number;
  vehicle?: SummaryVehicle | null;
  vehicleLoading?: boolean;
}

export default function BookingSummary({ booking, days, total, deposit, vehicle, vehicleLoading }: BookingSummaryProps) {
  useCurrency();
  const dir = useDirection();

  return (
    <aside className="w-full lg:w-1/3 sticky top-32">
      <div className="bg-surface-0 rounded-3xl border border-border/80 shadow-sm overflow-hidden">
        <div className="bg-primary p-8 text-primary-foreground">
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">Récapitulatif</p>
            <h3 className="text-2xl font-bold tracking-tight">Votre Sélection</h3>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {vehicleLoading ? (
            <div className="flex items-center gap-4 text-ink-3 py-5 justify-center">
              <Loader2 size={20} className="animate-spin" />
              <p className="text-xs font-semibold uppercase tracking-wider">Chargement...</p>
            </div>
          ) : vehicle ? (
            <motion.div 
              initial={{ opacity: 0, x: dir === "rtl" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-6"
            >
              <div className="w-24 h-20 bg-surface-1 rounded-2xl overflow-hidden border border-border shrink-0 shadow-sm">
                <Image src={vehicle.img || ""} alt={vehicle.model || ""} width={96} height={80} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Star size={10} className="fill-primary text-primary" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">{vehicle.type}</p>
                </div>
                <h4 className="text-lg font-bold text-ink-1 leading-tight">{vehicle.brand}</h4>
                <p className="text-sm text-ink-3 font-medium uppercase tracking-wider">{vehicle.model}</p>
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center gap-4 text-ink-4 py-5 border-2 border-dashed border-border rounded-2xl justify-center">
              <Info size={20} />
              <p className="text-xs font-semibold uppercase tracking-wider">Aucun véhicule choisi</p>
            </div>
          )}

          <div className="space-y-4 border-y border-border py-6">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 text-ink-3">
                <Calendar size={16} />
                <span>Durée de location</span>
              </div>
              <span className="font-semibold text-ink-1">{days} {days > 1 ? "jours" : "jour"}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 text-ink-3">
                <MapPin size={16} />
                <span>Lieu de retrait</span>
              </div>
              <span className="font-semibold text-ink-1">{booking.location || "Non défini"}</span>
            </div>
            {booking.flexibility === "flexible" && (
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-ink-3">
                  <ShieldCheck size={16} />
                  <span>Flexibilité</span>
                </div>
                <span className="font-semibold text-ink-1">+{PRICING_OPTIONS.FLEXIBILITY_PER_DAY * days} DH</span>
              </div>
            )}
            {booking.mileage === "unlimited" && (
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-ink-3">
                  <Info size={16} />
                  <span>Km illimités</span>
                </div>
                <span className="font-semibold text-ink-1">+{PRICING_OPTIONS.UNLIMITED_MILEAGE_PER_DAY * days} DH</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-ink-3 font-semibold text-xs uppercase tracking-wider">Total Net à payer</span>
              {vehicleLoading ? (
                <div className="h-8 w-28 bg-surface-2 rounded-lg animate-pulse" />
              ) : !days ? (
                <span className="text-sm text-ink-4 font-medium italic">Sélectionnez vos dates</span>
              ) : (
                <span className="text-2xl font-bold text-ink-1 tracking-tight">{fmt(total)} DH</span>
              )}
            </div>
            
            <motion.div 
              className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100/50"
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-emerald-700 font-semibold text-xs uppercase tracking-wider block mb-1">Acompte Immédiat (10%)</span>
                  <span className="text-xs text-emerald-600/60 italic">Pour bloquer la réservation</span>
                </div>
                {vehicleLoading ? (
                  <div className="h-7 w-24 bg-emerald-100 rounded-lg animate-pulse" />
                ) : !days ? (
                  <span className="text-sm text-emerald-300 font-medium italic">--</span>
                ) : (
                  <span className="text-xl font-bold text-emerald-700 tracking-tight">{fmt(deposit)} DH</span>
                )}
              </div>
            </motion.div>
          </div>

          <div className="flex items-center gap-2 py-3 px-5 bg-surface-1 rounded-xl border border-border">
            <ShieldCheck size={16} className="text-emerald-500" />
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-3">Paiement Sécurisé & Confidentialité Garantie</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
