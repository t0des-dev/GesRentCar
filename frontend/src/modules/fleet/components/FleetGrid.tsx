"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Search, Star } from "lucide-react";
import VehicleCard from "@/modules/fleet/components/VehicleCard";
import { cn } from "@/shared/utils";
import { useTranslation } from "@/shared/hooks/useTranslation";

interface FleetGridProps {
  vehicles: any[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onQuickView: (vehicle: any) => void;
  layoutView?: "grid" | "list";
}

export default function FleetGrid({ 
  vehicles, 
  loading, 
  page, 
  totalPages, 
  onPageChange, 
  onQuickView,
  layoutView = "grid"
}: FleetGridProps) {
  const { t } = useTranslation();

  return (
    <div className="flex-1">

      {loading ? (
        <div className={cn("grid gap-8", layoutView === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={cn(
              "bg-slate-50 rounded-2xl animate-pulse",
              layoutView === "grid" 
                ? (i % 3 === 0 ? "aspect-[4/3] md:col-span-2" : "aspect-[3/4]")
                : "h-48 w-full"
            )} />
          ))}
        </div>
      ) : vehicles.length > 0 ? (
        <div className="space-y-16">
          <div className={cn("grid gap-8 lg:gap-12", layoutView === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}>
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
                    layoutView === "grid" && idx % 3 === 0 ? "md:col-span-2" : ""
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
                    layoutView={layoutView}
                    className={layoutView === "grid" ? (idx % 3 === 0 ? "min-h-[500px]" : "h-full") : "h-auto"}
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
            <div className="flex items-center justify-center gap-4 pt-8 border-t border-slate-100">
              <button
                onClick={() => onPageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-30 transition-all text-slate-500"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => onPageChange(i + 1)}
                    className={cn(
                      "w-10 h-10 rounded-xl text-xs font-bold transition-all",
                      page === i + 1
                        ? "bg-primary text-white shadow-sm"
                        : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-30 transition-all text-slate-500"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center justify-center text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100"
          >
            <Star size={40} className="text-slate-300" strokeWidth={1} />
          </motion.div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              {t("fleet_empty_title")}
            </h3>
            <p className="text-base text-slate-500 max-w-md">
              {t("fleet_empty_desc")}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="mt-6 text-xs font-semibold uppercase tracking-wider text-primary border-b border-primary/30 pb-1 hover:border-primary transition-all"
            >
              {t("filter_clear")}
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
