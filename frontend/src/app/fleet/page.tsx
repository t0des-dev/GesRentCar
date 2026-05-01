"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import VehicleCard from "@/components/VehicleCard";
import FleetFilters, { FleetFilterState } from "@/components/FleetFilters";
import { ChevronLeft, ChevronRight, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { useVehicles } from "@/hooks/useApi";
import QuickViewModal from "@/components/QuickViewModal";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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
    <main className="min-h-screen pt-32 pb-24 bg-background relative selection:bg-primary/20 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 inset-x-0 h-[1000px] pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Premium Header */}
        <div className="mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-12 h-px bg-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Luxury Fleet 2026</span>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div className="max-w-3xl">
              <motion.h1 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-7xl md:text-[120px] font-black text-foreground tracking-tighter leading-[0.85] mb-8"
              >
                L'ART DE LA <br />
                <span className="text-gradient-gold">PERFORMANCE</span>.
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-slate-500 font-medium text-xl md:text-2xl max-w-xl leading-relaxed opacity-80"
              >
                Découvrez une collection de véhicules d'exception, alliant ingénierie de pointe et design intemporel.
              </motion.p>
            </div>
            
            {/* Search Glassmorphism */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="w-full lg:w-[400px] relative group"
            >
              <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl rounded-[32px] border border-white/10 shadow-2xl transition-all group-focus-within:border-primary/50" />
              <Search size={22} className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Chercher une icône..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-20 pr-8 py-7 rounded-[32px] bg-transparent text-foreground font-black text-lg focus:outline-none relative z-10 placeholder:text-slate-600"
              />
            </motion.div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-20">
          
          {/* Advanced Sidebar Filters */}
          <aside className="w-full lg:w-80 shrink-0">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="sticky top-32 space-y-8"
            >
              <div className="p-8 rounded-[40px] bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                <FleetFilters onFilter={(f) => { setFilters(f); setPage(1); }} />
              </div>

              {/* Promo Card */}
              <div className="p-8 rounded-[40px] bg-primary relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                <h4 className="text-white font-black text-lg mb-2 relative z-10">Membre Privilège ?</h4>
                <p className="text-white/70 text-xs font-medium mb-6 relative z-10">Bénéficiez de -15% sur toute la collection Sport.</p>
                <button className="bg-white text-primary px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">S'inscrire</button>
              </div>
            </motion.div>
          </aside>

          {/* Main Asymmetric Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  {isLoading ? "Synchronisation en cours..." : `${filtered.length} CHEFS-D'ŒUVRE DISPONIBLES`}
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={cn(
                    "bg-slate-50/5 rounded-[48px] animate-pulse",
                    i % 3 === 0 ? "aspect-[4/3] md:col-span-2" : "aspect-[3/4]"
                  )} />
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div className="space-y-24">
                {/* Dynamic Asymmetric Layout Logic */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                  <AnimatePresence mode="popLayout">
                    {filtered.map((v, idx) => (
                      <motion.div
                        key={v.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className={cn(
                          "relative",
                          // Make every 3rd vehicle featured (wider)
                          idx % 3 === 0 ? "md:col-span-2" : ""
                        )}
                      >
                        <VehicleCard
                          id={v.id}
                          brand={v.brand}
                          model={v.model}
                          type={v.type}
                          price={v.price_per_day}
                          seats={(v as any).seats ?? 5}
                          fuel={v.fuel_type || "Diesel"}
                          transmission={v.transmission || "Automatic"}
                          year={v.year}
                          horsepower={v.horsepower}
                          imageUrl={v.image_url ?? undefined}
                          dynamicPrice={v.dynamic_price}
                          dynamicReason={v.dynamic_reason}
                          className={idx % 3 === 0 ? "min-h-[500px]" : "h-full"}
                          onQuickView={() => setQuickViewVehicle({
                            ...v,
                            price: v.price_per_day,
                            seats: (v as any).seats ?? 5,
                            fuel: v.fuel_type || "Diesel",
                            transmission: v.transmission || "Automatic",
                            imageUrl: v.image_url ?? undefined
                          })}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-6 pt-12 border-t border-white/5">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 disabled:opacity-20 transition-all text-foreground"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <div className="flex items-center gap-3">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setPage(i + 1)}
                          className={cn(
                            "w-12 h-12 rounded-2xl text-xs font-black transition-all",
                            page === i + 1
                              ? "bg-primary text-white shadow-[0_0_30px_rgba(37,99,235,0.4)]"
                              : "bg-white/5 text-slate-500 hover:bg-white/10"
                          )}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 disabled:opacity-20 transition-all text-foreground"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-32 flex flex-col items-center justify-center text-center space-y-10">
                <div className="w-32 h-32 bg-white/5 rounded-[40px] flex items-center justify-center border border-white/10">
                  <Search size={48} className="text-slate-700" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-foreground mb-4 tracking-tight">AUCUN SYMBOLE TROUVÉ</h3>
                  <p className="text-slate-500 font-medium text-lg max-w-sm">Ajustez vos critères pour découvrir d'autres chefs-d'œuvre de notre collection.</p>
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
