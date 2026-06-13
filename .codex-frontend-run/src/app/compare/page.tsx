"use client";

import { useCompare } from "@/hooks/useCompare";
import { useVehicles } from "@/hooks/useApi";
import { ArrowLeft, Check, X, Shield, Zap, Info, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const SPECS = [
  { key: "category", label: "Catégorie" },
  { key: "transmission", label: "Transmission" },
  { key: "fuel", label: "Carburant" },
  { key: "seats", label: "Places" },
  { key: "mileage", label: "Kilométrage" },
  { key: "price_per_day", label: "Prix / Jour", suffix: " MAD" },
];

export default function ComparePage() {
  const { selectedIds, removeFromCompare } = useCompare();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, isLoading } = useVehicles({ 
    ids: selectedIds,
    per_page: 3 
  });

  const vehicles = data?.data ?? [];

  if (!mounted) return null;

  if (selectedIds.length === 0) {
    return (
      <div className="min-h-screen pt-40 pb-20 flex flex-col items-center justify-center container mx-auto px-6">
        <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-8">
          <Info size={40} className="text-slate-400" />
        </div>
        <h1 className="text-3xl font-semibold text-slate-900 mb-4">Aucun véhicule sélectionné</h1>
        <p className="text-slate-500 text-center max-w-md mb-10">
          Sélectionnez jusqu'à 3 véhicules dans la flotte pour comparer leurs caractéristiques et tarifs.
        </p>
        <Link href="/fleet" className="btn-primary">
          Voir la flotte
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-20 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <Link href="/fleet" className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-4 group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Retour à la flotte
            </Link>
            <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight">Comparaison</h1>
          </div>
          <div className="hidden md:block">
            <span className="text-xs font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full">
              {selectedIds.length} / 3 véhicules
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 size={48} className="animate-spin text-primary" />
            <p className="text-slate-500 font-medium">Analyse des performances...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-0">
            {/* Labels column */}
            <div className="hidden md:flex flex-col pt-64">
              {SPECS.map((spec) => (
                <div key={spec.key} className="h-20 flex items-center px-6 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-[0.2em] bg-slate-50">
                  {spec.label}
                </div>
              ))}
            </div>

            {/* Vehicle columns */}
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="relative group flex flex-col border-x border-slate-100 first:border-l-0 last:border-r-0 md:border-b-0 border-b bg-white">
                <button
                  onClick={() => removeFromCompare(vehicle.id)}
                  className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-red-500 hover:text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 border border-slate-200"
                >
                  <X size={16} />
                </button>

                {/* Top: Image & Header */}
                <div className="p-6 md:p-8 flex flex-col items-center text-center">
                  <div className="h-48 w-full relative mb-6">
                    <img
                      src={vehicle.image_url || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop"}
                      alt={vehicle.model}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-[10px] font-semibold text-primary uppercase tracking-[0.2em] mb-1">{vehicle.brand}</p>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-6">{vehicle.model}</h3>
                  
                  <Link
                    href={`/booking?vehicle=${vehicle.id}`}
                    className="btn-primary w-full"
                  >
                    Louer ce véhicule
                    <Zap size={16} className="fill-white group-hover/btn:scale-125 transition-transform" />
                  </Link>
                </div>

                {/* Specs rows */}
                <div className="flex flex-col">
                  {SPECS.map((spec) => (
                    <div key={spec.key} className="h-20 flex flex-col md:flex-row items-center justify-center md:px-8 border-b border-slate-100">
                      <span className="md:hidden text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-1">{spec.label}</span>
                      <span className="text-base font-semibold text-slate-900">
                        {spec.key === 'price_per_day' ? (
                            <span className="text-xl font-semibold">{vehicle[spec.key as keyof typeof vehicle]}</span>
                        ) : (
                            vehicle[spec.key as keyof typeof vehicle] || '—'
                        )}
                        {spec.suffix}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bonus features */}
                <div className="p-8 bg-slate-50 flex-1">
                   <ul className="space-y-4">
                      <li className="flex items-start gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center shrink-0 mt-0.5">
                           <Check size={12} strokeWidth={4} />
                        </div>
                        <span className="font-medium text-slate-600">Assurance Premium incluse</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center shrink-0 mt-0.5">
                           <Check size={12} strokeWidth={4} />
                        </div>
                        <span className="font-medium text-slate-600">Kilométrage illimité</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                           <Shield size={12} strokeWidth={4} />
                        </div>
                        <span className="font-medium text-slate-600">Assistance 24/7 gratuite</span>
                      </li>
                   </ul>
                </div>
              </div>
            ))}

            {/* Add more column (if < 3) */}
            {vehicles.length < 3 && Array.from({ length: 3 - vehicles.length }).map((_, i) => (
               <div key={`empty-${i}`} className="hidden md:flex flex-col items-center justify-center border-l border-slate-100 bg-slate-50">
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 mb-4">
                     <span className="text-4xl">+</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em]">Ajouter un véhicule</p>
                  <Link href="/fleet" className="mt-6 text-primary font-semibold hover:underline">Voir la flotte</Link>
               </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
