"use client";

import { BookingState } from "@/types/booking";
import { useCurrency } from "@/shared/hooks/useCurrency";
import { ShieldCheck, Calendar, MapPin, Info, Pencil, MessageCircle, Phone, Loader2, Check, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PRICING_OPTIONS } from "@/lib/config/pricing";
import { fmt } from "@/shared/utils/format";
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

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
      {/* Vehicle mini info */}
      {vehicleLoading ? (
        <div className="flex items-center gap-3 text-gray-400 py-6 justify-center">
          <Loader2 size={18} className="animate-spin" />
          <p className="text-[12px] font-semibold">Chargement...</p>
        </div>
      ) : vehicle ? (
        <div className="flex gap-4 pb-5 border-b border-gray-100">
          <div className="w-[80px] h-[60px] rounded-xl overflow-hidden bg-gray-100 shrink-0">
            <img
              src={vehicle.img || "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=600"}
              alt={vehicle.model || ""}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{vehicle.brand}</p>
            <h4 className="text-[14px] font-bold text-gray-900 truncate">{vehicle.model}</h4>
            <p className="text-[12px] text-gray-500">{vehicle.type}</p>
          </div>
          {showEditVehicle && onEditVehicle && (
            <button
              onClick={onEditVehicle}
              className="shrink-0 w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[var(--navy)] hover:border-[var(--navy)]/30 transition-all"
              aria-label="Changer de véhicule"
            >
              <Pencil size={11} />
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-gray-400 py-6 border-2 border-dashed border-gray-200 rounded-xl">
          <Info size={16} />
          <p className="text-[12px] font-semibold">Aucun véhicule choisi</p>
        </div>
      )}

      {/* Price per day */}
      {vehicle && (
        <div className="pb-5 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Prix / jour</span>
            <span className="text-[16px] font-bold text-gray-900">
              {fmt(vehicle.price || 0)} <span className="text-[11px] text-gray-400 font-medium">MAD</span>
            </span>
          </div>
        </div>
      )}

      {/* Rental details */}
      <AnimatePresence>
        {currentStep > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 pb-5 border-b border-gray-100 overflow-hidden"
          >
            {booking.startDate && (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar size={13} />
                  <span className="text-[12px]">Durée</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-gray-900 text-[13px]">
                    {days || "--"} {days > 1 ? "jours" : days === 1 ? "jour" : ""}
                  </span>
                  {showEditPeriod && onEditPeriod && (
                    <button
                      onClick={onEditPeriod}
                      className="w-5 h-5 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[var(--navy)] transition-all"
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
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin size={13} />
                  <span className="text-[12px]">Lieu</span>
                </div>
                <span className="font-semibold text-gray-900 text-[13px] truncate max-w-[140px]">{booking.location}</span>
              </div>
            )}
            {booking.flexibility === "flexible" && (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-400">
                  <ShieldCheck size={13} />
                  <span className="text-[12px]">Flexibilité</span>
                </div>
                <span className="font-semibold text-gray-900 text-[13px]">+{PRICING_OPTIONS.FLEXIBILITY_PER_DAY * (days || 1)} MAD</span>
              </div>
            )}
            {booking.mileage === "unlimited" && (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-400">
                  <Info size={13} />
                  <span className="text-[12px]">Km illimités</span>
                </div>
                <span className="font-semibold text-gray-900 text-[13px]">+{PRICING_OPTIONS.UNLIMITED_MILEAGE_PER_DAY * (days || 1)} MAD</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Total */}
      {days > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 pb-5 border-b border-gray-100"
        >
          <div className="flex justify-between items-baseline">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Rental</span>
            <motion.span
              key={total}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[22px] font-bold text-gray-900"
            >
              {fmt(total)} <span className="text-[12px] font-medium text-gray-400">MAD</span>
            </motion.span>
          </div>

          {deposit > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-gray-500">Acompte (10%)</span>
              <span className="text-[13px] font-semibold text-gray-700">{fmt(deposit)} MAD</span>
            </div>
          )}
        </motion.div>
      )}

      {/* Estimated price (step 0) */}
      {currentStep === 0 && !days && vehicle && estimatedPricing && (
        <div className="pb-5 border-b border-gray-100">
          <div className="flex justify-between items-baseline">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Estimation 1 jour</span>
            <span className="text-[18px] font-bold text-gray-900">{fmt(estimatedPricing.total)} MAD</span>
          </div>
        </div>
      )}

      {/* Trust badge */}
      <div className="flex items-center gap-2 py-2 px-3 bg-gray-50 rounded-xl border border-gray-100">
        <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
        <p className="text-[11px] font-semibold text-gray-500">Paiement Sécurisé</p>
      </div>

      {/* Trust badges */}
      <div className="space-y-2.5">
        {[
          { icon: <Check size={14} className="text-gray-400" strokeWidth={2.5} />, text: "Free Cancellation" },
          { icon: <Check size={14} className="text-gray-400" strokeWidth={2.5} />, text: "Insurance Included" },
          { icon: <Clock size={14} className="text-gray-400" strokeWidth={2.5} />, text: "24/7 Support" },
        ].map((badge, i) => (
          <div key={i} className="flex items-center gap-2.5">
            {badge.icon}
            <span className="text-[12px] text-gray-500 font-medium">{badge.text}</span>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className="pt-3 border-t border-gray-100 space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Questions?</p>
        <div className="flex gap-2">
          <a href="https://wa.me/212600000000" target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-[12px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            <MessageCircle size={14} /> WhatsApp
          </a>
          <a href="tel:+212600000000"
            className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-[12px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            <Phone size={14} /> Call Us
          </a>
        </div>
      </div>
    </div>
  );
}
