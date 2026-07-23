"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Car } from "lucide-react";
import VehicleCard from "@/modules/fleet/components/VehicleCard";
import VehicleCardSkeleton from "@/modules/fleet/components/VehicleCardSkeleton";
import { cn } from "@/shared/utils";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { Vehicle } from "@/lib/api/vehicles";

interface FleetGridProps {
  vehicles: Vehicle[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onQuickView: (vehicle: Vehicle) => void;
  layoutView?: "grid" | "list";
  columns?: number;
}

const COL_CLASSES: Record<number, string> = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
};

export default function FleetGrid({
  vehicles,
  loading,
  hasMore,
  onLoadMore,
  onQuickView,
  layoutView = "grid",
  columns = 3,
}: FleetGridProps) {
  const { t } = useTranslation();

  const gridClass =
    layoutView === "grid"
      ? `grid-cols-1 md:grid-cols-2 ${COL_CLASSES[columns] || "lg:grid-cols-4"}`
      : "grid-cols-1";

  return (
    <div className="flex-1">
      {loading && vehicles.length === 0 ? (
        <div className={cn("grid gap-6", gridClass)}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <VehicleCardSkeleton
              key={i}
              className={layoutView === "list" ? "h-48 w-full" : ""}
            />
          ))}
        </div>
      ) : vehicles.length > 0 ? (
        <div className="space-y-16">
          <div className={cn("grid gap-6", gridClass, "auto-rows-fr")}>
            <AnimatePresence mode="popLayout">
              {vehicles.map((v, idx) => (
                <motion.div
                  key={v.id}
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{
                    duration: 0.6,
                    delay: (idx % 6) * 0.1,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="relative group"
                >
                  <VehicleCard
                    id={v.id}
                    brand={v.brand}
                    model={v.model}
                    type={v.type}
                    category={v.category}
                    price={v.price_per_day}
                    seats={v.seats ?? 5}
                    fuel={v.fuel_type || "Diesel"}
                    transmission={v.transmission || "Automatic"}
                    year={v.year}
                    horsepower={v.horsepower}
                    imageUrl={v.image_url ?? undefined}
                    dynamicPrice={v.dynamic_price}
                    dynamicReason={v.dynamic_reason}
                    gps={v.gps || false}
                    airConditioning={v.air_conditioning || false}
                    equipements={v.equipements || []}
                    layoutView={layoutView}
                    className="h-full"
                    onQuickView={() =>
                      onQuickView({
                        ...v,
                        seats: v.seats ?? 5,
                        fuel_type: v.fuel_type || "Diesel",
                        transmission: v.transmission || "Automatic",
                        image_url: v.image_url ?? null,
                      })
                    }
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {hasMore && (
            <div className="flex items-center justify-center pt-8 border-t border-slate-100">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onLoadMore}
                disabled={loading}
                className="group relative flex items-center gap-3 bg-[var(--navy)] text-white px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:shadow-[0_10px_40px_rgba(0,0,0,0.15)] transition-all overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    {t("fleet_sync")}
                  </span>
                ) : (
                  <>
                    {t("load_more")}
                    <ChevronDown
                      size={18}
                      className="group-hover:translate-y-1 transition-transform"
                    />
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
            <Car size={40} className="text-slate-300" strokeWidth={1} />
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
              className="mt-6 text-xs font-semibold uppercase tracking-wider text-[var(--gold)] border-b border-[var(--gold)]/30 pb-1 hover:border-[var(--gold)] transition-all cursor-pointer bg-transparent"
            >
              {t("fleet_clear_filters")}
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
