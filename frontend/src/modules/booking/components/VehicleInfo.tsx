"use client";

import { Users, Fuel, Settings, ShieldCheck } from "lucide-react";

interface VehicleInfoProps {
  vehicle: any;
  image: string;
}

export default function VehicleInfo({ vehicle, image }: VehicleInfoProps) {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl overflow-hidden border border-slate-100">
        <img src={image} alt={vehicle.model} className="w-full h-[400px] object-cover" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <Users size={20} className="text-primary shrink-0" />
          <span className="text-sm font-medium text-slate-900">{vehicle.seats || 5} Places</span>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <Fuel size={20} className="text-primary shrink-0" />
          <span className="text-sm font-medium text-slate-900">{vehicle.fuel_type || "Diesel / Hybride"}</span>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <Settings size={20} className="text-primary shrink-0" />
          <span className="text-sm font-medium text-slate-900">{vehicle.transmission || "Automatique"}</span>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <ShieldCheck size={20} className="text-primary shrink-0" />
          <span className="text-sm font-medium text-slate-900">Assurance Premium</span>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">L'Expérience {vehicle.brand}</h2>
        <p className="text-slate-500 leading-relaxed">
          La {vehicle.brand} {vehicle.model} redéfinit les standards de l'excellence automobile. 
          Chaque courbe de sa carrosserie et chaque détail de son habitacle ont été conçus pour offrir 
          une expérience de conduite immersive et luxueuse. Profitez d'un confort souverain pour vos longs trajets au Maroc.
        </p>
      </div>
    </div>
  );
}
