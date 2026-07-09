"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { X, Car, Users, Fuel, Settings, MapPin, Snowflake, Star } from "lucide-react";
import { fmt } from "@/shared/utils/format";

interface Vehicle {
  id: number;
  brand: string;
  model: string;
  image_url?: string;
  price_per_day: number;
  seats?: number;
  fuel_type?: string;
  transmission?: string;
  gps?: boolean;
  air_conditioning?: boolean;
  rating?: number;
  type?: string;
}

interface VehicleCompareProps {
  vehicles: Vehicle[];
  onRemove: (id: number) => void;
}

const SPECS = [
  { key: "brand",        label: "Marque",      icon: Car,        getValue: (v: Vehicle) => v.brand },
  { key: "model",        label: "Modèle",      icon: Car,        getValue: (v: Vehicle) => v.model },
  { key: "type",         label: "Type",         icon: Car,        getValue: (v: Vehicle) => v.type || "—" },
  { key: "price",        label: "Prix/Jour",    icon: Star,       getValue: (v: Vehicle) => `${fmt(v.price_per_day)} DH` },
  { key: "seats",        label: "Places",       icon: Users,      getValue: (v: Vehicle) => `${v.seats ?? 5} pers` },
  { key: "fuel",         label: "Carburant",    icon: Fuel,       getValue: (v: Vehicle) => v.fuel_type || "Diesel" },
  { key: "transmission", label: "Transmission", icon: Settings,   getValue: (v: Vehicle) => v.transmission || "Automatique" },
  { key: "gps",          label: "GPS",          icon: MapPin,     getValue: (v: Vehicle) => v.gps ? "Oui" : "Non" },
  { key: "ac",           label: "Climatisation", icon: Snowflake, getValue: (v: Vehicle) => v.air_conditioning ? "Oui" : "Non" },
  { key: "rating",       label: "Note",         icon: Star,       getValue: (v: Vehicle) => v.rating ? `${v.rating}/5` : "—" },
];

export default function VehicleCompare({ vehicles, onRemove }: VehicleCompareProps) {
  if (vehicles.length === 0) {
    return (
      <div className="text-center py-20 bg-surface-1 rounded-2xl border-2 border-border">
        <Car size={48} className="mx-auto mb-5 text-gold/30" />
        <h3 className="text-xl font-bold text-ink-1 mb-2 font-serif">Aucun véhicule à comparer</h3>
        <p className="text-sm text-ink-3">Ajoutez des véhicules depuis la flotte pour les comparer.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="min-w-[600px]">
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `180px repeat(${vehicles.length}, minmax(180px, 1fr))` }}
        >
          <div className="sticky left-0 z-10 bg-surface-0" />

          {vehicles.map((v) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative group"
            >
              <button
                onClick={() => onRemove(v.id)}
                className="absolute -top-2 -right-2 z-20 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                aria-label={`Retirer ${v.brand} ${v.model}`}
              >
                <X size={14} />
              </button>

              <div className="rounded-2xl border-2 border-border bg-surface-1 overflow-hidden hover:border-gold/40 transition-all">
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={v.image_url || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000&auto=format&fit=crop"}
                    alt={`${v.brand} ${v.model}`}
                    className="w-full h-full object-cover"
                    width={400}
                    height={250}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-0/80 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-sm font-bold text-ink-1 truncate">{v.brand}</p>
                    <p className="text-xs text-ink-3 truncate">{v.model}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          <div className="sticky left-0 z-10 bg-surface-0" />
          {SPECS.map((spec) => (
            <motion.div
              key={spec.key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="contents"
            >
              <div className="flex items-center gap-2 px-3 py-3 bg-surface-1 rounded-l-xl border-2 border-r-0 border-border sticky left-0 z-10">
                <spec.icon size={14} className="text-gold shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-3 whitespace-nowrap">
                  {spec.label}
                </span>
              </div>
              {vehicles.map((v) => (
                <div
                  key={`${spec.key}-${v.id}`}
                  className="flex items-center justify-center px-3 py-3 bg-surface-1 border-2 border-border text-sm font-semibold text-ink-1 last:rounded-r-xl"
                >
                  {spec.getValue(v)}
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
