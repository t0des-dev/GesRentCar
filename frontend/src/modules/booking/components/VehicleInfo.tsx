"use client";

import { Users, Fuel, Settings, ShieldCheck } from "lucide-react";
import { Vehicle } from "@/lib/api/vehicles";

interface VehicleInfoProps {
  vehicle: Vehicle;
  image: string;
}

export default function VehicleInfo({ vehicle, image }: VehicleInfoProps) {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl overflow-hidden border border-border">
        <img src={image} alt={vehicle.model} className="w-full h-[400px] object-cover" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="flex items-center gap-3 bg-surface-1 p-4 rounded-2xl border border-border">
          <Users size={20} className="text-primary shrink-0" />
          <span className="text-sm font-medium text-ink-1">{vehicle.seats || 5} Places</span>
        </div>
        <div className="flex items-center gap-3 bg-surface-1 p-4 rounded-2xl border border-border">
          <Fuel size={20} className="text-primary shrink-0" />
          <span className="text-sm font-medium text-ink-1">{vehicle.fuel_type || "Diesel / Hybride"}</span>
        </div>
        <div className="flex items-center gap-3 bg-surface-1 p-4 rounded-2xl border border-border">
          <Settings size={20} className="text-primary shrink-0" />
          <span className="text-sm font-medium text-ink-1">{vehicle.transmission || "Automatique"}</span>
        </div>
        <div className="flex items-center gap-3 bg-surface-1 p-4 rounded-2xl border border-border">
          <ShieldCheck size={20} className="text-primary shrink-0" />
          <span className="text-sm font-medium text-ink-1">Assurance Premium</span>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-ink-1 tracking-tight">L&apos;Expérience {vehicle.brand}</h2>
        <p className="text-ink-2 leading-relaxed">
          La {vehicle.brand} {vehicle.model} redéfinit les standards de l&apos;excellence automobile. 
          Chaque courbe de sa carrosserie et chaque détail de son habitacle ont été conçus pour offrir 
          une expérience de conduite immersive et luxueuse.           Profitez d&apos;un confort souverain pour vos longs trajets au Maroc.
        </p>
      </div>
    </div>
  );
}
