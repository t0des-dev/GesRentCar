"use client";

import { useState, Suspense, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/utils";
import {
  Loader2, Search, LayoutGrid, List,
  Car, Gauge, Users, MapPin, Star,
  ChevronDown, SlidersHorizontal, X,
} from "lucide-react";
import QuickViewModal from "@/components/QuickViewModal";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { FleetFilterState } from "@/modules/fleet/components/FleetFilters";
import RecentBookingPopup from "@/components/RecentBookingPopup";
import FleetHeader from "@/modules/fleet/components/FleetHeader";
import FleetGrid from "@/modules/fleet/components/FleetGrid";
import { useFleetData } from "@/modules/fleet/hooks/useFleetData";
import type { Vehicle } from "@/lib/api/vehicles";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_COLUMNS = 3;

function getFleetSettings() {
  if (typeof window === "undefined") return { pageSize: DEFAULT_PAGE_SIZE, columns: DEFAULT_COLUMNS };
  try {
    const raw = localStorage.getItem("vrc_fleet_settings");
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        pageSize: parsed.pageSize || DEFAULT_PAGE_SIZE,
        columns: parsed.columns || DEFAULT_COLUMNS,
      };
    }
  } catch {}
  return { pageSize: DEFAULT_PAGE_SIZE, columns: DEFAULT_COLUMNS };
}

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

function FleetContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const startDateParam = searchParams.get("start_date") || undefined;
  const endDateParam = searchParams.get("end_date") || undefined;
  const lifestyleParam = searchParams.get("lifestyle") || "all";

  const fleetSettings = useMemo(() => getFleetSettings(), []);

  const [textSearch, setTextSearch] = useState("");
  const [sortBy, setSortBy] = useState<"price_asc" | "price_desc" | "year_desc" | "brand_asc">("price_asc");
  const [layoutView, setLayoutView] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<FleetFilterState>({
    type: "All",
    transmission: "All",
    maxPrice: 3000,
    seats: "All",
    lifestyle: lifestyleParam,
  });
  const [quickViewVehicle, setQuickViewVehicle] = useState<Vehicle | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    lifestyle: true,
    type: true,
    transmission: false,
    seats: false,
    price: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const { sorted, isLoading, loadMore, hasMore } = useFleetData({
    pageSize: fleetSettings.pageSize,
    search: textSearch,
    filters,
    sortBy,
    startDate: startDateParam,
    endDate: endDateParam,
  });

  const filteredByText = useMemo(() => {
    if (!textSearch) return sorted;
    const q = textSearch.toLowerCase();
    return sorted.filter(
      (v) => v.brand?.toLowerCase().includes(q) || v.model?.toLowerCase().includes(q),
    );
  }, [sorted, textSearch]);

  const handleFilterChange = useCallback((key: keyof FleetFilterState, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = () => {
    const def = { type: "All", transmission: "All", maxPrice: 3000, seats: "All", lifestyle: "all" };
    setFilters(def);
  };

  const hasActiveFilters =
    filters.type !== "All" || filters.transmission !== "All" || filters.seats !== "All" || filters.lifestyle !== "all" || filters.maxPrice < 3000;

  const sortOptions = [
    { value: "price_asc", label: "Prix: Croissant" },
    { value: "price_desc", label: "Prix: Décroissant" },
    { value: "year_desc", label: "Plus Récents" },
    { value: "brand_asc", label: "Marque (A-Z)" },
  ];

  const sidebarContent = (
    <div className="flex flex-col gap-0">
      {/* Lifestyle */}
      <div className="filter-group border-b border-[var(--line)] py-5">
        <button
          onClick={() => toggleSection("lifestyle")}
          className="w-full flex items-center justify-between cursor-pointer bg-transparent border-none p-0"
        >
          <span className="text-[14.5px] font-bold text-[var(--navy)]">Votre Vibe</span>
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
                  onClick={() => handleFilterChange("lifestyle", ls.id)}
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
      <div className="filter-group border-b border-[var(--line)] py-5">
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
              <label key={type} className="check cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  checked={filters.type === type}
                  onChange={() => handleFilterChange("type", type)}
                  className="accent-[var(--navy)]"
                />
                <span>{type === "All" ? "Tous" : t(`cat_${type.toLowerCase()}`)}</span>
              </label>
            ))}
          </motion.div>
        )}
      </div>

      {/* Transmission */}
      <div className="filter-group border-b border-[var(--line)] py-5">
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
              <label key={tr} className="check cursor-pointer">
                <input
                  type="radio"
                  name="transmission"
                  checked={filters.transmission === tr}
                  onChange={() => handleFilterChange("transmission", tr)}
                  className="accent-[var(--navy)]"
                />
                <span>{tr === "All" ? "Toutes" : t(`trans_${tr.toLowerCase()}`)}</span>
              </label>
            ))}
          </motion.div>
        )}
      </div>

      {/* Seats */}
      <div className="filter-group border-b border-[var(--line)] py-5">
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
              <label key={s} className="check cursor-pointer">
                <input
                  type="radio"
                  name="seats"
                  checked={filters.seats === s}
                  onChange={() => handleFilterChange("seats", s)}
                  className="accent-[var(--navy)]"
                />
                <span>{s === "All" ? "Toutes" : `${s} place${s !== "2" ? "s" : ""}`}</span>
              </label>
            ))}
          </motion.div>
        )}
      </div>

      {/* Price Range */}
      <div className="filter-group py-5">
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
                max={5000}
                step="50"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", Number(e.target.value))}
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
          onClick={resetFilters}
          className="clear-filters mt-4 text-[13px] font-semibold text-[var(--gold)] hover:underline cursor-pointer bg-transparent border-none p-0"
        >
          Réinitialiser les filtres
        </button>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-[var(--warm-white)]">
      <FleetHeader search={textSearch} setSearch={setTextSearch} />

      <div className="fleet-page-main max-w-[var(--container)] mx-auto px-8">
        {/* ── Controls Bar ── */}
        <div className="results-top flex items-center justify-between mb-7 flex-wrap gap-4 pt-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8f98] pointer-events-none" />
              <input
                type="text"
                value={textSearch}
                onChange={(e) => setTextSearch(e.target.value)}
                placeholder="Rechercher marque/modèle..."
                className="pl-9 pr-4 py-3 bg-white border border-[var(--line)] rounded-xl text-[13.5px] font-medium text-[var(--charcoal)] focus:outline-none focus:border-[var(--gold)] transition-all w-56"
              />
            </div>
            <p className="text-[15px] text-[var(--charcoal)]">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  Synchronisation...
                </span>
              ) : (
                <>
                  <b className="text-[var(--navy)]">{filteredByText.length}</b> {t("fleet_count")}
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="hidden md:flex items-center gap-1 bg-white p-1 rounded-lg border border-[var(--line)]">
              <button
                onClick={() => setLayoutView("grid")}
                className={cn(
                  "p-2 rounded-md transition-all",
                  layoutView === "grid" ? "bg-[var(--navy)] text-white" : "text-[#8a8f98] hover:text-[var(--navy)]",
                )}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setLayoutView("list")}
                className={cn(
                  "p-2 rounded-md transition-all",
                  layoutView === "list" ? "bg-[var(--navy)] text-white" : "text-[#8a8f98] hover:text-[var(--navy)]",
                )}
              >
                <List size={16} />
              </button>
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-2">
              <label className="text-[13px] text-[#8a8f98] hidden sm:inline">Trier:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "price_asc" | "price_desc" | "year_desc" | "brand_asc")}
                className="px-4 py-3 rounded-full border border-[var(--line)] bg-white font-[var(--Sora)] text-[13.5px] font-semibold text-[var(--navy)] appearance-none cursor-pointer pr-10"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── Sidebar + Grid Layout ── */}
        <div className="fleet-layout grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-11 items-start">
          {/* Sidebar (desktop) */}
          <aside className="sidebar hidden lg:block sticky top-24">{sidebarContent}</aside>

          {/* Vehicle Grid */}
          <FleetGrid
            vehicles={filteredByText}
            loading={isLoading}
            hasMore={hasMore}
            onLoadMore={loadMore}
            onQuickView={setQuickViewVehicle}
            layoutView={layoutView}
            columns={fleetSettings.columns}
          />
        </div>
      </div>

      {/* Mobile Filter Button */}
      <button
        onClick={() => setMobileFilterOpen(true)}
        className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--navy)] text-white px-7 py-4 rounded-full font-[var(--Sora)] font-semibold text-[14.5px] shadow-[0_14px_30px_-10px_rgba(22,33,62,0.5)] flex items-center gap-2 cursor-pointer border-none"
      >
        <SlidersHorizontal size={18} />
        Filtres
      </button>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-[99]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed left-0 right-0 bottom-0 z-[100] bg-white rounded-t-[20px] p-6 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[17px] font-bold text-[var(--navy)]">Filtres</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="bg-transparent border-none text-[22px] text-[#8a8f98] cursor-pointer p-1"
                >
                  <X size={22} />
                </button>
              </div>
              {sidebarContent}
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full mt-6 py-4 rounded-full bg-[var(--gold)] text-[var(--navy)] font-semibold text-[15px] border-none cursor-pointer"
              >
                Appliquer les filtres
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Quick View Modal */}
      {quickViewVehicle && (
        <QuickViewModal
          vehicle={{
            id: quickViewVehicle.id,
            brand: quickViewVehicle.brand,
            model: quickViewVehicle.model,
            type: quickViewVehicle.type,
            price: quickViewVehicle.price_per_day,
            seats: quickViewVehicle.seats ?? 5,
            fuel: quickViewVehicle.fuel_type || "Diesel",
            transmission: quickViewVehicle.transmission || "Automatic",
            imageUrl: quickViewVehicle.image_url ?? undefined,
          }}
          onClose={() => setQuickViewVehicle(null)}
        />
      )}

      <RecentBookingPopup />
    </main>
  );
}

export default function FleetPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-28 flex justify-center items-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-[var(--gold)]" size={36} />
            <p className="text-[#8a8f98] text-sm font-medium">Chargement de la flotte...</p>
          </div>
        </div>
      }
    >
      <FleetContent />
    </Suspense>
  );
}
