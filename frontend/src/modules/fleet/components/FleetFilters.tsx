"use client";

import { useState } from "react";
import { Car, Gauge, Users, RotateCcw, Star, MapPin, ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils";
import { motion } from "framer-motion";
import { useTranslation } from "@/shared/hooks/useTranslation";

const MAX_PRICE_VAL = 5000;

export interface FleetFilterState {
  type: string;
  transmission: string;
  maxPrice: number;
  seats: string;
  lifestyle: string;
}

interface FleetFiltersProps {
  filters: FleetFilterState;
  onFilterChange: (key: keyof FleetFilterState, value: string | number) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  className?: string;
}

export default function FleetFilters({ filters, onFilterChange, onReset, hasActiveFilters, className }: FleetFiltersProps) {
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

  const getCategoryLabel = (type: string) => {
    return t(`cat_${type.toLowerCase()}`);
  };

  const getTransmissionLabel = (trans: string) => {
    if (trans === "All") return t("all");
    return t(`trans_${trans.toLowerCase()}`);
  };

  return (
    <div className={cn("flex flex-col gap-0", className)}>
      {/* Lifestyle */}
      <div className="border-b border-[var(--line)] py-5">
        <button
          onClick={() => toggleSection("lifestyle")}
          className="w-full flex items-center justify-between cursor-pointer bg-transparent border-none p-0"
        >
          <span className="text-[14.5px] font-bold text-[var(--navy)]">{t("filter_your_vibe")}</span>
          <ChevronDown
            size={16}
            className={cn("text-[#9297a1] transition-transform duration-300", openSections.lifestyle && "rotate-180")}
          />
        </button>
        {openSections.lifestyle && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 flex flex-col gap-3"
          >
            {LIFESTYLES.map((ls) => {
              const Icon = ls.icon;
              const active = filters.lifestyle === ls.id;
              return (
                <button
                  key={ls.id}
                  onClick={() => onFilterChange("lifestyle", ls.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-semibold transition-all border cursor-pointer",
                    active
                      ? "bg-[var(--gold)] text-white border-[var(--gold)]"
                      : "bg-transparent text-[#3d4249] border-[var(--line)] hover:border-[var(--gold)]/40",
                  )}
                >
                  <Icon size={16} />
                  {ls.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Category */}
      <div className="border-b border-[var(--line)] py-5">
        <button
          onClick={() => toggleSection("type")}
          className="w-full flex items-center justify-between cursor-pointer bg-transparent border-none p-0"
        >
          <span className="text-[14.5px] font-bold text-[var(--navy)]">{t("filter_category")}</span>
          <ChevronDown
            size={16}
            className={cn("text-[#9297a1] transition-transform duration-300", openSections.type && "rotate-180")}
          />
        </button>
        {openSections.type && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 flex flex-col gap-3"
          >
            {TYPES.map((type) => (
              <label key={type} className="check cursor-pointer flex items-center gap-3 px-2 py-1">
                <input
                  type="radio"
                  name="type"
                  checked={filters.type === type}
                  onChange={() => onFilterChange("type", type)}
                  className="accent-[var(--navy)]"
                />
                <span className="text-[13.5px] text-[#3d4249]">{type === "All" ? t("all") : getCategoryLabel(type)}</span>
              </label>
            ))}
          </motion.div>
        )}
      </div>

      {/* Transmission */}
      <div className="border-b border-[var(--line)] py-5">
        <button
          onClick={() => toggleSection("transmission")}
          className="w-full flex items-center justify-between cursor-pointer bg-transparent border-none p-0"
        >
          <span className="text-[14.5px] font-bold text-[var(--navy)]">{t("filter_transmission")}</span>
          <ChevronDown
            size={16}
            className={cn("text-[#9297a1] transition-transform duration-300", openSections.transmission && "rotate-180")}
          />
        </button>
        {openSections.transmission && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 flex flex-col gap-3"
          >
            {TRANSMISSIONS.map((tr) => (
              <label key={tr} className="check cursor-pointer flex items-center gap-3 px-2 py-1">
                <input
                  type="radio"
                  name="transmission"
                  checked={filters.transmission === tr}
                  onChange={() => onFilterChange("transmission", tr)}
                  className="accent-[var(--navy)]"
                />
                <span className="text-[13.5px] text-[#3d4249]">{getTransmissionLabel(tr)}</span>
              </label>
            ))}
          </motion.div>
        )}
      </div>

      {/* Seats */}
      <div className="border-b border-[var(--line)] py-5">
        <button
          onClick={() => toggleSection("seats")}
          className="w-full flex items-center justify-between cursor-pointer bg-transparent border-none p-0"
        >
          <span className="text-[14.5px] font-bold text-[var(--navy)]">{t("filter_capacity")}</span>
          <ChevronDown
            size={16}
            className={cn("text-[#9297a1] transition-transform duration-300", openSections.seats && "rotate-180")}
          />
        </button>
        {openSections.seats && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 flex flex-col gap-3"
          >
            {SEATS.map((s) => (
              <label key={s} className="check cursor-pointer flex items-center gap-3 px-2 py-1">
                <input
                  type="radio"
                  name="seats"
                  checked={filters.seats === s}
                  onChange={() => onFilterChange("seats", s)}
                  className="accent-[var(--navy)]"
                />
                <span className="text-[13.5px] text-[#3d4249]">{s === "All" ? t("all") : `${s} place${s !== "2" ? "s" : ""}`}</span>
              </label>
            ))}
          </motion.div>
        )}
      </div>

      {/* Price Range */}
      <div className="py-5">
        <button
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between cursor-pointer bg-transparent border-none p-0"
        >
          <span className="text-[14.5px] font-bold text-[var(--navy)]">{t("filter_price_max")}</span>
          <ChevronDown
            size={16}
            className={cn("text-[#9297a1] transition-transform duration-300", openSections.price && "rotate-180")}
          />
        </button>
        {openSections.price && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4"
          >
            <div className="price-range">
              <input
                type="range"
                min="200"
                max={MAX_PRICE_VAL}
                step="50"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange("maxPrice", Number(e.target.value))}
                className="w-full accent-[var(--gold)]"
              />
              <div className="price-labels flex justify-between mt-2">
                <span className="text-[12.5px] text-[#5b6472] font-semibold">200 DH</span>
                <span className="text-[12.5px] text-[#5b6472] font-semibold">{filters.maxPrice} DH</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="mt-4 text-[13px] font-semibold text-[var(--gold)] hover:underline cursor-pointer bg-transparent border-none p-0 text-left flex items-center gap-2"
        >
          <RotateCcw size={12} />
          {t("fleet_clear_filters")}
        </button>
      )}
    </div>
  );
}
