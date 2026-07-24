"use client";

import { useState } from "react";
import { RotateCcw, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/shared/utils";
import { motion, AnimatePresence } from "framer-motion";
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

const AVAILABILITY_OPTIONS = [
  { id: "available_today", label: "Available Today" },
  { id: "airport_delivery", label: "Airport Delivery" },
  { id: "instant_booking", label: "Instant Booking" },
  { id: "unlimited_mileage", label: "Unlimited Mileage" },
];

const CATEGORIES = [
  { id: "Economy", label: "Economy", count: 10 },
  { id: "Compact", label: "Compact", count: 15 },
  { id: "SUV", label: "SUV", count: 10 },
  { id: "Luxury", label: "Luxury", count: 8 },
  { id: "Utility", label: "Utility", count: 6 },
  { id: "Electric", label: "Electric", count: 4 },
  { id: "Hybrid", label: "Hybrid", count: 5 },
];

const BRANDS = ["Mercedes-Benz", "BMW", "Audi", "Porsche", "Range Rover", "Jeep", "Toyota", "Renault", "Hyundai", "Kia"];
const TRANSMISSIONS = ["Automatic", "Manual"];
const FUELS = ["Diesel", "Petrol", "Electric", "Hybrid"];
const SEATS_OPTIONS = ["2", "4", "5", "7+"];

export default function FleetFilters({ filters, onFilterChange, onReset, hasActiveFilters, className }: FleetFiltersProps) {
  const { t } = useTranslation();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    availability: true,
    category: true,
    brand: false,
    transmission: false,
    fuel: false,
    seats: false,
    price: true,
    features: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Availability */}
      <FilterSection
        title="Availability"
        isOpen={openSections.availability}
        onToggle={() => toggleSection("availability")}
      >
        <div className="flex flex-col gap-3">
          {AVAILABILITY_OPTIONS.map((opt) => (
            <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
              <div className={cn(
                "w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-all",
                filters.lifestyle === opt.id
                  ? "bg-[var(--navy)] border-[var(--navy)]"
                  : "border-gray-300 group-hover:border-gray-400"
              )}>
                {filters.lifestyle === opt.id && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                checked={filters.lifestyle === opt.id}
                onChange={() => onFilterChange("lifestyle", filters.lifestyle === opt.id ? "all" : opt.id)}
                className="sr-only"
              />
              <span className="text-[13px] text-gray-600 group-hover:text-gray-900 transition-colors">{opt.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Category */}
      <FilterSection
        title="Category"
        isOpen={openSections.category}
        onToggle={() => toggleSection("category")}
      >
        <div className="flex flex-col gap-3">
          {CATEGORIES.map((cat) => (
            <label key={cat.id} className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-all",
                  filters.type === cat.id
                    ? "bg-[var(--navy)] border-[var(--navy)]"
                    : "border-gray-300 group-hover:border-gray-400"
                )}>
                  {filters.type === cat.id && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <input
                  type="checkbox"
                  checked={filters.type === cat.id}
                  onChange={() => onFilterChange("type", filters.type === cat.id ? "All" : cat.id)}
                  className="sr-only"
                />
                <span className="text-[13px] text-gray-600 group-hover:text-gray-900 transition-colors">{cat.label}</span>
              </div>
              <span className="text-[12px] text-gray-400 font-medium">{cat.count}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection
        title="Brand"
        isOpen={openSections.brand}
        onToggle={() => toggleSection("brand")}
      >
        <div className="flex flex-col gap-3">
          {BRANDS.map((brand) => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
              <div className="w-[18px] h-[18px] rounded border-2 border-gray-300 group-hover:border-gray-400 flex items-center justify-center transition-all">
              </div>
              <span className="text-[13px] text-gray-600 group-hover:text-gray-900 transition-colors">{brand}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Transmission */}
      <FilterSection
        title="Transmission"
        isOpen={openSections.transmission}
        onToggle={() => toggleSection("transmission")}
      >
        <div className="flex flex-col gap-3">
          {TRANSMISSIONS.map((tr) => (
            <label key={tr} className="flex items-center gap-3 cursor-pointer group">
              <div className={cn(
                "w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-all",
                filters.transmission === tr
                  ? "bg-[var(--navy)] border-[var(--navy)]"
                  : "border-gray-300 group-hover:border-gray-400"
              )}>
                {filters.transmission === tr && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                checked={filters.transmission === tr}
                onChange={() => onFilterChange("transmission", filters.transmission === tr ? "All" : tr)}
                className="sr-only"
              />
              <span className="text-[13px] text-gray-600 group-hover:text-gray-900 transition-colors">{tr}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Fuel */}
      <FilterSection
        title="Fuel"
        isOpen={openSections.fuel}
        onToggle={() => toggleSection("fuel")}
      >
        <div className="flex flex-col gap-3">
          {FUELS.map((fuel) => (
            <label key={fuel} className="flex items-center gap-3 cursor-pointer group">
              <div className="w-[18px] h-[18px] rounded border-2 border-gray-300 group-hover:border-gray-400 flex items-center justify-center transition-all">
              </div>
              <span className="text-[13px] text-gray-600 group-hover:text-gray-900 transition-colors">{fuel}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Seats */}
      <FilterSection
        title="Seats"
        isOpen={openSections.seats}
        onToggle={() => toggleSection("seats")}
      >
        <div className="flex flex-col gap-3">
          {SEATS_OPTIONS.map((s) => (
            <label key={s} className="flex items-center gap-3 cursor-pointer group">
              <div className={cn(
                "w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-all",
                filters.seats === s
                  ? "bg-[var(--navy)] border-[var(--navy)]"
                  : "border-gray-300 group-hover:border-gray-400"
              )}>
                {filters.seats === s && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                checked={filters.seats === s}
                onChange={() => onFilterChange("seats", filters.seats === s ? "All" : s)}
                className="sr-only"
              />
              <span className="text-[13px] text-gray-600 group-hover:text-gray-900 transition-colors">{s} seats</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price / Day */}
      <FilterSection
        title="Price / Day"
        isOpen={openSections.price}
        onToggle={() => toggleSection("price")}
      >
        <div className="px-1">
          <input
            type="range"
            min="200"
            max={MAX_PRICE_VAL}
            step="50"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange("maxPrice", Number(e.target.value))}
            className="w-full accent-[var(--gold)] h-1"
          />
          <div className="flex justify-between mt-3">
            <span className="text-[12px] text-gray-500 font-medium">300 MAD</span>
            <span className="text-[12px] text-gray-500 font-medium">2,500 MAD</span>
          </div>
        </div>
      </FilterSection>

      {/* Vehicle Features */}
      <FilterSection
        title="Vehicle Features"
        isOpen={openSections.features}
        onToggle={() => toggleSection("features")}
      >
        <div className="flex flex-col gap-3">
          {["GPS Navigation", "Bluetooth", "Sunroof", "Leather Seats", "Backup Camera"].map((feat) => (
            <label key={feat} className="flex items-center gap-3 cursor-pointer group">
              <div className="w-[18px] h-[18px] rounded border-2 border-gray-300 group-hover:border-gray-400 flex items-center justify-center transition-all">
              </div>
              <span className="text-[13px] text-gray-600 group-hover:text-gray-900 transition-colors">{feat}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="mt-2 text-[13px] font-semibold text-[var(--gold)] hover:text-[var(--gold-dark)] cursor-pointer bg-transparent border-none p-0 text-left flex items-center gap-2 transition-colors"
        >
          <RotateCcw size={12} />
          Reset all filters
        </button>
      )}
    </div>
  );
}

function FilterSection({ title, isOpen, onToggle, children }: { title: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 cursor-pointer bg-transparent border-none p-0 px-1"
      >
        <span className="text-[14px] font-bold text-gray-900">{title}</span>
        <ChevronRight
          size={16}
          className={cn("text-gray-400 transition-transform duration-200", isOpen && "rotate-90")}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-4 px-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
