"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import VehicleCard from "@/components/VehicleCard";
import FleetFilters, { FleetFilterState } from "@/components/FleetFilters";
import { ChevronLeft, ChevronRight, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { useVehicles } from "@/hooks/useApi";
import QuickViewModal from "@/components/QuickViewModal";

const VEHICLES = [
  { id: 1, brand: "Mercedes", model: "Class C 220d", type: "Sedan", price: 850, seats: 5, fuel: "Diesel", transmission: "Automatic", rating: 4.9 },
  { id: 2, brand: "BMW", model: "X5 xDrive40i", type: "SUV", price: 1200, seats: 7, fuel: "Petrol", transmission: "Automatic", rating: 4.8 },
  { id: 3, brand: "Porsche", model: "Panamera GTS", type: "Luxury", price: 2500, seats: 4, fuel: "Petrol", transmission: "Automatic", rating: 5.0 },
  { id: 4, brand: "Volkswagen", model: "Golf 8 GTI", type: "Compact", price: 450, seats: 5, fuel: "Petrol", transmission: "Manual", rating: 4.7 },
  { id: 5, brand: "Audi", model: "RS5 Coupé", type: "Sport", price: 1800, seats: 4, fuel: "Petrol", transmission: "Automatic", rating: 4.9 },
  { id: 6, brand: "Dacia", model: "Logan 1.5 dCi", type: "Compact", price: 200, seats: 5, fuel: "Diesel", transmission: "Manual", rating: 4.3 },
  { id: 7, brand: "Toyota", model: "Land Cruiser 300", type: "SUV", price: 1500, seats: 7, fuel: "Diesel", transmission: "Automatic", rating: 4.8 },
  { id: 8, brand: "Hyundai", model: "Tucson Hybrid", type: "SUV", price: 600, seats: 5, fuel: "Hybrid", transmission: "Automatic", rating: 4.6 },
  { id: 9, brand: "Ferrari", model: "Roma Coupé", type: "Sport", price: 3000, seats: 2, fuel: "Petrol", transmission: "Automatic", rating: 5.0 },
];

const PAGE_SIZE = 6;

function FleetContent() {
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
  });
  const [quickViewVehicle, setQuickViewVehicle] = useState<any>(null);

  const { data: apiData, isLoading, isError } = useVehicles({
    page,
    per_page: PAGE_SIZE,
    max_price: filters.maxPrice < 3000 ? filters.maxPrice : undefined,
    type: filters.type !== "All" ? filters.type.toLowerCase() : undefined,
    start_date: startDateParam,
    end_date: endDateParam,
  });

  const allVehicles = apiData?.data ?? [];
  const filtered = allVehicles.filter((v) => {
    const matchSearch =
      v.brand.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase());
    const matchTrans =
      filters.transmission === "All" ||
      (v as any).transmission === filters.transmission;
    const matchSeats =
      filters.seats === "All" ||
      ((filters.seats === "7+" ? (v as any).seats >= 7 : (v as any).seats === Number(filters.seats)));
    return matchSearch && matchTrans && matchSeats;
  });

  const totalPages = apiData?.last_page ?? 1;

  return (
    <main className="min-h-screen pt-32 pb-24 bg-white relative">
      {/* Dynamic Background */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-slate-50 border-b border-slate-100" />
      
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Breadcrumbs / Back */}
        <div className="flex items-center gap-2 mb-12 animate-fade-in">
          <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">Accueil</Link>
          <div className="w-1 h-1 bg-slate-300 rounded-full" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Flotte</span>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none">
              Explorez la <br /><span className="text-gradient">Collection</span>.
            </h1>
            <p className="text-slate-500 font-medium text-lg max-w-xl">
              Choisissez l'excellence parmi notre sélection de véhicules de prestige, disponibles immédiatement.
            </p>
          </div>
          
          {/* Search Box */}
          <div className="w-full md:w-96 relative group">
            <div className="absolute inset-0 bg-primary/5 blur-xl group-focus-within:bg-primary/10 transition-all" />
            <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Rechercher un modèle..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-16 pr-6 py-5 rounded-[24px] border border-slate-200 bg-white text-slate-900 font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all relative z-10"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="sticky top-32">
              <FleetFilters onFilter={(f) => { setFilters(f); setPage(1); }} />
            </div>
          </aside>

          {/* Main Catalog Grid */}
          <div className="flex-1 space-y-12">
            {/* Sorting & Stats */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-6">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                {isLoading ? "Synchronisation..." : `${filtered.length} véhicules disponibles`}
              </p>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trier par:</span>
                <select className="bg-transparent border-none outline-none font-bold text-sm text-slate-900 cursor-pointer">
                  <option>Prix: Croissant</option>
                  <option>Prix: Décroissant</option>
                  <option>Nouveautés</option>
                </select>
              </div>
            </div>

            {/* Grid Container */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-[4/5] bg-slate-50 rounded-[32px] animate-pulse" />
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {filtered.map((v) => (
                    <VehicleCard
                      key={v.id}
                      id={v.id}
                      brand={v.brand}
                      model={v.model}
                      type={v.type}
                      price={v.price_per_day}
                      seats={(v as any).seats ?? 5}
                      fuel={(v as any).fuel ?? "N/A"}
                      transmission={(v as any).transmission ?? "Automatic"}
                      imageUrl={v.image_url ?? undefined}
                      dynamicPrice={v.dynamic_price}
                      dynamicReason={v.dynamic_reason}
                      onQuickView={() => setQuickViewVehicle({
                        ...v,
                        price: v.price_per_day,
                        seats: (v as any).seats ?? 5,
                        fuel: (v as any).fuel ?? "N/A",
                        transmission: (v as any).transmission ?? "Automatic",
                        imageUrl: v.image_url ?? undefined
                      })}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 pt-12">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="w-14 h-14 rounded-full border border-slate-100 flex items-center justify-center hover:bg-slate-50 disabled:opacity-30 transition-all"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setPage(i + 1)}
                          className={cn(
                            "w-10 h-10 rounded-xl text-xs font-black transition-all",
                            page === i + 1
                              ? "bg-primary text-white shadow-lg shadow-primary/30"
                              : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                          )}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="w-14 h-14 rounded-full border border-slate-100 flex items-center justify-center hover:bg-slate-50 disabled:opacity-30 transition-all"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-32 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center">
                  <Search size={40} className="text-slate-200" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Aucun véhicule trouvé</h3>
                  <p className="text-slate-400 font-medium">Ajustez vos filtres pour voir d'autres modèles.</p>
                </div>
              </div>
            )}
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
    <Suspense fallback={<div className="min-h-screen pt-28 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>}>
      <FleetContent />
    </Suspense>
  );
}
