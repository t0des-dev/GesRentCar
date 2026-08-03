"use client";

import { useState, Suspense, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, ArrowUpDown, ChevronDown, ChevronRight, RotateCcw } from "lucide-react";
import QuickViewModal from "@/components/QuickViewModal";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { FleetFilterState } from "@/modules/fleet/components/FleetFilters";
import RecentBookingPopup from "@/components/RecentBookingPopup";
import { LayoutGrid, List } from "lucide-react";
import { useAgency } from "@/hooks/useAgency";

import FleetHeader from "@/modules/fleet/components/FleetHeader";
import FleetGrid from "@/modules/fleet/components/FleetGrid";

import { useFleetData } from "@/modules/fleet/hooks/useFleetData";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/utils";

const DEFAULT_PAGE_SIZE = 12;
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

const CATEGORIES = [
  { id: "All", label: "All" },
  { id: "Economy", label: "Economy" },
  { id: "Compact", label: "Compact" },
  { id: "SUV", label: "SUV" },
  { id: "Luxury", label: "Luxury" },
  { id: "Sport", label: "Sport" },
  { id: "Sedan", label: "Sedan" },
];
const TRANSMISSIONS = [
  { id: "All", label: "All" },
  { id: "Automatic", label: "Automatic" },
  { id: "Manual", label: "Manual" },
];
const FUEL_TYPES = [
  { id: "All", label: "All" },
  { id: "Essence", label: "Essence" },
  { id: "Diesel", label: "Diesel" },
  { id: "Hybride", label: "Hybrid" },
  { id: "Électrique", label: "Electric" },
];
const SEATS = [
  { id: "All", label: "All" },
  { id: "2", label: "2" },
  { id: "4", label: "4" },
  { id: "5", label: "5" },
  { id: "7+", label: "7+" },
];

function FilterSection({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left cursor-pointer group"
      >
        <span className="text-sm font-bold text-slate-800 tracking-tight">{title}</span>
        <ChevronDown
          size={16}
          className={cn(
            "text-slate-400 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-4 space-y-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckboxItem({ label, count, checked, onChange }: { label: string; count?: number; checked: boolean; onChange: () => void }) {
  return (
    <label
      className="flex items-center justify-between py-1.5 px-2 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors group"
      onClick={onChange}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center transition-all duration-200",
            checked
              ? "bg-[#16213E] border-[#16213E]"
              : "border-slate-300 group-hover:border-slate-400"
          )}
        >
          {checked && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <span className={cn("text-[13px] font-medium transition-colors", checked ? "text-slate-900" : "text-slate-600")}>
          {label}
        </span>
      </div>
      {count !== undefined && (
        <span className="text-[12px] text-slate-400 font-medium">{count}</span>
      )}
    </label>
  );
}

function FleetSidebar({
  filters,
  onFilterChange,
  onReset,
  vehicleCounts,
  fleetConfig,
}: {
  filters: FleetFilterState;
  onFilterChange: (key: keyof FleetFilterState, value: any) => void;
  onReset: () => void;
  vehicleCounts: Record<string, number>;
  fleetConfig?: Record<string, any>;
}) {
  const showCategory = fleetConfig?.show_category_filter !== false;
  const showTransmission = fleetConfig?.show_transmission_filter !== false;
  const showFuel = fleetConfig?.show_fuel_filter !== false;
  const showSeats = fleetConfig?.show_seats_filter !== false;
  const showPrice = fleetConfig?.show_price_filter !== false;

  return (
    <aside className="w-full lg:w-[280px] shrink-0">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sticky top-28">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-bold text-slate-900">Filtres</h3>
          {(filters.type !== "All" || filters.transmission !== "All" || filters.seats !== "All" || filters.fuelType !== "All" || filters.maxPrice < 3000) && (
            <button
              onClick={onReset}
              className="text-[11px] font-semibold text-red-500 hover:text-red-600 transition-colors"
            >
              Réinitialiser
            </button>
          )}
        </div>

        {showCategory && (
          <FilterSection title="Catégorie" defaultOpen={true}>
            {CATEGORIES.map((cat) => (
              <CheckboxItem
                key={cat.id}
                label={cat.label}
                count={vehicleCounts[`cat_${cat.id}`]}
                checked={filters.type === cat.id}
                onChange={() => onFilterChange("type", cat.id)}
              />
            ))}
          </FilterSection>
        )}

        {showTransmission && (
          <FilterSection title="Transmission" defaultOpen={false}>
            {TRANSMISSIONS.map((tr) => (
              <CheckboxItem
                key={tr.id}
                label={tr.label}
                count={vehicleCounts[`tr_${tr.id}`]}
                checked={filters.transmission === tr.id}
                onChange={() => onFilterChange("transmission", tr.id)}
              />
            ))}
          </FilterSection>
        )}

        {showFuel && (
          <FilterSection title="Carburant" defaultOpen={false}>
            {FUEL_TYPES.map((f) => (
              <CheckboxItem
                key={f.id}
                label={f.label}
                count={vehicleCounts[`fuel_${f.id}`]}
                checked={filters.fuelType === f.id}
                onChange={() => onFilterChange("fuelType", f.id)}
              />
            ))}
          </FilterSection>
        )}

        {showSeats && (
          <FilterSection title="Nombre de places" defaultOpen={false}>
            {SEATS.map((s) => (
              <CheckboxItem
                key={s.id}
                label={s.id === "All" ? "Tous" : `${s.id} places`}
                count={vehicleCounts[`seats_${s.id}`]}
                checked={filters.seats === s.id}
                onChange={() => onFilterChange("seats", s.id)}
              />
            ))}
          </FilterSection>
        )}

        {showPrice && (
          <FilterSection title="Prix / Jour" defaultOpen={true}>
            <div className="px-2 pt-2">
              <input
                type="range"
                min={200}
                max={5000}
                step={50}
                value={filters.maxPrice}
                onChange={(e) => onFilterChange("maxPrice", Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#16213E]"
              />
              <div className="flex justify-between mt-3">
                <span className="text-[12px] font-semibold text-slate-500">200 MAD</span>
                <span className="text-[12px] font-semibold text-slate-500">{filters.maxPrice.toLocaleString()} MAD</span>
              </div>
            </div>
          </FilterSection>
        )}
      </div>
    </aside>
  );
}

function FleetContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const startDateParam = searchParams.get("start_date") || undefined;
  const endDateParam = searchParams.get("end_date") || undefined;
  const agency = useAgency();
  const fleetConfig = agency?.sections_content?.fleet || {};

  const fleetSettings = useMemo(() => getFleetSettings(), []);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"price_asc" | "price_desc" | "year_desc" | "brand_asc">(
    (fleetConfig.default_sort as any) || "price_asc"
  );
  const [layoutView, setLayoutView] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<FleetFilterState>({
    type: "All",
    transmission: "All",
    maxPrice: 3000,
    seats: "All",
    lifestyle: "all",
    fuelType: "All",
    yearRange: "All",
  });
  const [quickViewVehicle, setQuickViewVehicle] = useState<any>(null);

  const {
    sorted, isLoading, loadMore, hasMore
  } = useFleetData({
    pageSize: Number(fleetConfig.page_size) || fleetSettings.pageSize,
    search,
    filters,
    sortBy,
    startDate: startDateParam,
    endDate: endDateParam
  });

  const handleFilterChange = useCallback((key: keyof FleetFilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = () => {
    setFilters({ type: "All", transmission: "All", maxPrice: 3000, seats: "All", lifestyle: "all", fuelType: "All", yearRange: "All" });
  };

  const handleBookingSearch = useCallback((params: {
    location: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
  }) => {
    const query = new URLSearchParams();
    if (params.location) query.set("location", params.location);
    if (params.startDate) query.set("start_date", params.startDate);
    if (params.endDate) query.set("end_date", params.endDate);
    if (params.startTime) query.set("start_time", params.startTime);
    if (params.endTime) query.set("end_time", params.endTime);
    router.push(`/fleet?${query.toString()}`);
  }, [router]);

  const vehicleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    return counts;
  }, []);

  const sortOptions = [
    { value: "price_asc", label: "Prix: Croissant" },
    { value: "price_desc", label: "Prix: Décroissant" },
    { value: "year_desc", label: "Plus Récents" },
    { value: "brand_asc", label: "Marque (A-Z)" },
  ];

  return (
    <main className="min-h-screen pb-24 bg-surface-0 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-primary/5 pointer-events-none" />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <FleetHeader search={search} setSearch={setSearch} fleetConfig={fleetConfig} onBookingSearch={handleBookingSearch} />
      </motion.div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10 mt-8">
        {/* Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center justify-between mb-6 flex-wrap gap-4"
        >
          <p className="text-sm font-semibold text-slate-500">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                Chargement...
              </span>
            ) : (
              <span><span className="text-slate-900 font-bold">{sorted.length}</span> Véhicules trouvés</span>
            )}
          </p>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-100">
              <button
                onClick={() => setLayoutView("grid")}
                className={cn("p-1.5 rounded-md transition-all", layoutView === "grid" ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-600")}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setLayoutView("list")}
                className={cn("p-1.5 rounded-md transition-all", layoutView === "list" ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-600")}
              >
                <List size={16} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Trier par:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-slate-400 transition-all cursor-pointer pr-8"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Sidebar + Grid Layout */}
        <div className="flex gap-8">
          <FleetSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
            vehicleCounts={vehicleCounts}
            fleetConfig={fleetConfig}
          />

          <div className="flex-1 min-w-0">
            <FleetGrid
              vehicles={sorted}
              loading={isLoading}
              hasMore={hasMore}
              onLoadMore={loadMore}
              onQuickView={setQuickViewVehicle}
              layoutView={layoutView}
              columns={fleetSettings.columns}
            />
          </div>
        </div>
      </div>

      {quickViewVehicle && (
        <QuickViewModal vehicle={quickViewVehicle} onClose={() => setQuickViewVehicle(null)} />
      )}

      <RecentBookingPopup />
    </main>
  );
}

export default function FleetPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-28 flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-gold" size={36} />
          <p className="text-slate-400 text-sm font-medium">Chargement de la flotte...</p>
        </div>
      </div>
    }>
      <FleetContent />
    </Suspense>
  );
}
