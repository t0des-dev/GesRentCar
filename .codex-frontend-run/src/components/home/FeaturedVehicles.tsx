"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Car, Loader2 } from "lucide-react";
import VehicleCard from "@/components/VehicleCard";
import { useTranslation } from "@/hooks/useTranslation";

interface FeaturedVehiclesProps {
  vehicles: any[];
  loading: boolean;
}

export default function FeaturedVehicles({ vehicles, loading }: FeaturedVehiclesProps) {
  const { t } = useTranslation();

  return (
    <section className="py-32 bg-surface-0 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-gold/5 pointer-events-none" />
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div className="max-w-2xl space-y-4">
            
            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="section-eyebrow"
            >
              Showroom
            </motion.p>
            
            {/* Title — Instrument Serif */}
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08, duration: 0.6 }}
              className="display-lg text-ink-1"
            >
              {t("featured_vehicles")}
            </motion.h2>
          </div>
          
          {/* CTA Link */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16 }}
            className="shrink-0"
          >
            <Link href="/fleet" className="nav-link-gold font-bold uppercase text-sm tracking-wider">
              Voir le catalogue
              <span className="ml-2">→</span>
            </Link>
          </motion.div>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-40 space-y-6">
              <Loader2 size={36} className="animate-spin text-gold/50" />
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-3">Chargement...</p>
            </div>
          ) : vehicles.length > 0 ? (
            vehicles.map((v, idx) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
              >
                <VehicleCard
                  id={v.id}
                  brand={v.brand}
                  model={v.model}
                  type={v.type}
                  price={v.price_per_day}
                  seats={v.seats ?? 5}
                  fuel={v.fuel_type || v.fuel || "Diesel"}
                  transmission={v.transmission || "Automatique"}
                  imageUrl={v.image_url ?? undefined}
                  dynamicPrice={v.dynamic_price}
                  dynamicReason={v.dynamic_reason}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-40 bg-surface-1 rounded-2xl border border-border">
              <Car size={52} className="mx-auto mb-6 text-gold/30" />
              <p className="font-semibold text-ink-2 text-base">Aucun véhicule disponible</p>
              <p className="text-sm text-ink-3 mt-2">Les véhicules vont bientôt être disponibles</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
