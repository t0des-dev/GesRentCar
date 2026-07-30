"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Car, ChevronLeft, ChevronRight, Zap, Crown, Gauge } from "lucide-react";
import VehicleCardSkeleton from "@/modules/fleet/components/VehicleCardSkeleton";
import VehicleCard from "@/modules/fleet/components/VehicleCard";
import QuickViewModal from "@/components/QuickViewModal";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { cn } from "@/shared/utils";
import { getImageUrl } from "@/shared/utils/image";

interface FeaturedVehiclesProps {
  vehicles: any[];
  loading: boolean;
  content?: {
    eyebrow?: string;
    title?: string;
    cta_text?: string;
    cta_link?: string;
    loading_text?: string;
    empty_heading?: string;
    empty_description?: string;
    layout?: string; // grid, carousel
    columns?: string; // 2, 3, 4
    limit?: string; // e.g. 6, 12
    show_filters?: string; // true/false
    filter_color?: string; // hex color
    dynamic_bg?: string; // true/false
    selected_ids?: string;
  };
}

// Category meta: icon component + accent colors per category
const CATEGORY_META: Record<string, {
  icon: React.ReactNode;
  bg: string;
  glow: string;
  pill: string;
  pillActive: string;
}> = {
  Tous: {
    icon: <Car size={14} />,
    bg: "from-slate-900/0 via-slate-800/0 to-slate-700/0",
    glow: "bg-slate-500/5",
    pill: "bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-400",
    pillActive: "bg-slate-900 text-white border-slate-900 shadow-md",
  },
  Économique: {
    icon: <Zap size={14} />,
    bg: "from-emerald-900/10 via-emerald-800/5 to-transparent",
    glow: "bg-emerald-500/10",
    pill: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-500",
    pillActive: "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20",
  },
  Économique_light: {
    icon: <Zap size={14} />,
    bg: "from-emerald-900/10 via-emerald-800/5 to-transparent",
    glow: "bg-emerald-500/10",
    pill: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-500",
    pillActive: "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20",
  },
  Sport: {
    icon: <Gauge size={14} />,
    bg: "from-rose-900/10 via-rose-800/5 to-transparent",
    glow: "bg-rose-500/10",
    pill: "bg-rose-50 text-rose-700 border-rose-200 hover:border-rose-500",
    pillActive: "bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-500/20",
  },
  SUV: {
    icon: <Car size={14} />,
    bg: "from-blue-900/10 via-blue-800/5 to-transparent",
    glow: "bg-blue-500/10",
    pill: "bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-500",
    pillActive: "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20",
  },
  Luxe: {
    icon: <Crown size={14} />,
    bg: "from-amber-900/15 via-amber-800/8 to-transparent",
    glow: "bg-amber-500/10",
    pill: "bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-500",
    pillActive: "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20",
  },
  Standard: {
    icon: <Car size={14} />,
    bg: "from-indigo-900/10 via-indigo-800/5 to-transparent",
    glow: "bg-indigo-500/10",
    pill: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:border-indigo-500",
    pillActive: "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20",
  },
};

function getCategoryMeta(cat: string) {
  return CATEGORY_META[cat] || {
    icon: <Car size={14} />,
    bg: "from-slate-900/0 to-transparent",
    glow: "bg-slate-500/5",
    pill: "bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-400",
    pillActive: "bg-slate-900 text-white border-slate-900",
  };
}

export default function FeaturedVehicles({ vehicles, loading, content = {} }: FeaturedVehiclesProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("Tous");
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [quickViewVehicle, setQuickViewVehicle] = useState<any>(null);
  const [carouselProgress, setCarouselProgress] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const layout = content.layout || "grid";
  const columnsStr = content.columns || "3";
  const showFilters = content.show_filters !== "false";
  const dynamicBg = content.dynamic_bg !== "false";

  const gridClass =
    columnsStr === "2" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2" :
    columnsStr === "4" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" :
    "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  // Calculate unique categories with counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    vehicles.forEach(v => {
      const cat = v.category || "Standard";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [vehicles]);

  const categories = useMemo(() => {
    const cats = new Set(vehicles.map(v => v.category || "Standard").filter(Boolean));
    return ["Tous", ...Array.from(cats)];
  }, [vehicles]);

  const totalCount = vehicles.length;

  // Compute dynamic badges based on data
  const minPrice = useMemo(() => Math.min(...vehicles.map(v => v.price_per_day || v.price || Infinity)), [vehicles]);

  // Filter vehicles
  const filteredVehicles = useMemo(() => {
    let filtered = activeTab === "Tous" ? vehicles : vehicles.filter(v => (v.category || "Standard") === activeTab);

    if (content.selected_ids) {
      const ids = content.selected_ids.split(',').map((id: string) => parseInt(id.trim())).filter((id: number) => !isNaN(id));
      if (ids.length > 0) filtered = filtered.filter(v => ids.includes(v.id));
    }

    const limitStr = content.limit ? content.limit : (layout === "grid" && activeTab === "Tous" && !content.selected_ids ? "6" : "12");
    const limit = parseInt(limitStr);
    return filtered.slice(0, isNaN(limit) ? 6 : limit);
  }, [vehicles, activeTab, content.selected_ids, layout, content.limit]);

  // Carousel scroll tracking for progress bar
  const handleCarouselScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    const progress = scrollLeft / (scrollWidth - clientWidth);
    setCarouselProgress(Math.min(progress * 100, 100));
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleCarouselScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleCarouselScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 400;
      carouselRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  const activeMeta = getCategoryMeta(activeTab);

  return (
    <section className={cn(
      "py-32 bg-surface-1 relative overflow-hidden transition-colors duration-1000"
    )}>
      {/* ─── Category Ambient Glow ─── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className={cn(
            "absolute inset-0 bg-gradient-to-br pointer-events-none z-0",
            activeMeta.bg
          )}
        />
      </AnimatePresence>

      {/* Dynamic Background Effect from hovered vehicle image */}
      {dynamicBg && (
        <div className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-1000 opacity-15">
          <AnimatePresence mode="wait">
            <motion.div
              key={hoveredImage || "default"}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 bg-cover bg-center blur-[100px] saturate-200"
              style={{ backgroundImage: `url(${hoveredImage || ""})` }}
            />
          </AnimatePresence>
        </div>
      )}

      {/* Default subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-gold/5 pointer-events-none z-0" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">

        {/* Header & Filters */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="section-mark" />
            <motion.p
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="section-eyebrow"
            >
              {content.eyebrow || "Showroom"}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08, duration: 0.6 }}
              className="text-[clamp(30px,3.6vw,44px)] font-bold tracking-tight leading-[1.15] text-ink-1"
            >
              {content.title || t("featured_vehicles")}
            </motion.h2>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 shrink-0">
            {/* Category Tabs with icons & counts */}
            {showFilters && categories.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const meta = getCategoryMeta(cat);
                  const count = cat === "Tous" ? totalCount : (categoryCounts[cat] || 0);
                  const isActive = activeTab === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveTab(cat)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all duration-300",
                        isActive ? meta.pillActive : meta.pill
                      )}
                    >
                      {meta.icon}
                      {cat === "Tous" ? (t("all") || "Tous") : cat}
                      <span className={cn(
                        "text-[9px] font-black px-1.5 py-0.5 rounded-full",
                        isActive ? "bg-white/20" : "bg-black/10"
                      )}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* CTA Link */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.16 }}
            >
              <Link href={content.cta_link || "/fleet"} className="nav-link-gold font-bold uppercase text-sm tracking-wider flex items-center">
                {content.cta_text || "Voir le catalogue"}
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Vehicles Content */}
        {loading ? (
          <div className={cn("grid gap-8", gridClass)}>
            <VehicleCardSkeleton />
            <VehicleCardSkeleton className="hidden md:flex" />
            <VehicleCardSkeleton className="hidden lg:flex" />
            {columnsStr === "4" && <VehicleCardSkeleton className="hidden lg:flex" />}
          </div>
        ) : filteredVehicles.length > 0 ? (

          layout === "carousel" ? (
            /* ── Carousel Layout with progress bar ── */
            <div className="relative group/carousel -mx-6 px-6 lg:-mx-8 lg:px-8">
              <div
                ref={carouselRef}
                className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory no-scrollbar"
              >
                {filteredVehicles.map((v, idx) => {
                  const isVehicleBestDeal = (v.price_per_day || v.price) === minPrice;
                  const isVehicleNew = v.is_new || false;
                  const isVehicleVip = (v.category === "Luxe") || false;
                  return (
                    <div
                      key={v.id}
                      className="w-[85vw] md:w-[400px] shrink-0 snap-start"
                      onMouseEnter={() => setHoveredImage(getImageUrl(v.image_url) ?? null)}
                      onMouseLeave={() => setHoveredImage(null)}
                    >
                      <VehicleCard
                        id={v.id} brand={v.brand} model={v.model} type={v.type}
                        price={v.price_per_day} seats={v.seats ?? 5} fuel={v.fuel_type || v.fuel || "Diesel"}
                        transmission={v.transmission || "Automatique"} imageUrl={v.image_url ?? undefined}
                        dynamicPrice={v.dynamic_price} dynamicReason={v.dynamic_reason}
                        isPopular={idx === 0 && activeTab === "Tous"}
                        isBestDeal={isVehicleBestDeal && idx !== 0}
                        isNew={isVehicleNew}
                        isVip={isVehicleVip}
                        gps={v.gps || false}
                        airConditioning={v.air_conditioning || false}
                        onQuickView={() => setQuickViewVehicle(v)}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Mobile Progress Bar */}
              <div className="md:hidden mt-4 flex items-center justify-between gap-3">
                <div className="flex-1 h-1 bg-surface-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(carouselProgress, 100 / filteredVehicles.length)}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-ink-3 shrink-0">
                  {Math.round(carouselProgress * filteredVehicles.length / 100) + 1}/{filteredVehicles.length}
                </span>
              </div>

              {/* Desktop Carousel Controls */}
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-xl border border-border items-center justify-center text-ink-2 hover:text-gold hover:border-gold transition-all hidden md:flex opacity-0 group-hover/carousel:opacity-100 z-20"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full shadow-xl border border-border items-center justify-center text-ink-2 hover:text-gold hover:border-gold transition-all hidden md:flex opacity-0 group-hover/carousel:opacity-100 z-20"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          ) : (
            /* ── Grid Layout ── */
            <div className={cn("grid gap-8 lg:gap-10", gridClass)}>
              <AnimatePresence mode="popLayout">
                {filteredVehicles.map((v, idx) => {
                  const isVehicleBestDeal = (v.price_per_day || v.price) === minPrice;
                  const isVehicleNew = v.is_new || false;
                  const isVehicleVip = (v.category === "Luxe") || false;
                  return (
                    <motion.div
                      key={v.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95, y: 16 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.35, delay: idx * 0.04 }}
                      onMouseEnter={() => setHoveredImage(getImageUrl(v.image_url) ?? null)}
                      onMouseLeave={() => setHoveredImage(null)}
                    >
                      <VehicleCard
                        id={v.id} brand={v.brand} model={v.model} type={v.type}
                        price={v.price_per_day} seats={v.seats ?? 5} fuel={v.fuel_type || v.fuel || "Diesel"}
                        transmission={v.transmission || "Automatique"} imageUrl={v.image_url ?? undefined}
                        dynamicPrice={v.dynamic_price} dynamicReason={v.dynamic_reason}
                        isPopular={idx === 0 && activeTab === "Tous"}
                        isBestDeal={isVehicleBestDeal && idx !== 0}
                        isNew={isVehicleNew}
                        isVip={isVehicleVip}
                        gps={v.gps || false}
                        airConditioning={v.air_conditioning || false}
                        onQuickView={() => setQuickViewVehicle(v)}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )

        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="col-span-full text-center py-40 bg-surface-1 rounded-3xl border border-border"
          >
            <Car size={52} className="mx-auto mb-6 text-gold/30" />
            <p className="font-semibold text-ink-2 text-base">{content.empty_heading || "Aucun véhicule disponible"}</p>
            <p className="text-sm text-ink-3 mt-2">{content.empty_description || "Les véhicules pour cette catégorie vont bientôt être disponibles"}</p>
          </motion.div>
        )}

      </div>

      {/* Quick View Modal */}
      {quickViewVehicle && (
        <QuickViewModal
          vehicle={quickViewVehicle}
          onClose={() => setQuickViewVehicle(null)}
        />
      )}
    </section>
  );
}
