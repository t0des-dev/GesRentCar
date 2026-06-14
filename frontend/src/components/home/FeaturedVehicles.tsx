"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Car, ChevronLeft, ChevronRight } from "lucide-react";
import VehicleCardSkeleton from "@/components/VehicleCardSkeleton";
import VehicleCard from "@/components/VehicleCard";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/utils/image";

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

  const layout = content.layout || "grid";
  const columnsStr = content.columns || "3";
  const showFilters = content.show_filters !== "false";
  const filterColor = content.filter_color || "";
  const dynamicBg = content.dynamic_bg !== "false";

  const gridClass = 
    columnsStr === "2" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2" :
    columnsStr === "4" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" :
    "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  // Calculate unique categories
  const categories = useMemo(() => {
    const cats = new Set(vehicles.map(v => v.type || "Standard").filter(Boolean));
    return ["Tous", ...Array.from(cats)];
  }, [vehicles]);

  // Filter vehicles
  const filteredVehicles = useMemo(() => {
    let filtered = activeTab === "Tous" ? vehicles : vehicles.filter(v => (v.type || "Standard") === activeTab);
    
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
    <section className="py-32 bg-surface-0 relative overflow-hidden transition-colors duration-1000">
      
      {/* Dynamic Background Effect */}
      {dynamicBg && (
        <div className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-1000 opacity-20">
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
          <div className="max-w-2xl space-y-4">
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
              className="display-lg text-ink-1"
            >
              {content.title || t("featured_vehicles")}
            </motion.h2>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 shrink-0">
            {/* Tabs */}
            {showFilters && categories.length > 1 && (
              <div className="flex flex-wrap gap-2 bg-surface-1 p-1.5 rounded-2xl border border-border">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    className={cn(
                      "relative px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors",
                      activeTab === cat ? "text-white" : "text-ink-3 hover:text-ink-1"
                    )}
                  >
                    {activeTab === cat && (
                      <motion.div
                        layoutId="activeTab"
                        className={cn("absolute inset-0 rounded-xl", !filterColor && "bg-ink-1")}
                        style={filterColor ? { backgroundColor: filterColor } : {}}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{cat === "Tous" ? t("all") || "Tous" : cat}</span>
                  </button>
                ))}
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
                    onMouseEnter={() => setHoveredImage(getImageUrl(v.image_url))}
                    onMouseLeave={() => setHoveredImage(null)}
                  >
                    <VehicleCard
                      id={v.id} brand={v.brand} model={v.model} type={v.type}
                      price={v.price_per_day} seats={v.seats ?? 5} fuel={v.fuel_type || v.fuel || "Diesel"}
                      transmission={v.transmission || "Automatique"} imageUrl={v.image_url ?? undefined}
                      dynamicPrice={v.dynamic_price} dynamicReason={v.dynamic_reason}
                      isPopular={idx === 0 && activeTab === "Tous"}
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
            <div className={cn("grid gap-8 lg:gap-10", gridClass)}>
              <AnimatePresence mode="popLayout">
                {filteredVehicles.map((v, idx) => (
                  <motion.div
                    key={v.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    onMouseEnter={() => setHoveredImage(getImageUrl(v.image_url))}
                    onMouseLeave={() => setHoveredImage(null)}
                  >
                    <VehicleCard
                      id={v.id} brand={v.brand} model={v.model} type={v.type}
                      price={v.price_per_day} seats={v.seats ?? 5} fuel={v.fuel_type || v.fuel || "Diesel"}
                      transmission={v.transmission || "Automatique"} imageUrl={v.image_url ?? undefined}
                      dynamicPrice={v.dynamic_price} dynamicReason={v.dynamic_reason}
                      isPopular={idx === 0 && activeTab === "Tous"}
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

      </div>
    </section>
  );
}
