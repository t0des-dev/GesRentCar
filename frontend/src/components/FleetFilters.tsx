"use client";

import { useState } from "react";
import { SlidersHorizontal, Car, Gauge, Users, Wallet, RotateCcw, Star, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

const MAX_PRICE_VAL = 5000;

interface FleetFiltersProps {
  onFilter: (filters: FleetFilterState) => void;
  className?: string;
}

export interface FleetFilterState {
  type: string;
  transmission: string;
  maxPrice: number;
  seats: string;
  lifestyle: string;
}

export default function FleetFilters({ onFilter, className }: FleetFiltersProps) {
  const { t } = useTranslation();

  const TYPES = ["All", "Sedan", "SUV", "Sport", "Compact", "Luxury"];
  const TRANSMISSIONS = ["All", "Automatic", "Manual"];
  const SEATS = ["All", "2", "4", "5", "7+"];
  const LIFESTYLES = [
    { id: "all", label: "Tous", icon: Car },
    { id: "business", label: "Business", icon: Gauge },
    { id: "romance", label: "Romance", icon: Star },
    { id: "adventure", label: "Aventure", icon: MapPin },
    { id: "family", label: "Famille", icon: Users },
  ];

  const [filters, setFilters] = useState<FleetFilterState>({
    type: "All",
    transmission: "All",
    maxPrice: MAX_PRICE_VAL,
    seats: "All",
    lifestyle: "all",
  });

  const update = (key: keyof FleetFilterState, value: string | number) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onFilter(next);
  };

  const reset = () => {
    const def = { type: "All", transmission: "All", maxPrice: MAX_PRICE_VAL, seats: "All", lifestyle: "all" };
    setFilters(def);
    onFilter(def);
  };

  const getCategoryLabel = (type: string) => {
    return t(`cat_${type.toLowerCase()}`);
  };

  const getTransmissionLabel = (trans: string) => {
    if (trans === "All") return t("all");
    return t(`trans_${trans.toLowerCase()}`);
  };

  return (
    <div className={cn("flex flex-col gap-12", className)}>
      {/* Title & Reset */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-foreground tracking-tighter flex items-center gap-3">
          <SlidersHorizontal size={20} className="text-primary" />
          {t("filter_title")}
        </h3>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={reset}
          className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-primary flex items-center gap-2 transition-all bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
        >
          <RotateCcw size={10} /> {t("filter_clear")}
        </motion.button>
      </div>

      {/* Lifestyle Selection */}
      <div className="space-y-6">
        <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] flex items-center gap-2">
          <Star size={14} className="text-primary" /> VOTRE VIBE
        </label>
        <div className="grid grid-cols-2 gap-3">
          {LIFESTYLES.map((ls) => (
            <button
              key={ls.id}
              onClick={() => update("lifestyle", ls.id)}
              className={cn(
                "flex flex-col items-center gap-3 p-6 rounded-[32px] border transition-all duration-300",
                filters.lifestyle === ls.id
                  ? "bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-[1.02]"
                  : "bg-white/50 border-slate-200/60 text-slate-500 hover:border-primary/40 hover:bg-white"
              )}
            >
              <ls.icon size={20} />
              <span className="text-[9px] font-black uppercase tracking-widest">{ls.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Category: Vehicle Type */}
      <div className="space-y-6">
        <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] flex items-center gap-2">
          <Car size={14} /> {t("filter_category")}
        </label>
        <div className="flex flex-col gap-2">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => update("type", t)}
              className={cn(
                "group flex items-center justify-between px-6 py-4 rounded-2xl text-sm font-black transition-all border",
                filters.type === t
                  ? "bg-slate-900 text-white border-slate-900 shadow-xl"
                  : "bg-transparent border-white/10 text-slate-400 hover:border-primary/40 hover:bg-white/5"
              )}
            >
              {getCategoryLabel(t).toUpperCase()}
              <div className={cn(
                "w-1.5 h-1.5 rounded-full transition-all",
                filters.type === t ? "bg-primary scale-150" : "bg-slate-700 group-hover:bg-primary/40"
              )} />
            </button>
          ))}
        </div>
      </div>

      {/* Category: Transmission */}
      <div className="space-y-6">
        <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] flex items-center gap-2">
          <Gauge size={14} /> {t("filter_transmission")}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {TRANSMISSIONS.map((tr) => (
            <button
              key={tr}
              onClick={() => update("transmission", tr)}
              className={cn(
                "flex items-center justify-center px-4 py-3 rounded-2xl text-[10px] font-black transition-all border uppercase tracking-widest",
                filters.transmission === tr
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                  : "bg-transparent border-white/10 text-slate-500 hover:border-white/20"
              )}
            >
              {getTransmissionLabel(tr).toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Category: Seats */}
      <div className="space-y-6">
        <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] flex items-center gap-2">
          <Users size={14} /> {t("filter_capacity")}
        </label>
        <div className="flex flex-wrap gap-2">
          {SEATS.map((s) => (
            <button
              key={s}
              onClick={() => update("seats", s)}
              className={cn(
                "w-12 h-12 flex items-center justify-center rounded-2xl text-xs font-black border transition-all",
                filters.seats === s
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-transparent border-white/10 text-slate-500 hover:border-primary/40"
              )}
            >
              {s === "All" ? t("all").toUpperCase() : s}
            </button>
          ))}
        </div>
      </div>

      {/* Category: Price Range */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] flex items-center gap-2">
            <Wallet size={14} /> {t("filter_price_max")}
          </label>
          <span className="text-sm font-black text-foreground">{filters.maxPrice} {t("currency_day")}</span>
        </div>
        <div className="relative pt-2">
          <input
            type="range"
            min="200"
            max={MAX_PRICE_VAL}
            step="50"
            value={filters.maxPrice}
            onChange={(e) => update("maxPrice", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between mt-4">
            <span className="text-[9px] font-black text-slate-600 tracking-tighter">200 DH</span>
            <span className="text-[9px] font-black text-slate-600 tracking-tighter">3000+ DH</span>
          </div>
        </div>
      </div>
    </div>
  );
}

