"use client";

import { BookingState } from "@/types/booking";
import { useCurrency } from "@/shared/hooks/useCurrency";
import { ShieldCheck, Calendar, MapPin, Info, Pencil, Star, Check, Phone, Lock, Plane, Clock, Headphones } from "lucide-react";
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
  category?: string;
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

  const formatDate = (d?: string) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  };

  const extras = 0;
  const insurance = 0;
  const vehicleRental = (vehicle?.price || 0) * (days || 1);
  const totalCalc = vehicleRental + extras + insurance;
  const depositAmount = Math.round(totalCalc * 0.3);

  return (
    <aside className="w-full sticky top-32 space-y-6">

      {/* Main Summary Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 overflow-hidden">
        <div className="p-6 space-y-5">
          {vehicleLoading ? (
            <div className="flex items-center gap-3 text-gray-400 py-8 justify-center">
              <Loader2 size={20} className="animate-spin" />
              <p className="text-sm font-medium">Chargement...</p>
            </div>
          ) : vehicle ? (
            <>
              {/* Vehicle Header */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                  <img
                    src={vehicle.img || "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=600"}
                    alt={vehicle.model || ""}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-gray-900 leading-tight truncate">
                    {vehicle.brand} {vehicle.model || "Similar"}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {vehicle.price?.toLocaleString()} MAD / day
                  </p>
                  {days > 0 && (
                    <p className="text-[11px] text-gray-500 mt-1">
                      {days} Days · {formatDate(booking.startDate)} → {formatDate(booking.endDate)}
                    </p>
                  )}
                </div>
                {showEditVehicle && onEditVehicle && (
                  <button
                    onClick={onEditVehicle}
                    className="shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-all"
                  >
                    <Pencil size={14} />
                  </button>
                )}
              </div>

              {/* Pricing Breakdown */}
              {days > 0 && (
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Vehicle Rental ({days} {days > 1 ? "Days" : "Day"})</span>
                    <span className="text-sm font-semibold text-gray-900">{fmt(vehicleRental)} MAD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Extras</span>
                    <span className="text-sm font-semibold text-gray-900">{extras > 0 ? `${extras} MAD` : "0 MAD"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Insurance</span>
                    <span className="text-sm font-semibold text-gray-900">{insurance > 0 ? `${insurance} MAD` : "Not included"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Taxes</span>
                    <span className="text-sm font-semibold text-gray-900">Included</span>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <span className="text-sm font-bold text-gray-900">Total Rental</span>
                    <span className="text-xl font-black text-gray-900">{fmt(totalCalc)} MAD</span>
                  </div>
                </div>
              )}

              {/* Deposit Box */}
              {days > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold text-gray-900">Deposit Due Today (30%)</span>
                    <span className="text-lg font-black text-gray-900">{fmt(depositAmount)} MAD</span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Remaining balance {fmt(totalCalc - depositAmount)} MAD — payable upon vehicle pickup.
                  </p>
                </div>
              )}

              {/* CTA Button */}
              <button className="w-full py-4 bg-[#16213E] text-white rounded-2xl text-sm font-bold uppercase tracking-wider hover:bg-[#1a2744] transition-all hover:shadow-lg hover:shadow-[#16213E]/30">
                Reserve & Pay Deposit
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-400 py-8 border-2 border-dashed border-gray-200 rounded-2xl">
              <Info size={20} />
              <p className="text-sm font-medium">Aucun véhicule choisi</p>
            </div>
          )}
        </div>

        {/* Inclusions */}
        <div className="px-6 pb-6 space-y-3">
          <div className="border-t border-gray-100 pt-5" />
          {[
            { icon: Lock, label: "Secure Payment" },
            { icon: Check, label: "Free Cancellation" },
            { icon: Plane, label: "Airport Delivery" },
            { icon: Headphones, label: "24/7 Support" },
            { icon: Star, label: "Trusted Local Partner Network" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <item.icon size={11} className="text-emerald-600" />
              </div>
              <span className="text-sm text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Need Help */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h4 className="text-sm font-bold text-gray-900">Need Help?</h4>
        <div className="grid grid-cols-2 gap-3">
          <a
            href="https://wa.me/212600000000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-700 text-sm font-semibold hover:bg-gray-100 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-500">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
          <a
            href="tel:+212600000000"
            className="flex items-center justify-center gap-2 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-700 text-sm font-semibold hover:bg-gray-100 transition-all"
          >
            <Phone size={16} />
            Call Us
          </a>
        </div>
      </div>
    </aside>
  );
}
