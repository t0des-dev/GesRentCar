"use client";

import { X, Star, ShieldCheck, Gauge, Fuel, Users, ArrowRight, CalendarDays, Crown } from "lucide-react";
import { cn } from "@/shared/utils";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useCurrency } from "@/shared/hooks/useCurrency";
import Image from "next/image";
import { getImageUrl } from "@/shared/utils/image";
import { Button } from "@/shared/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface QuickViewModalProps {
  vehicle: {
    id: number;
    brand: string;
    model: string;
    type: string;
    category?: string;
    price_per_day?: number;
    price: number;
    seats: number;
    fuel: string;
    fuel_type?: string;
    transmission: string;
    image_url?: string;
    imageUrl?: string;
    rating?: number;
    gps?: boolean;
    air_conditioning?: boolean;
    year?: number;
  };
  onClose: () => void;
}

function DateInput({
  label, value, onChange, min,
}: { label: string; value: string; onChange: (v: string) => void; min?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-black uppercase tracking-widest text-ink-3">{label}</label>
      <div className="relative">
        <CalendarDays size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none" />
        <input
          type="date"
          value={value}
          min={min}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-surface-2 text-sm font-semibold text-ink-1 bg-surface-1 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all cursor-pointer"
        />
      </div>
    </div>
  );
}

export default function QuickViewModal({ vehicle, onClose }: QuickViewModalProps) {
  const { t } = useTranslation();
  const { convert } = useCurrency();

  const today = new Date().toISOString().split("T")[0];
  const defaultEnd = new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(defaultEnd);

  const pricePerDay = vehicle.price_per_day || vehicle.price || 0;

  const { days, totalPrice } = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end.getTime() - start.getTime();
    const d = Math.max(1, Math.ceil(diffMs / 86400000));
    return { days: d, totalPrice: d * pricePerDay };
  }, [startDate, endDate, pricePerDay]);

  const bookingUrl = `/booking?vehicle=${vehicle.id}&start=${startDate}&end=${endDate}`;
  const imageUrl = vehicle.image_url || (vehicle as any).imageUrl;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-label={`${vehicle.brand} ${vehicle.model}`}
      >
        <motion.div
          className="absolute inset-0 bg-ink-1/80 backdrop-blur-md"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        <motion.div
          className="relative w-full max-w-5xl bg-surface-0 rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row"
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 24 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-20 bg-black/10 backdrop-blur-md hover:bg-black/20 text-white md:text-ink-1 p-2 rounded-full transition-all"
          >
            <X size={22} />
          </button>

          {/* ─── Left: Image ─── */}
          <div className="flex-1 relative bg-surface-2 min-h-[280px] md:min-h-[500px] group overflow-hidden">
            <Image
              src={getImageUrl(imageUrl) || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop"}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              alt={vehicle.model}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Category badge */}
            {vehicle.category && (
              <div className="absolute top-5 left-5 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-xs font-black text-ink-1 shadow-md border border-white/30">
                {vehicle.category === "Luxe" ? <Crown size={12} className="text-amber-500" /> : null}
                {vehicle.category}
              </div>
            )}

            {/* Price overlay on image */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">{convert(pricePerDay)}</span>
                <span className="text-white/70 text-sm font-semibold">{t("quickview_per_day")}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Star size={13} className="fill-gold text-gold" />
                <span className="text-white/80 text-xs font-bold">{vehicle.rating || 4.9} · {t("quickview_rating_text")}</span>
              </div>
            </div>
          </div>

          {/* ─── Right: Info ─── */}
          <div className="w-full md:w-[420px] p-7 md:p-10 overflow-y-auto max-h-[90vh] flex flex-col gap-6">

            {/* Brand & Model */}
            <div>
              <p className="text-primary font-black text-xs uppercase tracking-[0.2em] mb-1">{vehicle.brand}</p>
              <h2 className="text-3xl font-black text-ink-1 tracking-tight">{vehicle.model}</h2>
              {vehicle.year && (
                <span className="text-xs font-bold text-ink-3 bg-surface-1 px-2 py-1 rounded-lg border border-border inline-block mt-2">
                  {vehicle.year}
                </span>
              )}
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Users, label: "Places", value: `${vehicle.seats} personnes` },
                { icon: Gauge, label: "Transmission", value: t(`trans_${vehicle.transmission?.toLowerCase()}`) || vehicle.transmission },
                { icon: Fuel, label: "Carburant", value: vehicle.fuel_type || vehicle.fuel },
                { icon: ShieldCheck, label: "Assurance", value: "Incluse" },
              ].map((s, i) => (
                <div key={i} className="bg-surface-1 p-3.5 rounded-2xl border border-surface-2 flex flex-col gap-1">
                  <s.icon size={15} className="text-primary mb-1" />
                  <span className="text-[9px] font-black uppercase text-ink-3 tracking-widest">{s.label}</span>
                  <span className="text-sm font-bold text-ink-1">{s.value}</span>
                </div>
              ))}
            </div>

            <div className="h-px bg-surface-2" />

            {/* ─── Inline Date Picker ─── */}
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-ink-3">{t("quickview_dates_heading")}</p>
              <div className="grid grid-cols-2 gap-3">
                <DateInput
                  label={t("quickview_date_departure")}
                  value={startDate}
                  min={today}
                  onChange={(v) => {
                    setStartDate(v);
                    if (v >= endDate) {
                      const next = new Date(new Date(v).getTime() + 86400000);
                      setEndDate(next.toISOString().split("T")[0]);
                    }
                  }}
                />
                <DateInput
                  label={t("quickview_date_return")}
                  value={endDate}
                  min={startDate}
                  onChange={setEndDate}
                />
              </div>

              {/* Real-time price summary */}
              <motion.div
                key={totalPrice}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-primary/5 border border-primary/15 rounded-2xl p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-ink-3">
                    {days} {days > 1 ? t("quickview_nights") : t("quickview_night")} · {t("quickview_estimated_price")}
                  </p>
                  <p className="text-2xl font-black text-ink-1 mt-0.5">{convert(totalPrice)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-ink-3">{convert(pricePerDay)}</p>
                  <p className="text-[9px] text-ink-4">× {days} {days > 1 ? t("quickview_days") : t("quickview_day")}</p>
                </div>
              </motion.div>
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-1 gap-3 mt-auto">
              <Button asChild variant="default" size="lg" className="w-full rounded-[20px] py-6 text-xs shadow-xl shadow-primary/20">
                <Link href={bookingUrl}>
                  {t("quickview_cta_book_now")}
                  <ArrowRight size={16} />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="w-full rounded-[20px] py-5 text-[10px]">
                <Link href={`/fleet/${vehicle.id}`}>
                  {t("quickview_cta_view_details")}
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
