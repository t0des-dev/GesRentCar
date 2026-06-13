"use client";

import { useState, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, ArrowUpDown } from "lucide-react";
import QuickViewModal from "@/components/QuickViewModal";
import { useTranslation } from "@/hooks/useTranslation";
import { FleetFilterState } from "@/components/FleetFilters";

// Modular Components
import FleetHeader from "@/components/fleet/FleetHeader";
import FleetSidebar from "@/components/fleet/FleetSidebar";
import FleetGrid from "@/components/fleet/FleetGrid";

// Hooks
import { useFleetData } from "@/hooks/useFleetData";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 6;

function FleetContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const startDateParam = searchParams.get("start_date") || undefined;
  const endDateParam = searchParams.get("end_date") || undefined;

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"price_asc" | "price_desc" | "year_desc" | "brand_asc">("price_asc");
  const [filters, setFilters] = useState<FleetFilterState>({
    type: "All",
    transmission: "All",
    maxPrice: 3000,
    seats: "All",
    lifestyle: "all",
  });
  const [quickViewVehicle, setQuickViewVehicle] = useState<any>(null);

  const {
    sorted, isLoading, page, setPage, totalPages
  } = useFleetData({
    pageSize: PAGE_SIZE,
    search,
    filters,
    sortBy,
    startDate: startDateParam,
    endDate: endDateParam
  });

  const handleFilterChange = useCallback((f: FleetFilterState) => {
    setFilters(f);
    setPage(1);
  }, [setPage]);

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
          <FleetHeader search={search} setSearch={(val) => { setSearch(val); setPage(1); }} />
        </motion.div>

        {/* Main Content — Sidebar + Grid */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left Sidebar */}
          <FleetSidebar onFilter={handleFilterChange} />
          
          {/* Right Content */}
          <div className="flex-1 min-w-0">
            
            {/* Controls Bar */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex items-center justify-between mb-12 pb-6 border-b border-border"
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
            </motion.div>

            {/* Fleet Grid */}
            <FleetGrid 
              vehicles={sorted}
              loading={isLoading}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              onQuickView={setQuickViewVehicle}
            />
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewVehicle && (
        <QuickViewModal 
          vehicle={quickViewVehicle} 
          onClose={() => setQuickViewVehicle(null)} 
        />
      )}
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
