"use client";

import { useState, Suspense, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, ArrowUpDown, Share2, Search } from "lucide-react";
import QuickViewModal from "@/components/QuickViewModal";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { FleetFilterState } from "@/modules/fleet/components/FleetFilters";
import RecentBookingPopup from "@/components/RecentBookingPopup";
import { LayoutGrid, List, Car, Gauge, Users, Wallet, MapPin, Star, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";

import FleetHeader from "@/modules/fleet/components/FleetHeader";
import FleetGrid from "@/modules/fleet/components/FleetGrid";
import { Filter } from "lucide-react";

// Hooks
import { useFleetData } from "@/modules/fleet/hooks/useFleetData";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/utils";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_COLUMNS = 4;

function getFleetSettings() {
  if (typeof window === "undefined") return { pageSize: DEFAULT_PAGE_SIZE, columns: DEFAULT_COLUMNS };
  try {
    const raw = localStorage.getItem("vrc_fleet_settings");
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        pageSize: parsed.pageSize || DEFAULT_PAGE_SIZE,
        columns: parsed.columns || DEFAULT_COLUMNS,
      };
    }
  } catch {}
  return { pageSize: DEFAULT_PAGE_SIZE, columns: DEFAULT_COLUMNS };
}

const TYPES = ["All", "Sedan", "SUV", "Sport", "Compact", "Luxury"];
const TRANSMISSIONS = ["All", "Automatic", "Manual"];
const SEATS = ["All", "2", "4", "5", "7+"];
const LIFESTYLES = [
  { id: "all", label: "Tous", icon: Car },
  { id: "business", label: "Business", icon: Gauge },
  { id: "romance", label: "Romance", icon: Star },
  { id: "adventure", label: "Aventure", icon: MapPin },
  { id: "family", label: "Famille", icon: Users },
];

function FleetContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const startDateParam = searchParams.get("start_date") || undefined;
  const endDateParam = searchParams.get("end_date") || undefined;
  const lifestyleParam = searchParams.get("lifestyle") || "all";

  const fleetSettings = useMemo(() => getFleetSettings(), []);

  const [search, setSearch] = useState("");
  const [textSearch, setTextSearch] = useState("");
  const [sortBy, setSortBy] = useState<"price_asc" | "price_desc" | "year_desc" | "brand_asc">("price_asc");
  const [layoutView, setLayoutView] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<FleetFilterState>({
    type: "All",
    transmission: "All",
    maxPrice: 3000,
    seats: "All",
    lifestyle: lifestyleParam,
  });
  const [quickViewVehicle, setQuickViewVehicle] = useState<any>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2000);
  };

  const {
    sorted, isLoading, loadMore, hasMore
  } = useFleetData({
    pageSize: fleetSettings.pageSize,
    search,
    filters,
    sortBy,
    startDate: startDateParam,
    endDate: endDateParam
  });

  const filteredByText = useMemo(() => {
    if (!textSearch) return sorted;
    const q = textSearch.toLowerCase();
    return sorted.filter(v =>
      v.brand?.toLowerCase().includes(q) ||
      v.model?.toLowerCase().includes(q)
    );
  }, [sorted, textSearch]);

  const handleFilterChange = useCallback((key: keyof FleetFilterState, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = () => {
    const def = { type: "All", transmission: "All", maxPrice: 3000, seats: "All", lifestyle: "all" };
    setFilters(def);
  };

  const hasActiveFilters = filters.type !== "All" || filters.transmission !== "All" || filters.seats !== "All" || filters.lifestyle !== "all" || filters.maxPrice < 3000;

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
          <FleetHeader search={search} setSearch={(val) => { setSearch(val); }} />
        </motion.div>

        {/* ── Horizontal Filter Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-10"
        >
          <div className="bg-surface-0 rounded-2xl border border-border shadow-sm p-5 space-y-4">

            {/* Row 1: Lifestyle chips */}
            <div className="flex items-center gap-2 flex-wrap">
              {LIFESTYLES.map((ls) => {
                const Icon = ls.icon;
                const active = filters.lifestyle === ls.id;
                return (
                  <button
                    key={ls.id}
                    onClick={() => handleFilterChange("lifestyle", ls.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border",
                      active
                        ? "bg-gold text-white border-gold shadow-sm shadow-gold/20"
                        : "bg-surface-1 text-ink-4 border-border hover:border-gold/40 hover:text-gold"
                    )}
                  >
                    <Icon size={14} />
                    {ls.label}
                  </button>
                );
              })}
            </div>

            {/* Row 2: Category + Transmission + Seats */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Category */}
              <div className="flex items-center gap-1.5 bg-surface-1 rounded-lg px-2 py-1 border border-border">
                {TYPES.map((type) => {
                  const active = filters.type === type;
                  return (
                    <button
                      key={type}
                      onClick={() => handleFilterChange("type", type)}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all",
                        active ? "bg-gold text-white shadow-sm" : "text-ink-4 hover:text-ink-1"
                      )}
                    >
                      {type === "All" ? t("all") : (t(`cat_${type.toLowerCase()}`) || type)}
                    </button>
                  );
                })}
              </div>

              <div className="w-px h-6 bg-border" />

              {/* Transmission */}
              <div className="flex items-center gap-1.5 bg-surface-1 rounded-lg px-2 py-1 border border-border">
                {TRANSMISSIONS.map((tr) => {
                  const active = filters.transmission === tr;
                  return (
                    <button
                      key={tr}
                      onClick={() => handleFilterChange("transmission", tr)}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all",
                        active ? "bg-gold text-white shadow-sm" : "text-ink-4 hover:text-ink-1"
                      )}
                    >
                      {tr === "All" ? t("all") : (t(`trans_${tr.toLowerCase()}`) || tr)}
                    </button>
                  );
                })}
              </div>

              <div className="w-px h-6 bg-border" />

              {/* Seats */}
              <div className="flex items-center gap-1.5 bg-surface-1 rounded-lg px-2 py-1 border border-border">
                {SEATS.map((s) => {
                  const active = filters.seats === s;
                  return (
                    <button
                      key={s}
                      onClick={() => handleFilterChange("seats", s)}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all",
                        active ? "bg-gold text-white shadow-sm" : "text-ink-4 hover:text-ink-1"
                      )}
                    >
                      {s === "All" ? t("all") : `${s} place${s !== "2" ? "s" : ""}`}
                    </button>
                  );
                })}
              </div>

              <div className="w-px h-6 bg-border" />

              {/* Advanced toggle */}
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border",
                  showAdvanced ? "bg-primary/5 text-primary border-primary/20" : "text-ink-4 border-border hover:border-ink-4/40"
                )}
              >
                <Wallet size={12} />
                Prix
                {showAdvanced ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
              </button>

              {/* Reset */}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 transition-all"
                >
                  <RotateCcw size={10} />
                  Réinitialiser
                </button>
              )}
            </div>

            {/* Advanced: Price Range (collapsible) */}
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-4 pt-2 border-t border-border">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-ink-4">Prix max</span>
                    <input
                      type="range"
                      min="200"
                      max={5000}
                      step="50"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange("maxPrice", Number(e.target.value))}
                      className="flex-1 h-2 bg-gradient-to-r from-primary to-gold rounded-full appearance-none cursor-pointer accent-gold"
                    />
                    <span className="text-xs font-bold text-gold min-w-[80px] text-right">{filters.maxPrice} DH</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Controls Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="sticky top-24 z-30 flex items-center justify-between mb-8 pb-4 pt-4 border-b border-border flex-wrap gap-4 bg-surface-0/80 backdrop-blur-xl rounded-t-2xl px-4 -mx-4 sm:mx-0 shadow-[0_4px_30px_rgba(22,33,62,0.04)]"
        >
          <div className="flex items-center gap-3">
            {/* Text Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none" />
              <input
                type="text"
                value={textSearch}
                onChange={(e) => setTextSearch(e.target.value)}
                placeholder="Rechercher marque/modèle..."
                className="pl-9 pr-4 py-2 bg-surface-1 border border-border rounded-lg text-xs font-semibold text-ink-1 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all w-48"
              />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-ink-3">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  Synchronisation...
                </span>
              ) : (
                `${filteredByText.length} ${t("fleet_count")}`
              )}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20 hover:bg-primary/5 transition-all"
            >
              <Share2 size={12} />
              Partager
            </button>

            {/* View Toggle */}
            <div className="hidden md:flex items-center gap-1 bg-surface-1 p-1 rounded-lg border border-border">
              <button
                onClick={() => setLayoutView("grid")}
                className={cn("p-1.5 rounded-md transition-all", layoutView === "grid" ? "bg-surface-0 text-primary shadow-sm" : "text-ink-3 hover:text-ink-1")}
                aria-label="Vue Grille"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setLayoutView("list")}
                className={cn("p-1.5 rounded-md transition-all", layoutView === "list" ? "bg-surface-0 text-primary shadow-sm" : "text-ink-3 hover:text-ink-1")}
                aria-label="Vue Liste"
              >
                <List size={16} />
              </button>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-ink-3 hidden sm:inline">Trier:</span>
              <div className="relative group">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-surface-0 border-2 border-border rounded-lg px-4 py-2.5 text-xs font-bold text-ink-1 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all cursor-pointer pr-9"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-surface-0 text-ink-1">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ArrowUpDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gold pointer-events-none" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Fleet Grid — full width */}
        <FleetGrid
          vehicles={filteredByText}
          loading={isLoading}
          hasMore={hasMore}
          onLoadMore={loadMore}
          onQuickView={setQuickViewVehicle}
          layoutView={layoutView}
          columns={fleetSettings.columns}
        />
      </div>

      {/* Share Toast */}
      <AnimatePresence>
        {shareToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-primary text-white px-6 py-3 rounded-full text-sm font-bold shadow-xl shadow-primary/30"
          >
            Lien copié !
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick View Modal */}
      {quickViewVehicle && (
        <QuickViewModal
          vehicle={quickViewVehicle}
          onClose={() => setQuickViewVehicle(null)}
        />
      )}

      {/* Social Proof */}
      <RecentBookingPopup />
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
