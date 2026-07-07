"use client";

import { BookingState } from "@/types/booking";
import { useCurrency } from "@/shared/hooks/useCurrency";
import Image from "next/image";
import { ShieldCheck, Info, Calendar, MapPin, Star, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import { useDirection } from "@/shared/hooks/useDirection";
import { PRICING_OPTIONS } from "@/lib/config/pricing";
import { fmt } from "@/shared/utils/format";
import { Loader2 } from "lucide-react";
import { calculatePrice } from "@/shared/utils/pricing";

interface SummaryVehicle {
  brand?: string;
  model?: string;
  type?: string;
  img?: string;
  price?: number;
}

interface BookingSummaryProps {
  booking: BookingState;
  days: number;
  total: number;
  deposit: number;
  vehicle?: SummaryVehicle | null;
  vehicleLoading?: boolean;
  currentStep?: number;
  onEditVehicle?: () => void;
  onEditPeriod?: () => void;
}

export default function BookingSummary({
  booking, days, total, deposit, vehicle, vehicleLoading,
  currentStep = 0, onEditVehicle, onEditPeriod,
}: BookingSummaryProps) {
  useCurrency();
  const dir = useDirection();

  const estimatedPricing = vehicle && !days
    ? calculatePrice({
        pricePerDay: vehicle.price || 0,
        days: 1,
        startDate: "",
        flexibility: "best_price",
        mileage: "limited",
      })
    : null;

  const showEditVehicle = currentStep !== 0 && vehicle;
  const showEditPeriod = currentStep !== 1 && currentStep > 0 && booking.startDate;

  return (
    <aside className="w-full sticky top-32 max-h-[calc(100vh-10rem)] overflow-y-auto">
      <div className="bg-surface-0 rounded-3xl border border-border/80 shadow-sm overflow-hidden">
        <div className="bg-primary p-6 text-primary-foreground">
          <div className="relative">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-1">Récapitulatif</p>
            <h3 className="text-xl font-bold tracking-tight">Votre Sélection</h3>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {vehicleLoading ? (
            <div className="flex items-center gap-4 text-ink-3 py-5 justify-center">
              <Loader2 size={20} className="animate-spin" />
              <p className="text-xs font-semibold uppercase tracking-wider">Chargement...</p>
            </div>
          ) : vehicle ? (
            <motion.div
              initial={{ opacity: 0, x: dir === "rtl" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 group"
            >
              <div className="w-20 h-16 bg-surface-1 rounded-xl overflow-hidden border border-border shrink-0 shadow-sm">
                <Image src={vehicle.img || ""} alt={vehicle.model || ""} width={80} height={64} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Star size={9} className="fill-primary text-primary" />
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-primary truncate">{vehicle.type}</p>
                </div>
                <h4 className="text-base font-bold text-ink-1 leading-tight truncate">{vehicle.brand}</h4>
                <p className="text-xs text-ink-3 font-medium uppercase tracking-wider truncate">{vehicle.model}</p>
              </div>
              {showEditVehicle && onEditVehicle && (
                <button
                  onClick={onEditVehicle}
                  className="shrink-0 w-8 h-8 rounded-full bg-surface-1 border border-border flex items-center justify-center text-ink-3 hover:text-primary hover:border-primary/30 transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Changer de véhicule"
                >
                  <Pencil size={12} />
                </button>
              )}
            </motion.div>
          ) : (
            <div className="flex items-center gap-3 text-ink-4 py-4 border-2 border-dashed border-border rounded-xl justify-center">
              <Info size={18} />
              <p className="text-[11px] font-semibold uppercase tracking-wider">Aucun véhicule choisi</p>
            </div>
          )}

          <div className="space-y-3 border-y border-border py-5">
            <div className="flex justify-between items-center text-sm group">
              <div className="flex items-center gap-2 text-ink-3">
                <Calendar size={15} />
                <span className="text-xs">Durée</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-ink-1 text-sm">{days || "--"} {days > 1 ? "jours" : days === 1 ? "jour" : ""}</span>
                {showEditPeriod && onEditPeriod && (
                  <button
                    onClick={onEditPeriod}
                    className="w-6 h-6 rounded-full bg-surface-1 border border-border flex items-center justify-center text-ink-3 hover:text-primary hover:border-primary/30 transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Modifier les dates"
                  >
                    <Pencil size={10} />
                  </button>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 text-ink-3">
                <MapPin size={15} />
                <span className="text-xs">Lieu</span>
              </div>
              <span className="font-semibold text-ink-1 text-sm truncate max-w-[140px]">{booking.location || "--"}</span>
            </div>
            {booking.flexibility === "flexible" && (
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-ink-3">
                  <ShieldCheck size={15} />
                  <span className="text-xs">Flexibilité</span>
                </div>
                <span className="font-semibold text-ink-1 text-sm">+{PRICING_OPTIONS.FLEXIBILITY_PER_DAY * (days || 1)} DH</span>
              </div>
            )}
            {booking.mileage === "unlimited" && (
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-ink-3">
                  <Info size={15} />
                  <span className="text-xs">Km illimités</span>
                </div>
                <span className="font-semibold text-ink-1 text-sm">+{PRICING_OPTIONS.UNLIMITED_MILEAGE_PER_DAY * (days || 1)} DH</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-ink-3 font-semibold text-[10px] uppercase tracking-wider">Total Net</span>
              {vehicleLoading ? (
                <div className="h-7 w-24 bg-surface-2 rounded-lg animate-pulse" />
              ) : !days && estimatedPricing ? (
                <div className="text-right">
                  <span className="text-xl font-bold text-ink-1 tracking-tight">{fmt(estimatedPricing.total)} DH</span>
                  <span className="block text-[9px] text-ink-4 font-medium">Estimation 1 jour</span>
                </div>
              ) : !days ? (
                <span className="text-xs text-ink-4 font-medium italic">Sélectionnez vos dates</span>
              ) : (
                <motion.span
                  key={total}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xl font-bold text-ink-1 tracking-tight"
                >
                  {fmt(total)} DH
                </motion.span>
              )}
            </div>

            <motion.div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100/50">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-emerald-700 font-semibold text-[10px] uppercase tracking-wider block mb-0.5">Acompte (10%)</span>
                  <span className="text-[10px] text-emerald-600/60 italic">Pour bloquer la réservation</span>
                </div>
                {vehicleLoading ? (
                  <div className="h-6 w-20 bg-emerald-100 rounded-lg animate-pulse" />
                ) : !days && estimatedPricing ? (
                  <span className="text-base font-bold text-emerald-700 tracking-tight">{fmt(estimatedPricing.deposit)} DH</span>
                ) : !days ? (
                  <span className="text-xs text-emerald-300 font-medium italic">--</span>
                ) : (
                  <span className="text-base font-bold text-emerald-700 tracking-tight">{fmt(deposit)} DH</span>
                )}
              </div>
            </motion.div>
          </div>

          <div className="flex items-center gap-2 py-2.5 px-4 bg-surface-1 rounded-xl border border-border">
            <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-3">Paiement Sécurisé</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
