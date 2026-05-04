"use client";

import { useState, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useVehicles } from "@/hooks/useApi";
import QuickViewModal from "@/components/QuickViewModal";
import { useTranslation } from "@/hooks/useTranslation";
import { FleetFilterState } from "@/components/FleetFilters";

// Modular Components
import FleetHeader from "@/components/fleet/FleetHeader";
import FleetSidebar from "@/components/fleet/FleetSidebar";
import FleetGrid from "@/components/fleet/FleetGrid";

const PAGE_SIZE = 6;

function FleetContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const startDateParam = searchParams.get("start_date") || undefined;
  const endDateParam = searchParams.get("end_date") || undefined;

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FleetFilterState>({
    type: "All",
    transmission: "All",
    maxPrice: 3000,
    seats: "All",
    lifestyle: "all",
  });
  const [quickViewVehicle, setQuickViewVehicle] = useState<any>(null);

  const { data: apiData, isLoading } = useVehicles({
    page,
    per_page: PAGE_SIZE,
    max_price: filters.maxPrice < 3000 ? filters.maxPrice : undefined,
    type: filters.type !== "All" ? filters.type.toLowerCase() : undefined,
    start_date: startDateParam,
    end_date: endDateParam,
  });

  const filtered = (apiData?.data ?? []).filter((v) => {
    const matchSearch =
      v.brand.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase());
    const matchTrans =
      filters.transmission === "All" ||
      (v as any).transmission === filters.transmission;
    const matchSeats =
      filters.seats === "All" ||
      ((filters.seats === "7+" ? (v as any).seats >= 7 : (v as any).seats === Number(filters.seats)));

    const matchLifestyle = filters.lifestyle === "all" || (function() {
      const m = v.model.toLowerCase();
      const b = v.brand.toLowerCase();
      const t = v.type.toLowerCase();
      const d = (v.description_fr || "").toLowerCase();
      
      if (filters.lifestyle === "business") return t.includes("luxury") || m.includes("mercedes") || b.includes("bmw") || b.includes("audi");
      if (filters.lifestyle === "romance") return t.includes("sport") || t.includes("convertible") || m.includes("cabrio");
      if (filters.lifestyle === "adventure") return t.includes("suv") || b.includes("jeep") || b.includes("range") || b.includes("land") || d.includes("atlas") || d.includes("aventure");
      if (filters.lifestyle === "family") return ((v as any).seats >= 7) || t.includes("suv") || t.includes("van");
      return true;
    })();

    return matchSearch && matchTrans && matchSeats && matchLifestyle;
  });

  const handleFilterChange = useCallback((f: FleetFilterState) => {
    setFilters(f);
    setPage(1);
  }, []);

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
          
          <FleetGrid 
            vehicles={filtered}
            loading={isLoading}
            page={page}
            totalPages={apiData?.last_page ?? 1}
            onPageChange={setPage}
            onQuickView={setQuickViewVehicle}
          />
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
