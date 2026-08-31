"use client";

import { cn } from "@/shared/utils";
import { Calendar, MapPin, Clock, AlertCircle, CheckCircle2, Loader2, WifiOff, Calculator } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BookingState } from "@/types/booking";
import type { AvailabilityStatus } from "../hooks/useVehicleAvailability";
import { useMemo } from "react";
import { calculatePrice } from "@/shared/utils/pricing";
import { fmt } from "@/shared/utils/format";
import { useTranslation } from "@/shared/hooks/useTranslation";

interface PeriodStepProps {
  booking: BookingState;
  update: <K extends keyof BookingState>(key: K, val: BookingState[K]) => void;
  getFieldError: (field: string) => string | null;
  handleBlur: (field: string, value: string) => void;
  availability?: AvailabilityStatus;
  vehiclePricePerDay?: number;
}

function FieldError({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1.5 text-xs font-semibold text-red-500 mt-1"
    >
      <AlertCircle size={12} />
      {error}
    </motion.p>
  );
}

function AvailabilityBadge({ status }: { status: AvailabilityStatus }) {
  const { t } = useTranslation();
  if (status === "idle") return null;

  const config = {
    checking: {
      bg: "bg-blue-50 border-blue-200",
      text: "text-blue-700",
      icon: <Loader2 size={14} className="animate-spin" />,
      label: t("period_avail_checking"),
    },
    available: {
      bg: "bg-emerald-50 border-emerald-200",
      text: "text-emerald-700",
      icon: <CheckCircle2 size={14} />,
      label: t("period_avail_available"),
    },
    unavailable: {
      bg: "bg-red-50 border-red-200",
      text: "text-red-700",
      icon: <AlertCircle size={14} />,
      label: t("period_avail_unavailable"),
    },
    error: {
      bg: "bg-amber-50 border-amber-200",
      text: "text-amber-700",
      icon: <WifiOff size={14} />,
      label: t("period_avail_error"),
    },
  } as const;

  const c = config[status];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="col-span-full overflow-hidden"
    >
      <div
        className={cn(
          "flex items-center gap-2.5 px-5 py-3 rounded-2xl border text-sm font-semibold",
          c.bg,
          c.text
        )}
      >
        {c.icon}
        {c.label}
      </div>
    </motion.div>
  );
}

export default function PeriodStep({
  booking,
  update,
  getFieldError,
  handleBlur,
  availability = "idle",
  vehiclePricePerDay = 0,
}: PeriodStepProps) {
  const { t } = useTranslation();

  const days = useMemo(() => {
    if (!booking.startDate || !booking.endDate) return 0;
    const diff = new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime();
    return Math.max(1, Math.round(diff / 86400000));
  }, [booking.startDate, booking.endDate]);

  const pricePreview = useMemo(() => {
    if (!vehiclePricePerDay || !days) return null;
    return calculatePrice({
      pricePerDay: vehiclePricePerDay,
      days,
      startDate: booking.startDate,
      flexibility: booking.flexibility,
      mileage: booking.mileage,
    });
  }, [vehiclePricePerDay, days, booking.startDate, booking.flexibility, booking.mileage]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div
        className={cn(
          "bg-surface-0 p-8 rounded-3xl border transition-all duration-300 space-y-4",
          getFieldError("startDate")
            ? "border-red-200 bg-red-50/30"
            : "border-border/80 shadow-sm group focus-within:border-primary/30"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
            <Calendar size={18} />
          </div>
          <label
            htmlFor="startDate"
            className="text-xs font-semibold uppercase tracking-wider text-ink-2"
          >
            {t("period_start_label")}
          </label>
        </div>
        <input
          id="startDate"
          type="date"
          value={booking.startDate}
          onChange={(e) => update("startDate", e.target.value)}
          onBlur={(e) => handleBlur("startDate", e.target.value)}
          className={cn(
            "w-full bg-surface-1 border rounded-xl px-6 py-4 font-medium text-ink-1 focus:bg-surface-0 focus:border-primary/20 transition-all outline-none",
            getFieldError("startDate")
              ? "border-red-200 bg-red-50"
              : "border-border"
          )}
          suppressHydrationWarning
        />
        <FieldError error={getFieldError("startDate")} />
      </motion.div>

      <motion.div
        className={cn(
          "bg-surface-0 p-8 rounded-3xl border transition-all duration-300 space-y-4",
          getFieldError("endDate")
            ? "border-red-200 bg-red-50/30"
            : "border-border/80 shadow-sm group focus-within:border-primary/30"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
            <Clock size={18} />
          </div>
          <label
            htmlFor="endDate"
            className="text-xs font-semibold uppercase tracking-wider text-ink-2"
          >
            {t("period_end_label")}
          </label>
        </div>
        <input
          id="endDate"
          type="date"
          value={booking.endDate}
          min={booking.startDate ? (() => { const d = new Date(booking.startDate); d.setDate(d.getDate() + 1); return d.toISOString().split("T")[0]; })() : undefined}
          onChange={(e) => update("endDate", e.target.value)}
          onBlur={(e) => handleBlur("endDate", e.target.value)}
          className={cn(
            "w-full bg-surface-1 border rounded-xl px-6 py-4 font-medium text-ink-1 focus:bg-surface-0 focus:border-primary/20 transition-all outline-none",
            getFieldError("endDate")
              ? "border-red-200 bg-red-50"
              : "border-border"
          )}
          suppressHydrationWarning
        />
        <FieldError error={getFieldError("endDate")} />
      </motion.div>

      <motion.div
        className={cn(
          "bg-surface-0 p-8 rounded-3xl border transition-all duration-300 space-y-4 md:col-span-2",
          getFieldError("location")
            ? "border-red-200 bg-red-50/30"
            : "border-border/80 shadow-sm group focus-within:border-primary/30"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
            <MapPin size={18} />
          </div>
          <label
            htmlFor="location"
            className="text-xs font-semibold uppercase tracking-wider text-ink-2"
          >
            {t("period_location_label")}
          </label>
        </div>
        <input
          id="location"
          type="text"
          placeholder={t("period_location_placeholder")}
          value={booking.location}
          onChange={(e) => update("location", e.target.value)}
          onBlur={(e) => handleBlur("location", e.target.value)}
          className={cn(
            "w-full bg-surface-1 border rounded-xl px-6 py-4 font-medium text-ink-1 focus:bg-surface-0 focus:border-primary/20 transition-all outline-none placeholder:text-ink-4",
            getFieldError("location")
              ? "border-red-200 bg-red-50"
              : "border-border"
          )}
        />
        <FieldError error={getFieldError("location")} />
      </motion.div>

      <AnimatePresence>
        <AvailabilityBadge status={availability} />
      </AnimatePresence>

      {/* Live Price Preview */}
      {pricePreview && pricePreview.total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-full bg-gradient-to-r from-primary/5 to-gold/5 border-2 border-primary/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Calculator size={18} className="text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-ink-2">{t("period_price_preview")}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3 mb-1">{t("period_days_label")}</p>
              <p className="text-xl font-black text-ink-1">{days}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3 mb-1">{t("period_rate_label")}</p>
              <p className="text-xl font-black text-ink-1">{fmt(pricePreview.dailyRate)} DH</p>
            </div>
            {pricePreview.optionsPrice > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3 mb-1">{t("period_options_label")}</p>
                <p className="text-xl font-black text-primary">+{fmt(pricePreview.optionsPrice)} DH</p>
              </div>
            )}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3 mb-1">{t("period_total_label")}</p>
              <p className="text-2xl font-black text-gold">{fmt(pricePreview.total)} DH</p>
            </div>
          </div>
          {pricePreview.dynamicReason && (
            <p className="text-xs text-primary font-semibold mt-3 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {pricePreview.dynamicReason} {t("period_dynamic_applied")}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
