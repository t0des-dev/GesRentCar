"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { cn } from "@/shared/utils";
import { Car, Loader2, ChevronRight, Users, Settings2, Fuel, Star, MapPin, Snowflake, LayoutGrid, List, X } from "lucide-react";
import { BookingStepProps } from "@/types/booking";
import { DisplayVehicle } from "@/modules/booking/hooks/useBooking";
import { motion } from "framer-motion";

interface VehicleStepProps extends BookingStepProps {
  isLoading: boolean;
  vehicles: DisplayVehicle[];
  setStep: (s: number) => void;
}

type SortKey = "default" | "price-asc" | "price-desc";
type ViewMode = "grid" | "list";

export default function VehicleStep({ booking, update, isLoading, vehicles, setStep }: VehicleStepProps) {
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>("default");
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const categories = useMemo(() => {
    const cats = new Set<string>();
    vehicles.forEach((v) => { if (v.category) cats.add(v.category); });
    return Array.from(cats).sort();
  }, [vehicles]);

  const allPrices = useMemo(() => {
    const prices = vehicles.map((v) => v.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [vehicles]);

  const filtered = useMemo(() => {
    let list = categoryFilter ? vehicles.filter((v) => v.category === categoryFilter) : [...vehicles];
    if (priceMin) {
      const min = parseFloat(priceMin);
      if (!isNaN(min)) list = list.filter((v) => v.price >= min);
    }
    if (priceMax) {
      const max = parseFloat(priceMax);
      if (!isNaN(max)) list = list.filter((v) => v.price <= max);
    }
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [vehicles, categoryFilter, sortBy, priceMin, priceMax]);

  const selectedVehicle = booking.vehicleId ? vehicles.find((v) => v.id === booking.vehicleId) : null;

  const handleSelect = (v: DisplayVehicle) => {
    update("vehicleId", v.id);
  };

  const handleQuickBook = (v: DisplayVehicle) => {
    update("vehicleId", v.id);
    setStep(1);
  };

  const handleClearSelection = () => {
    update("vehicleId", null);
  };

  const handleReserveSelected = () => {
    if (selectedVehicle) setStep(1);
  };

  const renderEquipmentTags = (v: DisplayVehicle) => {
    const tags: { icon: typeof MapPin; label: string }[] = [];
    if (v.gps) tags.push({ icon: MapPin, label: "GPS" });
    if (v.airConditioning) tags.push({ icon: Snowflake, label: "Clim" });
    return tags;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-ink-3">
        <Loader2 className="animate-spin mb-4" size={36} strokeWidth={1} />
        <p className="text-xs font-semibold uppercase tracking-wider">Ouverture du showroom...</p>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-ink-4 bg-surface-1 rounded-3xl border-2 border-dashed border-border">
        <Car size={48} className="mb-4 opacity-20" />
        <p className="font-semibold uppercase tracking-wider text-sm">Aucun joyau disponible actuellement</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Compact selection banner */}
      {selectedVehicle && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-0 border border-primary/30 rounded-2xl p-4 flex items-center gap-4 shadow-sm"
        >
          <div className="relative w-20 h-14 rounded-xl overflow-hidden shrink-0">
            <Image
              src={selectedVehicle.img || "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=600"}
              alt={selectedVehicle.model || ""}
              width={80}
              height={56}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=600"; }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">Votre sélection</span>
              <span className="bg-surface-1 text-ink-2 px-2 py-0.5 rounded text-[9px] font-semibold uppercase border border-border">{selectedVehicle.type}</span>
            </div>
            <p className="text-sm font-bold text-ink-1 uppercase truncate mt-0.5">
              {selectedVehicle.brand} {selectedVehicle.model}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-lg font-bold text-ink-1">{selectedVehicle.price} <span className="text-xs text-ink-3 font-medium">DH/j</span></p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleReserveSelected}
              className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-1.5"
            >
              Réserver
              <ChevronRight size={14} />
            </button>
            <button
              onClick={handleClearSelection}
              className="bg-surface-1 text-ink-2 border border-border px-3 py-2.5 rounded-xl text-[11px] font-semibold uppercase tracking-wider hover:bg-surface-2 transition-all"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategoryFilter(null)}
            className={cn(
              "px-4 py-2 rounded-xl text-[11px] font-semibold uppercase tracking-wider transition-all border",
              categoryFilter === null
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-surface-0 text-ink-2 border-border hover:border-ink-3"
            )}
          >
            Tous
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat === categoryFilter ? null : cat)}
              className={cn(
                "px-4 py-2 rounded-xl text-[11px] font-semibold uppercase tracking-wider transition-all border",
                categoryFilter === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-surface-0 text-ink-2 border-border hover:border-ink-3"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={cn("p-2 rounded-lg border transition-all", viewMode === "grid" ? "bg-primary text-primary-foreground border-primary" : "bg-surface-0 text-ink-2 border-border")}
          >
            <LayoutGrid size={14} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn("p-2 rounded-lg border transition-all", viewMode === "list" ? "bg-primary text-primary-foreground border-primary" : "bg-surface-0 text-ink-2 border-border")}
          >
            <List size={14} />
          </button>
        </div>
      </div>

      {/* Budget + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-surface-0 rounded-2xl border border-border p-4">
        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-3">Budget</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder={`${allPrices.min}`}
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="w-20 bg-surface-1 border border-border rounded-lg px-3 py-2 text-xs font-semibold text-ink-1 placeholder:text-ink-4"
            />
            <span className="text-ink-4 text-xs">—</span>
            <input
              type="number"
              placeholder={`${allPrices.max}`}
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="w-20 bg-surface-1 border border-border rounded-lg px-3 py-2 text-xs font-semibold text-ink-1 placeholder:text-ink-4"
            />
            <span className="text-ink-4 text-xs font-medium">DH/j</span>
          </div>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
          className="bg-surface-1 border border-border rounded-lg px-4 py-2 text-xs font-semibold text-ink-2 appearance-none cursor-pointer w-full sm:w-auto"
        >
          <option value="default">Par défaut</option>
          <option value="price-asc">Prix ↑</option>
          <option value="price-desc">Prix ↓</option>
        </select>
      </div>

      {/* Vehicle grid/list */}
      <div className={cn(
        viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-5" : "flex flex-col gap-4"
      )}>
        {filtered.map((v, idx) => {
          const isSelected = booking.vehicleId === v.id;
          const equipTags = renderEquipmentTags(v);

          return (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={cn(
                "bg-surface-0 rounded-3xl overflow-hidden border transition-all duration-500",
                viewMode === "list" ? "flex flex-row" : "flex flex-col",
                isSelected
                  ? "border-primary/30 shadow-sm ring-1 ring-primary/20"
                  : "border-border/80 hover:border-border hover:shadow-sm"
              )}
            >
              <div className={cn("relative overflow-hidden", viewMode === "list" ? "h-full w-60 shrink-0" : "h-48")}>
                <Image
                  src={v.img || "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=600"}
                  alt={v.model || ""}
                  width={viewMode === "list" ? 300 : 400}
                  height={viewMode === "list" ? 200 : 300}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=600"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="bg-surface-0/90 backdrop-blur-sm text-ink-1 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider">
                    {v.type}
                  </span>
                </div>
                {isSelected && (
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider shadow-sm">
                    ✓ Sélectionné
                  </div>
                )}
              </div>

              <div className="flex flex-col flex-1 p-5">
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={9} className="fill-primary text-primary" />
                  ))}
                </div>
                <h3 className={cn("font-bold text-ink-1 tracking-tight mb-1 uppercase", viewMode === "list" ? "text-xl" : "text-lg")}>
                  {v.brand} <span className="text-ink-3 font-medium">{v.model}</span>
                </h3>
                <p className="text-xs text-ink-2 leading-relaxed mb-3 line-clamp-2">{v.desc}</p>

                {equipTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {equipTags.map((tag, i) => (
                      <span key={i} className="inline-flex items-center gap-1 bg-surface-1 text-ink-2 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase border border-border">
                        <tag.icon size={10} />
                        {tag.label}
                      </span>
                    ))}
                  </div>
                )}

                <div className={cn("grid grid-cols-3 gap-2 mb-5")}>
                  {[
                    { icon: Users, val: v.specs?.seats || 5, label: "PLACES" },
                    { icon: Settings2, val: v.specs?.transmission || "AUTO", label: "TRANS" },
                    { icon: Fuel, val: v.specs?.fuel || "DIESEL", label: "CARB" },
                  ].map((spec, i) => (
                    <div key={i} className="bg-surface-1 rounded-xl p-2.5 flex flex-col items-center justify-center gap-1 border border-border">
                      <spec.icon size={12} className="text-primary" />
                      <span className="text-[10px] font-semibold text-ink-1 uppercase">{spec.val}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-ink-3 text-[10px] font-semibold uppercase tracking-wider">Tarif privilège</span>
                    <span className="text-xl font-bold text-ink-1">
                      {v.price} <span className="text-xs text-ink-3 font-medium">DH/j</span>
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSelect(v)}
                      className={cn(
                        "flex-1 py-3.5 rounded-xl text-[11px] font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2",
                        isSelected
                          ? "bg-surface-1 text-ink-2 border border-border hover:bg-surface-2"
                          : "bg-primary text-primary-foreground hover:opacity-90 shadow-sm"
                      )}
                    >
                      <Car size={16} />
                      {isSelected ? "Sélectionné" : "Choisir"}
                    </button>
                    <button
                      onClick={() => handleQuickBook(v)}
                      className="flex-1 bg-surface-1 text-ink-1 border border-border py-3.5 rounded-xl text-[11px] font-semibold uppercase tracking-wider hover:bg-surface-2 transition-all flex items-center justify-center gap-1.5"
                    >
                      <ChevronRight size={14} />
                      Réserver
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-ink-4 bg-surface-1 rounded-3xl border-2 border-dashed border-border">
          <Car size={48} className="mb-4 opacity-20" />
          <p className="font-semibold uppercase tracking-wider text-sm">Aucun véhicule dans cette catégorie</p>
        </div>
      )}
    </div>
  );
}
