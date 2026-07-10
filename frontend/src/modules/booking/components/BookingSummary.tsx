"use client";

import { BookingState } from "@/types/booking";
import { useCurrency } from "@/shared/hooks/useCurrency";
import { ShieldCheck, Calendar, MapPin, Info, Pencil, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

  const isStep0 = currentStep === 0;

  return (
    <aside className="w-full sticky top-32">
      <div className="bg-surface-0 rounded-3xl border border-border/80 shadow-sm overflow-hidden">
        <div className="bg-primary p-5 text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
              <ShieldCheck size={16} />
            </div>
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-primary-foreground/60">Récapitulatif</p>
              <h3 className="text-base font-bold tracking-tight">Votre Sélection</h3>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {vehicleLoading ? (
            <div className="flex items-center gap-3 text-ink-3 py-6 justify-center">
              <Loader2 size={18} className="animate-spin" />
              <p className="text-[10px] font-semibold uppercase tracking-wider">Chargement...</p>
            </div>
          ) : vehicle ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-12 bg-surface-1 rounded-xl overflow-hidden border border-border shrink-0">
                  <img
                    src={vehicle.img || "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=600"}
                    alt={vehicle.model || ""}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Star size={8} className="fill-primary text-primary" />
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-primary truncate">{vehicle.type}</p>
                  </div>
                  <h4 className="text-sm font-bold text-ink-1 leading-tight truncate">{vehicle.brand}</h4>
                  <p className="text-[10px] text-ink-3 font-medium uppercase tracking-wider truncate">{vehicle.model}</p>
                </div>
                {showEditVehicle && onEditVehicle && (
                  <button
                    onClick={onEditVehicle}
                    className="shrink-0 w-7 h-7 rounded-full bg-surface-1 border border-border flex items-center justify-center text-ink-3 hover:text-primary hover:border-primary/30 transition-all"
                    aria-label="Changer de véhicule"
                  >
                    <Pencil size={11} />
                  </button>
                )}
              </div>

              <div className="bg-surface-1 rounded-xl p-3 border border-border">
                <div className="flex justify-between items-center">
                  <span className="text-ink-3 text-[9px] font-semibold uppercase tracking-wider">Prix / jour</span>
                  <span className="text-base font-bold text-ink-1">
                    {fmt(vehicle.price || 0)} <span className="text-[10px] text-ink-3 font-medium">DH</span>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-ink-4 py-6 border-2 border-dashed border-border rounded-xl">
              <Info size={16} />
              <p className="text-[10px] font-semibold uppercase tracking-wider">Aucun véhicule choisi</p>
            </div>
          )}

          <AnimatePresence>
            {!isStep0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 border-t border-border pt-4 overflow-hidden"
              >
                {booking.startDate && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-ink-3">
                      <Calendar size={13} />
                      <span className="text-[10px]">Durée</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-ink-1 text-xs">
                        {days || "--"} {days > 1 ? "jours" : days === 1 ? "jour" : ""}
                      </span>
                      {showEditPeriod && onEditPeriod && (
                        <button
                          onClick={onEditPeriod}
                          className="w-5 h-5 rounded-full bg-surface-1 border border-border flex items-center justify-center text-ink-3 hover:text-primary hover:border-primary/30 transition-all"
                          aria-label="Modifier les dates"
                        >
                          <Pencil size={9} />
                        </button>
                      )}
                    </div>
                  </div>
                )}
                {booking.location && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-ink-3">
                      <MapPin size={13} />
                      <span className="text-[10px]">Lieu</span>
                    </div>
                    <span className="font-semibold text-ink-1 text-xs truncate max-w-[130px]">{booking.location}</span>
                  </div>
                )}
                {booking.flexibility === "flexible" && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-ink-3">
                      <ShieldCheck size={13} />
                      <span className="text-[10px]">Flexibilité</span>
                    </div>
                    <span className="font-semibold text-ink-1 text-xs">+{PRICING_OPTIONS.FLEXIBILITY_PER_DAY * (days || 1)} DH</span>
                  </div>
                )}
                {booking.mileage === "unlimited" && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-ink-3">
                      <Info size={13} />
                      <span className="text-[10px]">Km illimités</span>
                    </div>
                    <span className="font-semibold text-ink-1 text-xs">+{PRICING_OPTIONS.UNLIMITED_MILEAGE_PER_DAY * (days || 1)} DH</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {days > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3 border-t border-border pt-4"
            >
              <div className="flex justify-between items-end">
                <span className="text-ink-3 font-semibold text-[9px] uppercase tracking-wider">Total Net</span>
                <motion.span
                  key={total}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xl font-bold text-ink-1 tracking-tight"
                >
                  {fmt(total)} DH
                </motion.span>
              </div>

              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100/50">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-emerald-700 font-semibold text-[9px] uppercase tracking-wider block">Acompte (10%)</span>
                    <span className="text-[9px] text-emerald-600/60 italic">Pour bloquer la réservation</span>
                  </div>
                  <span className="text-sm font-bold text-emerald-700 tracking-tight">{fmt(deposit)} DH</span>
                </div>
              </div>
            </motion.div>
          )}

          {isStep0 && !days && vehicle && estimatedPricing && (
            <div className="border-t border-border pt-4">
              <div className="flex justify-between items-end">
                <span className="text-ink-3 font-semibold text-[9px] uppercase tracking-wider">Estimation 1 jour</span>
                <span className="text-lg font-bold text-ink-1 tracking-tight">{fmt(estimatedPricing.total)} DH</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 py-2 px-3 bg-surface-1 rounded-xl border border-border">
            <ShieldCheck size={12} className="text-emerald-500 shrink-0" />
            <p className="text-[9px] font-semibold uppercase tracking-wider text-ink-3">Paiement Sécurisé</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
