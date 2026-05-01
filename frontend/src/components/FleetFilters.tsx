"use client";

import { useState } from "react";
import { SlidersHorizontal, X, Car, Gauge, Users, Wallet, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPES = ["All", "Sedan", "SUV", "Sport", "Compact", "Luxury"];
const TRANSMISSIONS = ["All", "Automatic", "Manual"];
const SEATS = ["All", "2", "4", "5", "7+"];
const MAX_PRICE_VAL = 3000;

interface FleetFiltersProps {
  onFilter: (filters: FleetFilterState) => void;
  className?: string;
}

export interface FleetFilterState {
  type: string;
  transmission: string;
  maxPrice: number;
  seats: string;
}

export default function FleetFilters({ onFilter, className }: FleetFiltersProps) {
  const [filters, setFilters] = useState<FleetFilterState>({
    type: "All",
    transmission: "All",
    maxPrice: MAX_PRICE_VAL,
    seats: "All",
  });

  const update = (key: keyof FleetFilterState, value: string | number) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onFilter(next);
  };

  const reset = () => {
    const def = { type: "All", transmission: "All", maxPrice: MAX_PRICE_VAL, seats: "All" };
    setFilters(def);
    onFilter(def);
  };

  return (
    <div className={cn("flex flex-col gap-10", className)}>
      {/* Title & Reset */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <SlidersHorizontal size={20} className="text-primary" />
          Filtres
        </h3>
        <button 
          onClick={reset}
          className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary flex items-center gap-2 transition-all"
        >
          <RotateCcw size={12} /> Réinitialiser
        </button>
      </div>

      {/* Category: Vehicle Type */}
      <div className="space-y-6">
        <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
          <Car size={14} /> Catégorie
        </label>
        <div className="flex flex-col gap-2">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => update("type", t)}
              className={cn(
                "group flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-bold transition-all border",
                filters.type === t
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                  : "bg-white border-slate-100 text-slate-600 hover:border-primary/40 hover:bg-slate-50"
              )}
            >
              {t}
              <div className={cn(
                "w-2 h-2 rounded-full transition-all",
                filters.type === t ? "bg-white" : "bg-slate-200 group-hover:bg-primary/40"
              )} />
            </button>
          ))}
        </div>
      </div>

      {/* Category: Transmission */}
      <div className="space-y-6">
        <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
          <Gauge size={14} /> Transmission
        </label>
        <div className="grid grid-cols-1 gap-2">
          {TRANSMISSIONS.map((t) => (
            <button
              key={t}
              onClick={() => update("transmission", t)}
              className={cn(
                "flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-bold transition-all border",
                filters.transmission === t
                  ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                  : "bg-white border-slate-100 text-slate-600 hover:border-slate-900/40"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Category: Seats */}
      <div className="space-y-6">
        <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
          <Users size={14} /> Places
        </label>
        <div className="flex flex-wrap gap-2">
          {SEATS.map((s) => (
            <button
              key={s}
              onClick={() => update("seats", s)}
              className={cn(
                "w-12 h-12 flex items-center justify-center rounded-xl text-sm font-black border transition-all",
                filters.seats === s
                  ? "bg-primary text-white border-primary"
                  : "bg-white border-slate-100 text-slate-400 hover:border-primary/40"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Category: Price Range */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
            <Wallet size={14} /> Prix Max
          </label>
          <span className="text-sm font-black text-slate-900">{filters.maxPrice} DH/j</span>
        </div>
        <div className="relative pt-2">
          <input
            type="range"
            min="200"
            max={MAX_PRICE_VAL}
            step="50"
            value={filters.maxPrice}
            onChange={(e) => update("maxPrice", Number(e.target.value))}
            className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between mt-3">
            <span className="text-[10px] font-bold text-slate-300">200 DH</span>
            <span className="text-[10px] font-bold text-slate-300">3000+ DH</span>
          </div>
        </div>
      </div>
    </div>
  );
}

