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
    <section className="py-40 bg-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div className="max-w-2xl">
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-primary font-black text-xs uppercase tracking-[0.5em] mb-6"
            >
              Showroom Privé
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9] uppercase"
            >
              {t("featured_vehicles") || "Notre Sélection Prestige"}
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link href="/fleet" className="group inline-flex items-center gap-4 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
              Voir tout le catalogue
              <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all">
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {loading ? (
             <div className="col-span-3 flex flex-col items-center justify-center py-32 space-y-6">
                <Loader2 size={48} className="animate-spin text-primary opacity-40" />
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Préparation du showroom...</p>
             </div>
          ) : vehicles.length > 0 ? (
            vehicles.map((v, idx) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.8 }}
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
            <div className="col-span-3 text-center py-32 bg-slate-50 rounded-[48px] border border-dashed border-slate-200">
              <Car size={56} className="mx-auto mb-6 text-slate-300" />
              <p className="font-black uppercase tracking-widest text-slate-400 text-sm">Aucun véhicule disponible pour le moment</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
