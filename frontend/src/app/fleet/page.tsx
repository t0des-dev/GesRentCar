"use client";

import { useState, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import QuickViewModal from "@/components/QuickViewModal";
import { useTranslation } from "@/hooks/useTranslation";
import { FleetFilterState } from "@/components/FleetFilters";

// Modular Components
import FleetHeader from "@/components/fleet/FleetHeader";
import FleetSidebar from "@/components/fleet/FleetSidebar";
import FleetGrid from "@/components/fleet/FleetGrid";

// Hooks
import { useFleetData } from "@/hooks/useFleetData";

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

  return (
    <main className="min-h-screen pt-32 pb-24 bg-background relative selection:bg-primary/20 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-[1000px] pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <FleetHeader search={search} setSearch={(val) => { setSearch(val); setPage(1); }} />

        <div className="flex flex-col lg:flex-row gap-20">
          <FleetSidebar onFilter={handleFilterChange} />
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  {isLoading ? "Synchronisation en cours..." : `${sorted.length} ${t("fleet_count")}`}
                </p>
              </div>

              {/* Advanced Sorting */}
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trier par:</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer"
                >
                  <option value="price_asc" className="bg-slate-900">Prix: Croissant</option>
                  <option value="price_desc" className="bg-slate-900">Prix: Décroissant</option>
                  <option value="year_desc" className="bg-slate-900">Plus Récents</option>
                  <option value="brand_asc" className="bg-slate-900">Marque (A-Z)</option>
                </select>
              </div>
            </div>

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
    <Suspense fallback={<div className="min-h-screen pt-28 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>}>
      <FleetContent />
    </Suspense>
  );
}
