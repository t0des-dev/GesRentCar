"use client";

import { useState, Suspense, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, ArrowUpDown } from "lucide-react";
import QuickViewModal from "@/components/QuickViewModal";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { FleetFilterState } from "@/modules/fleet/components/FleetFilters";
import RecentBookingPopup from "@/components/RecentBookingPopup";
import { LayoutGrid, List } from "lucide-react";

import FleetHeader from "@/modules/fleet/components/FleetHeader";
import FleetSidebar from "@/modules/fleet/components/FleetSidebar";
import FleetGrid from "@/modules/fleet/components/FleetGrid";
import CompareFloatingBar from "@/components/CompareFloatingBar";
import { Filter } from "lucide-react";

// Hooks
import { useFleetData } from "@/modules/fleet/hooks/useFleetData";
import { motion } from "framer-motion";
import { cn } from "@/shared/utils";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_COLUMNS = 4;

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

function FleetContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const startDateParam = searchParams.get("start_date") || undefined;
  const endDateParam = searchParams.get("end_date") || undefined;

  const fleetSettings = useMemo(() => getFleetSettings(), []);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"price_asc" | "price_desc" | "year_desc" | "brand_asc">("price_asc");
  const [layoutView, setLayoutView] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<FleetFilterState>({
    type: "All",
    transmission: "All",
    maxPrice: 3000,
    seats: "All",
    lifestyle: "all",
  });
  const [quickViewVehicle, setQuickViewVehicle] = useState<any>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const {
    sorted, isLoading, loadMore, hasMore
  } = useFleetData({
    pageSize: fleetSettings.pageSize,
    search,
    filters,
    sortBy,
    startDate: startDateParam,
    endDate: endDateParam
  });

  const handleFilterChange = useCallback((f: FleetFilterState) => {
    setFilters(f);
  }, []);

  const sortOptions = [
    { value: "price_asc", label: "Prix: Croissant" },
    { value: "price_desc", label: "Prix: Décroissant" },
    { value: "year_desc", label: "Plus Récents" },
    { value: "brand_asc", label: "Marque (A-Z)" },
  ];

  return (
    <main className="min-h-screen pt-36 pb-24 bg-surface-0 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-primary/5 pointer-events-none" />
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <FleetHeader search={search} setSearch={(val) => { setSearch(val); }} />
        </motion.div>

        {/* Main Content — Sidebar + Grid */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left Sidebar (Drawer on Mobile, Sidebar on Desktop) */}
          <div className={cn(
            "fixed inset-0 z-50 lg:static lg:block lg:z-auto transition-transform duration-300",
            isMobileFiltersOpen ? "translate-y-0" : "translate-y-full lg:translate-y-0"
          )}>
            {/* Overlay for mobile */}
            {isMobileFiltersOpen && (
              <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm lg:hidden"
                onClick={() => setIsMobileFiltersOpen(false)}
              />
            )}
            
            <div className="absolute bottom-0 left-0 right-0 h-[85vh] bg-white rounded-t-3xl overflow-y-auto lg:h-auto lg:bg-transparent lg:static lg:rounded-none overflow-hidden pb-24 lg:pb-0 shadow-2xl lg:shadow-none">
              <div className="sticky top-0 bg-white/90 backdrop-blur-md z-10 p-4 border-b border-slate-100 flex justify-center lg:hidden">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
              </div>
              <div className="p-6 lg:p-0">
                <FleetSidebar onFilter={handleFilterChange} />
              </div>
            </div>
          </div>
          
          {/* Right Content */}
          <div className="flex-1 min-w-0">
            
            {/* Controls Bar */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="sticky top-24 z-30 flex items-center justify-between mb-8 pb-4 pt-4 border-b border-border flex-wrap gap-4 bg-white/70 backdrop-blur-xl rounded-t-2xl px-4 -mx-4 sm:mx-0 shadow-[0_4px_30px_rgba(0,0,0,0.02)]"
            >
              <div className="flex items-center gap-3">
                <p className="text-xs font-bold uppercase tracking-widest text-ink-3">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin" />
                      Synchronisation...
                    </span>
                  ) : (
                    `${sorted.length} ${t("fleet_count")}`
                  )}
                </p>
              </div>

              <div className="flex items-center gap-6">
                {/* View Toggle */}
                <div className="hidden md:flex items-center gap-1 bg-surface-1 p-1 rounded-lg border border-border">
                  <button
                    onClick={() => setLayoutView("grid")}
                    className={cn("p-1.5 rounded-md transition-all", layoutView === "grid" ? "bg-white text-primary shadow-sm" : "text-ink-3 hover:text-ink-1")}
                    aria-label="Vue Grille"
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    onClick={() => setLayoutView("list")}
                    className={cn("p-1.5 rounded-md transition-all", layoutView === "list" ? "bg-white text-primary shadow-sm" : "text-ink-3 hover:text-ink-1")}
                    aria-label="Vue Liste"
                  >
                    <List size={16} />
                  </button>
                </div>

                {/* Sorting Dropdown */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-ink-3 hidden sm:inline">Trier:</span>
                  <div className="relative group">
                    <select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="appearance-none bg-white border-2 border-border rounded-lg px-4 py-2.5 text-xs font-bold text-ink-1 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all cursor-pointer pr-9"
                    >
                      {sortOptions.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-white text-ink-1">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ArrowUpDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gold pointer-events-none" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Fleet Grid */}
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

      {/* Compare Floating Bar */}
      <CompareFloatingBar />

      {/* Mobile Filters Toggle Button */}
      <div className="fixed bottom-6 right-6 z-40 lg:hidden">
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3.5 rounded-full shadow-2xl shadow-slate-900/20 font-bold tracking-wide"
        >
          <Filter size={18} />
          Filtres
        </button>
      </div>

      {/* Quick View Modal */}
      {quickViewVehicle && (
        <QuickViewModal 
          vehicle={quickViewVehicle} 
          onClose={() => setQuickViewVehicle(null)} 
        />
      )}

      {/* Social Proof */}
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
          <p className="text-ink-3 text-sm font-medium">Chargement de la flotte...</p>
        </div>
      </div>
    }>
      <FleetContent />
    </Suspense>
  );
}
