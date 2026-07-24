"use client";

import { useState, Suspense, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/utils";
import {
  Loader2, SlidersHorizontal, X,
} from "lucide-react";
import QuickViewModal from "@/components/QuickViewModal";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { FleetFilterState } from "@/modules/fleet/components/FleetFilters";
import RecentBookingPopup from "@/components/RecentBookingPopup";
import FleetHeader from "@/modules/fleet/components/FleetHeader";
import FleetGrid from "@/modules/fleet/components/FleetGrid";
import FleetSidebar from "@/modules/fleet/components/FleetSidebar";
import FleetFilters from "@/modules/fleet/components/FleetFilters";
import { useFleetData } from "@/modules/fleet/hooks/useFleetData";
import { useStorefront } from "@/hooks/useStorefront";
import type { Vehicle } from "@/lib/api/vehicles";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_COLUMNS = 3;

function FleetContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { sections_content } = useStorefront();
  const fleetConfig = sections_content?.fleet;

  const pageSize = fleetConfig?.page_size || DEFAULT_PAGE_SIZE;
  const columns = fleetConfig?.columns || DEFAULT_COLUMNS;

  const startDateParam = searchParams.get("start_date") || undefined;
  const endDateParam = searchParams.get("end_date") || undefined;
  const startTimeParam = searchParams.get("start_time") || undefined;
  const locationParam = searchParams.get("location") || undefined;
  const lifestyleParam = searchParams.get("lifestyle") || "all";
  const typeParam = searchParams.get("type") || "All";
  const transmissionParam = searchParams.get("transmission") || "All";
  const seatsParam = searchParams.get("seats") || "All";
  const maxPriceParam = searchParams.get("max_price") ? Number(searchParams.get("max_price")) : 3000;
  const sortParam = searchParams.get("sort") || "recommended";

  const [textSearch, setTextSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>(sortParam);
  const [layoutView, setLayoutView] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<FleetFilterState>({
    type: typeParam,
    transmission: transmissionParam,
    maxPrice: maxPriceParam,
    seats: seatsParam,
    lifestyle: lifestyleParam,
  });
  const [quickViewVehicle, setQuickViewVehicle] = useState<Vehicle | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const handleHeaderSearch = useCallback((params: { startDate: string; endDate: string; startTime: string; location: string }) => {
    const p = new URLSearchParams(searchParams.toString());
    if (params.startDate) p.set("start_date", params.startDate);
    else p.delete("start_date");
    if (params.endDate) p.set("end_date", params.endDate);
    else p.delete("end_date");
    if (params.startTime && params.startTime !== "10:00") p.set("start_time", params.startTime);
    else p.delete("start_time");
    if (params.location && params.location !== "Casablanca — Mohammed V Airport") p.set("location", params.location);
    else p.delete("location");
    router.push(`?${p.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const updateURLParams = useCallback((newFilters: FleetFilterState, newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newFilters.type !== "All") params.set("type", newFilters.type);
    else params.delete("type");
    if (newFilters.transmission !== "All") params.set("transmission", newFilters.transmission);
    else params.delete("transmission");
    if (newFilters.seats !== "All") params.set("seats", newFilters.seats);
    else params.delete("seats");
    if (newFilters.lifestyle !== "all") params.set("lifestyle", newFilters.lifestyle);
    else params.delete("lifestyle");
    if (newFilters.maxPrice < 3000) params.set("max_price", String(newFilters.maxPrice));
    else params.delete("max_price");
    if (newSort !== "recommended") params.set("sort", newSort);
    else params.delete("sort");
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const { sorted, isLoading, loadMore, hasMore } = useFleetData({
    pageSize: pageSize,
    search: textSearch,
    filters,
    sortBy,
    startDate: startDateParam,
    endDate: endDateParam,
  });

  const handleFilterChange = useCallback((key: keyof FleetFilterState, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    updateURLParams(filters, sortBy);
  }, [filters, sortBy, updateURLParams]);

  const resetFilters = useCallback(() => {
    setFilters({ type: "All", transmission: "All", maxPrice: 3000, seats: "All", lifestyle: "all" });
    setSortBy("recommended");
  }, []);

  const hasActiveFilters =
    filters.type !== "All" || filters.transmission !== "All" || filters.seats !== "All" || filters.lifestyle !== "all" || filters.maxPrice < 3000;

  const sortOptions = [
    { value: "recommended", label: "Recommended" },
    { value: "price_asc", label: t("sort_price_asc") },
    { value: "price_desc", label: t("sort_price_desc") },
    { value: "year_desc", label: t("sort_year_desc") },
    { value: "brand_asc", label: t("sort_brand_asc") },
  ];

  return (
    <main className="min-h-screen bg-[var(--warm-white)]">
      <FleetHeader
        search={textSearch}
        setSearch={setTextSearch}
        startDate={startDateParam}
        endDate={endDateParam}
        startTime={startTimeParam}
        location={locationParam}
        config={fleetConfig}
        onSearch={handleHeaderSearch}
      />

      <div className="max-w-[var(--container)] mx-auto px-4 sm:px-6 lg:px-10 pt-14 pb-20">
        {/* ── Controls Bar ── */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <p className="text-[15px] text-gray-600 font-medium">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-gray-400" />
                {t("fleet_sync")}
              </span>
            ) : (
              <>
                <span className="text-gray-900 font-bold">{sorted.length}</span> {fleetConfig?.results_text || "Vehicles Found"}
              </>
            )}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-[13px] text-gray-500 font-medium">{fleetConfig?.sort_label || "Sort by:"}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-[13px] font-semibold text-gray-900 cursor-pointer focus:outline-none focus:border-gray-400 transition-colors"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Sidebar + Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 items-start">
          {/* Sidebar */}
          <FleetSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Grid */}
          <FleetGrid
            vehicles={sorted}
            loading={isLoading}
            hasMore={hasMore}
            onLoadMore={loadMore}
            onQuickView={setQuickViewVehicle}
            layoutView={layoutView}
            columns={columns}
          />
        </div>
      </div>

      {/* Mobile Filter Button */}
      <button
        onClick={() => setMobileFilterOpen(true)}
        className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--navy)] text-white px-7 py-4 rounded-full font-semibold text-[14px] shadow-[0_14px_30px_-10px_rgba(22,33,62,0.5)] flex items-center gap-2 cursor-pointer border-none"
      >
        <SlidersHorizontal size={18} />
        {t("fleet_filters")}
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
                <h3 className="text-[17px] font-bold text-gray-900">{t("fleet_filters")}</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="bg-transparent border-none text-[22px] text-gray-400 cursor-pointer p-1"
                >
                  <X size={22} />
                </button>
              </div>
              <FleetFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={resetFilters}
                hasActiveFilters={hasActiveFilters}
              />
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full mt-6 py-4 rounded-full bg-[var(--gold)] text-white font-semibold text-[15px] border-none cursor-pointer"
              >
                {t("fleet_apply_filters")}
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
            <p className="text-gray-400 text-sm font-medium">Chargement de la flotte...</p>
          </div>
        </div>
      }
    >
      <FleetContent />
    </Suspense>
  );
}
