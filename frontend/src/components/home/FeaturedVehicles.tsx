"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Car, ChevronLeft, ChevronRight } from "lucide-react";
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

export default function FeaturedVehicles({ vehicles, loading, content = {} }: FeaturedVehiclesProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("Tous");
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [quickViewVehicle, setQuickViewVehicle] = useState<any>(null);

  const layout = content.layout || "grid";
  const columnsStr = content.columns || "3";
  const showFilters = content.show_filters !== "false";
  const filterColor = content.filter_color || "";
  const dynamicBg = content.dynamic_bg !== "false";

  const gridClass = 
    columnsStr === "2" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2" :
    columnsStr === "4" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" :
    "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";

  // Calculate unique categories
  const categories = useMemo(() => {
    const cats = new Set(vehicles.map(v => v.category || "Standard").filter(Boolean));
    return ["Tous", ...Array.from(cats)];
  }, [vehicles]);

  // Filter vehicles
  const filteredVehicles = useMemo(() => {
    let filtered = activeTab === "Tous" ? vehicles : vehicles.filter(v => (v.category || "Standard") === activeTab);
    
    // Filter by specific IDs if provided in CMS
    if (content.selected_ids) {
      const ids = content.selected_ids.split(',').map((id: string) => parseInt(id.trim())).filter((id: number) => !isNaN(id));
      if (ids.length > 0) {
        filtered = filtered.filter(v => ids.includes(v.id));
      }
    }
    
    // Apply limit
    const limitStr = content.limit ? content.limit : (layout === "grid" && activeTab === "Tous" && !content.selected_ids ? "6" : "12");
    const limit = parseInt(limitStr);
    
    return filtered.slice(0, isNaN(limit) ? 6 : limit);
  }, [vehicles, activeTab, content.selected_ids, layout, content.limit]);

  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 400;
      carouselRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 lg:py-32 bg-[var(--warm-white)] relative overflow-hidden transition-colors duration-1000">
      
      {/* Default subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-gold/5 pointer-events-none z-0" />
      
      <div className="max-w-[var(--container)] mx-auto px-8 relative z-10">
        
        {/* Header & Category Pills */}
        <div className="mb-12">
          {/* Eyebrow & Title */}
          <div className="max-w-[640px] mb-8">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-xs font-bold uppercase tracking-widest text-[#c39a4d] mb-2"
            >
              {content.eyebrow || "The Fleet"}
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08, duration: 0.6 }}
              className="text-[clamp(28px,3.2vw,40px)] font-extrabold leading-tight text-slate-900 tracking-tight mb-3"
            >
              {content.title || t("featured_vehicles")}
            </motion.h2>
          </div>

          {/* Category Filter Pills (Exact style from photo) */}
          {showFilters && (
            <div className="flex flex-wrap items-center gap-3">
              {(categories.length > 1 ? categories : ["Tous", "economy", "compact", "suv", "luxury", "utility"]).map((cat) => {
                const label =
                  cat === "Tous" ? "All Vehicles" :
                  cat.toLowerCase() === "economy" ? "Economy" :
                  cat.toLowerCase() === "compact" ? "Compact" :
                  cat.toLowerCase() === "suv" ? "SUV" :
                  cat.toLowerCase() === "luxury" ? "Luxury" :
                  cat.toLowerCase() === "utility" ? "Utility" :
                  cat.charAt(0).toUpperCase() + cat.slice(1);

                return (
                  <button
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    className={cn(
                      "px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm",
                      activeTab === cat
                        ? "bg-[#182232] text-white shadow-md scale-[1.02]"
                        : "bg-white text-slate-600 border border-gray-200/90 hover:text-slate-900 hover:border-gray-300"
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
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
            /* Carousel Layout */
            <div className="relative group/carousel -mx-6 px-6 lg:-mx-8 lg:px-8">
              <div 
                ref={carouselRef}
                className="flex gap-6 overflow-x-auto pb-12 snap-x snap-mandatory no-scrollbar"
              >
                {filteredVehicles.map((v, idx) => (
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
                      gps={v.gps || false}
                      airConditioning={v.air_conditioning || false}
                      equipements={v.equipements || []}
                      onQuickView={() => setQuickViewVehicle(v)}
                    />
                  </div>
                ))}
              </div>
              
              {/* Carousel Controls */}
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
            /* Grid Layout */
            <div className={cn("grid gap-8 lg:gap-[30px]", gridClass)}>
              <AnimatePresence mode="popLayout">
                {filteredVehicles.map((v, idx) => (
                  <motion.div
                    key={v.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    onMouseEnter={() => setHoveredImage(getImageUrl(v.image_url) ?? null)}
                    onMouseLeave={() => setHoveredImage(null)}
                  >
                    <VehicleCard
                      id={v.id} brand={v.brand} model={v.model} type={v.type}
                      price={v.price_per_day} seats={v.seats ?? 5} fuel={v.fuel_type || v.fuel || "Diesel"}
                      transmission={v.transmission || "Automatique"} imageUrl={v.image_url ?? undefined}
                      dynamicPrice={v.dynamic_price} dynamicReason={v.dynamic_reason}
                      isPopular={idx === 0 && activeTab === "Tous"}
                      gps={v.gps || false}
                      airConditioning={v.air_conditioning || false}
                      equipements={v.equipements || []}
                      onQuickView={() => setQuickViewVehicle(v)}
                    />
                  </motion.div>
                ))}
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

        {/* View Full Fleet CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <Link
            href={content.cta_link || "/fleet"}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#182232] hover:bg-slate-800 text-white font-bold text-sm px-8 py-3.5 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
          >
            <span>{content.cta_text || "View full fleet"}</span>
            <ArrowRight size={16} />
          </Link>
        </motion.div>

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
