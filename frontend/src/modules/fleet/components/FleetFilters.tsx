"use client";

import { useState } from "react";
import { SlidersHorizontal, Car, Gauge, Users, Wallet, RotateCcw, Star, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/shared/utils";
import { motion } from "framer-motion";
import { useTranslation } from "@/shared/hooks/useTranslation";

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

  const TYPES = [
    { id: "All", count: null },
    { id: "Sedan", count: 24 },
    { id: "SUV", count: 18 },
    { id: "Sport", count: 8 },
    { id: "Compact", count: 15 },
    { id: "Luxury", count: 12 }
  ];
  const TRANSMISSIONS = [
    { id: "All", count: null },
    { id: "Automatic", count: 68 },
    { id: "Manual", count: 9 }
  ];
  const SEATS = [
    { id: "All", count: null },
    { id: "2", count: 12 },
    { id: "4", count: 28 },
    { id: "5", count: 31 },
    { id: "7+", count: 6 }
  ];
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

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    lifestyle: true,
    type: true,
    transmission: false,
    seats: false,
    price: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

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
    <div className={cn("flex flex-col gap-10", className)}>
      {/* Title & Reset */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <SlidersHorizontal size={22} className="text-gold" />
          <h3 className="text-lg font-bold text-ink-1 uppercase tracking-wider">
            {t("filter_title")}
          </h3>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={reset}
          className="text-xs font-bold uppercase tracking-wider text-ink-3 hover:text-gold flex items-center gap-2 transition-all hover:bg-gold/5 px-4 py-2 rounded-lg border border-gold/20 hover:border-gold/40"
        >
          <RotateCcw size={12} /> Réinitialiser
        </motion.button>
      </div>

      {/* Lifestyle Selection */}
      <div className="space-y-4 border-b border-border/40 pb-6">
        <button 
          onClick={() => toggleSection("lifestyle")}
          className="w-full flex items-center justify-between text-xs font-black uppercase text-ink-3 tracking-widest hover:text-gold transition-colors text-left cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Star size={14} className="text-gold" /> Votre Vibe
          </span>
          {openSections.lifestyle ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {openSections.lifestyle && (
          <motion.div 
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-3 pt-2"
          >
            {LIFESTYLES.map((ls) => (
              <motion.button
                key={ls.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => update("lifestyle", ls.id)}
                className={cn(
                  "flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all duration-300 group cursor-pointer",
                  filters.lifestyle === ls.id
                    ? "bg-gradient-to-br from-gold/20 to-gold/10 border-gold/60 shadow-lg shadow-gold/20 scale-[1.02]"
                    : "bg-surface-1 border-border hover:border-gold/40 hover:bg-surface-2"
                )}
              >
                <ls.icon size={18} className={cn(
                  "transition-colors",
                  filters.lifestyle === ls.id ? "text-gold" : "text-ink-3 group-hover:text-gold"
                )} />
                <span className="text-[9px] font-bold uppercase tracking-widest text-ink-2">{ls.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Category: Vehicle Type */}
      <div className="space-y-4 border-b border-border/40 pb-6">
        <button 
          onClick={() => toggleSection("type")}
          className="w-full flex items-center justify-between text-xs font-black uppercase text-ink-3 tracking-widest hover:text-gold transition-colors text-left cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Car size={14} className="text-gold" /> {t("filter_category")}
          </span>
          {openSections.type ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {openSections.type && (
          <motion.div 
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2.5 pt-2"
          >
            {TYPES.map((t) => (
              <motion.button
                key={t.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => update("type", t.id)}
                className={cn(
                  "group flex items-center justify-between px-5 py-3 rounded-lg text-sm font-bold transition-all border-2 cursor-pointer",
                  filters.type === t.id
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/30"
                    : "bg-surface-1 border-border text-ink-2 hover:border-gold/40 hover:bg-surface-2"
                )}
              >
                <div className="flex items-center gap-2">
                  <span>{getCategoryLabel(t.id).toUpperCase()}</span>
                  {t.count !== null && (
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors",
                      filters.type === t.id ? "bg-white/20 text-white" : "bg-border text-ink-3 group-hover:bg-gold/10 group-hover:text-gold"
                    )}>
                      {t.count}
                    </span>
                  )}
                </div>
                <div className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  filters.type === t.id ? "bg-white scale-125" : "bg-gold/40 group-hover:bg-gold/60"
                )} />
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Category: Transmission */}
      <div className="space-y-4 border-b border-border/40 pb-6">
        <button 
          onClick={() => toggleSection("transmission")}
          className="w-full flex items-center justify-between text-xs font-black uppercase text-ink-3 tracking-widest hover:text-gold transition-colors text-left cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Gauge size={14} className="text-gold" /> {t("filter_transmission")}
          </span>
          {openSections.transmission ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {openSections.transmission && (
          <motion.div 
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-3 pt-2"
          >
            {TRANSMISSIONS.map((tr) => (
              <motion.button
                key={tr.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => update("transmission", tr.id)}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-lg text-[10px] font-bold transition-all border-2 tracking-widest gap-1 cursor-pointer",
                  filters.transmission === tr.id
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/30"
                    : "bg-surface-1 border-border text-ink-3 hover:border-gold/40 hover:bg-surface-2"
                )}
              >
                <span className="uppercase">{getTransmissionLabel(tr.id).toUpperCase()}</span>
                {tr.count !== null && (
                  <span className={cn(
                    "text-[9px] font-bold px-2 rounded-full",
                    filters.transmission === tr.id ? "bg-white/20 text-white" : "bg-border text-ink-4 group-hover:text-gold"
                  )}>
                    {tr.count}
                  </span>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Category: Seats */}
      <div className="space-y-4 border-b border-border/40 pb-6">
        <button 
          onClick={() => toggleSection("seats")}
          className="w-full flex items-center justify-between text-xs font-black uppercase text-ink-3 tracking-widest hover:text-gold transition-colors text-left cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Users size={14} className="text-gold" /> {t("filter_capacity")}
          </span>
          {openSections.seats ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {openSections.seats && (
          <motion.div 
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-3 pt-2"
          >
            {SEATS.map((s) => (
              <motion.button
                key={s.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => update("seats", s.id)}
                className={cn(
                  "relative w-14 h-14 flex items-center justify-center rounded-lg text-xs font-bold border-2 transition-all cursor-pointer",
                  filters.seats === s.id
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/30"
                    : "bg-surface-1 border-border text-ink-2 hover:border-gold/40 hover:bg-surface-2"
                )}
              >
                {s.id === "All" ? t("all").toUpperCase() : s.id}
                {s.count !== null && (
                  <span className={cn(
                    "absolute -top-2 -right-2 text-[8px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-white",
                    filters.seats === s.id ? "bg-gold text-white" : "bg-border text-ink-3"
                  )}>
                    {s.count}
                  </span>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Category: Price Range */}
      <div className="space-y-4">
        <button 
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between text-xs font-black uppercase text-ink-3 tracking-widest hover:text-gold transition-colors text-left cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Wallet size={14} className="text-gold" /> {t("filter_price_max")}
          </span>
          {openSections.price ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {openSections.price && (
          <motion.div 
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 pt-2"
          >
            <div className="flex justify-between items-center bg-gold/5 px-4 py-3 rounded-lg border border-gold/10">
              <span className="text-[10px] font-bold text-ink-3 uppercase tracking-wider">Limite max</span>
              <span className="text-sm font-black text-gold">{filters.maxPrice} {t("currency_day")}</span>
            </div>
            <div className="relative pt-2">
              <input
                type="range"
                min="200"
                max={MAX_PRICE_VAL}
                step="50"
                value={filters.maxPrice}
                onChange={(e) => update("maxPrice", Number(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-primary to-gold rounded-full appearance-none cursor-pointer accent-gold slider-thumb"
              />
              <div className="flex justify-between mt-3">
                <span className="text-[10px] font-bold text-ink-3 tracking-tighter">200 DH</span>
                <span className="text-[10px] font-bold text-ink-3 tracking-tighter">5000 DH</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

