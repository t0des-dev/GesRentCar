"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import VehicleCard from "@/components/VehicleCard";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

interface FleetGridProps {
  vehicles: any[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onQuickView: (vehicle: any) => void;
}

export default function FleetGrid({ 
  vehicles, 
  loading, 
  page, 
  totalPages, 
  onPageChange, 
  onQuickView 
}: FleetGridProps) {
  const { t } = useTranslation();

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {loading ? "Synchronisation en cours..." : `${vehicles.length} ${t("fleet_count")}`}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={cn(
              "bg-slate-50/5 rounded-[48px] animate-pulse",
              i % 3 === 0 ? "aspect-[4/3] md:col-span-2" : "aspect-[3/4]"
            )} />
          ))}
        </div>
      ) : vehicles.length > 0 ? (
        <div className="space-y-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            <AnimatePresence mode="popLayout">
              {vehicles.map((v, idx) => (
                <motion.div
                  key={v.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={cn(
                    "relative",
                    idx % 3 === 0 ? "md:col-span-2" : ""
                  )}
                >
                  <VehicleCard
                    id={v.id}
                    brand={v.brand}
                    model={v.model}
                    type={v.type}
                    price={v.price_per_day}
                    seats={v.seats ?? 5}
                    fuel={v.fuel_type || "Diesel"}
                    transmission={v.transmission || "Automatic"}
                    year={v.year}
                    horsepower={v.horsepower}
                    imageUrl={v.image_url ?? undefined}
                    dynamicPrice={v.dynamic_price}
                    dynamicReason={v.dynamic_reason}
                    className={idx % 3 === 0 ? "min-h-[500px]" : "h-full"}
                    onQuickView={() => onQuickView({
                      ...v,
                      price: v.price_per_day,
                      seats: v.seats ?? 5,
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
                onClick={() => onPageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 disabled:opacity-20 transition-all text-foreground"
              >
                <ChevronLeft size={24} />
              </button>
              <div className="flex items-center gap-3">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => onPageChange(i + 1)}
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
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
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
            <h3 className="text-3xl font-black text-foreground mb-4 tracking-tight">{t("fleet_empty_title")}</h3>
            <p className="text-slate-500 font-medium text-lg max-w-sm">{t("fleet_empty_desc")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
