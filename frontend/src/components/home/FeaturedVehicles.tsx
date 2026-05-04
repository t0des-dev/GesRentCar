"use client";

import Link from "next/link";
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
    <section className="py-32 bg-secondary/5 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-24">
          <p className="text-primary font-black text-xs uppercase tracking-[0.2em] mb-4">Notre Collection</p>
          <h2 className="text-4xl md:text-5xl font-black mb-4">{t("featured_vehicles")}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
             <div className="col-span-3 flex justify-center py-16"><Loader2 size={48} className="animate-spin text-primary opacity-60" /></div>
          ) : vehicles.length > 0 ? (
            vehicles.map((v) => (
              <VehicleCard
                key={v.id}
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
            ))
          ) : (
            <div className="col-span-3 text-center py-16 text-muted-foreground">
              <Car size={56} className="mx-auto mb-4 opacity-20" />
              <p className="font-medium">Aucun véhicule vedette disponible.</p>
            </div>
          )}
        </div>
        <div className="text-center mt-16">
          <Link href="/fleet" className="inline-flex items-center gap-3 px-10 py-4 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all group">
            {t("btn_catalog")} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
