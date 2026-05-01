"use client";

import { useState } from "react";
import { Scale, X, Zap, Shield, Crown, Star, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface VehicleSpec {
  name: string;
  value: number; // 0-100
  label: string;
}

const VEHICLES = [
  { id: "1", brand: "Rolls-Royce", model: "Ghost", image: "https://images.unsplash.com/photo-1631214524020-5e1839762691?q=80&w=800&auto=format&fit=crop", specs: [
    { name: "prestige", value: 100, label: "Luxe Absolu" },
    { name: "comfort", value: 98, label: "Confort Royal" },
    { name: "performance", value: 85, label: "V12 Silencieux" }
  ]},
  { id: "2", brand: "Range Rover", model: "Autobiography", image: "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?q=80&w=800&auto=format&fit=crop", specs: [
    { name: "prestige", value: 90, label: "Status Icon" },
    { name: "comfort", value: 95, label: "Tout-Terrain" },
    { name: "performance", value: 80, label: "V8 Puissant" }
  ]},
  { id: "3", brand: "Porsche", model: "911 Carrera", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop", specs: [
    { name: "prestige", value: 88, label: "Icône Sport" },
    { name: "comfort", value: 70, label: "GT Sportive" },
    { name: "performance", value: 98, label: "Précision Allemande" }
  ]},
];

export default function VehicleComparator() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleVehicle = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else if (selectedIds.length < 2) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const vehiclesToCompare = VEHICLES.filter(v => selectedIds.includes(v.id));

  return (
    <section className="py-32 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            <Scale size={14} />
            Le Garage Comparateur
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">Confrontez l'Excellence.</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Choisissez deux modèles pour comparer leur ADN et trouver celui qui correspond à votre prochain voyage.</p>
        </div>

        {/* Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {VEHICLES.map((v) => (
            <button 
              key={v.id}
              onClick={() => toggleVehicle(v.id)}
              className={cn(
                "relative group rounded-[32px] overflow-hidden aspect-video transition-all duration-500",
                selectedIds.includes(v.id) ? "ring-4 ring-primary ring-offset-4" : "opacity-70 hover:opacity-100"
              )}
            >
              <img src={v.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-left">
                <p className="text-white font-black text-xl">{v.brand} {v.model}</p>
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest">
                  {selectedIds.includes(v.id) ? "Sélectionné" : "Comparer"}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Comparison Result */}
        {selectedIds.length === 2 ? (
          <div className="bg-white rounded-[48px] p-8 md:p-16 shadow-2xl animate-in fade-in slide-in-from-bottom-12 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
              
              {/* Vehicle A */}
              <div className="text-center md:text-right space-y-8">
                <h3 className="text-3xl font-black text-slate-900">{vehiclesToCompare[0].brand}</h3>
                <div className="space-y-6">
                  {vehiclesToCompare[0].specs.map((s) => (
                    <div key={s.name} className="space-y-2">
                      <div className="flex justify-between md:justify-end gap-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                        <span>{s.label}</span>
                        <span className="text-slate-900">{s.value}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${s.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* VS Divider */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-xl border-4 border-slate-50 relative z-10">
                  VS
                </div>
                <div className="w-px h-full bg-slate-100 absolute" />
              </div>

              {/* Vehicle B */}
              <div className="text-center md:text-left space-y-8">
                <h3 className="text-3xl font-black text-slate-900">{vehiclesToCompare[1].brand}</h3>
                <div className="space-y-6">
                  {vehiclesToCompare[1].specs.map((s) => (
                    <div key={s.name} className="space-y-2">
                      <div className="flex justify-between gap-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                        <span className="text-slate-900">{s.value}%</span>
                        <span>{s.label}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${s.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="bg-slate-100 border-2 border-dashed border-slate-200 rounded-[48px] py-20 text-center">
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em]">Sélectionnez deux véhicules pour lancer le duel</p>
          </div>
        )}
      </div>
    </section>
  );
}
