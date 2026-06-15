"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Star } from "lucide-react";
import VehicleCard from "@/modules/fleet/components/VehicleCard";
import { cn } from "@/shared/utils";
import { useTranslation } from "@/shared/hooks/useTranslation";

interface FleetGridProps {
  vehicles: any[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onQuickView: (vehicle: any) => void;
  layoutView?: "grid" | "list";
}

export default function FleetGrid({ 
  vehicles, 
  loading, 
  hasMore,
  onLoadMore, 
  onQuickView,
  layoutView = "grid"
}: FleetGridProps) {
  const { t } = useTranslation();

  // Helper to determine bento box classes
  const getBentoClasses = (idx: number, isList: boolean) => {
    if (isList) return "h-auto w-full";
    // Every 5th item takes 2 columns, others take 1
    // Layout sequence: [1, 1], [2-cols], [1, 1, 1], [2-cols]
    if (idx % 5 === 2) return "md:col-span-2 md:row-span-2";
    return "";
  };

  const getBentoHeight = (idx: number, isList: boolean) => {
    if (isList) return "h-full";
    if (idx % 5 === 2) return "min-h-[500px] md:min-h-[600px]";
    return "h-full";
  };

  return (
    <div className="flex-1">

      {loading && vehicles.length === 0 ? (
        <div className={cn("grid gap-8", layoutView === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1")}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={cn(
              "bg-slate-50/50 backdrop-blur-sm rounded-[1.5rem] animate-pulse border border-slate-100",
              layoutView === "grid" 
                ? (i % 5 === 2 ? "aspect-[4/3] md:col-span-2 md:row-span-2" : "aspect-[3/4]")
                : "h-48 w-full"
            )} />
          ))}
        </div>
      ) : vehicles.length > 0 ? (
        <div className="space-y-16">
          <div className={cn("grid gap-8 lg:gap-10", layoutView === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr" : "grid-cols-1")}>
            <AnimatePresence mode="popLayout">
              {vehicles.map((v, idx) => (
                  <motion.div
                  key={v.id}
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.6, delay: (idx % 6) * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                  className={cn(
                    "relative group",
                    getBentoClasses(idx, layoutView === "list")
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
                    className={getBentoHeight(idx, layoutView === "list")}
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

          {/* Load More Button */}
          {hasMore && (
            <div className="flex items-center justify-center pt-8 border-t border-slate-100">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onLoadMore}
                disabled={loading}
                className="group relative flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:bg-slate-800 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Chargement...
                  </span>
                ) : (
                  <>
                    Afficher plus de véhicules
                    <ChevronDown size={18} className="group-hover:translate-y-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </div>
          )}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center justify-center text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center border border-slate-100 shadow-sm"
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
