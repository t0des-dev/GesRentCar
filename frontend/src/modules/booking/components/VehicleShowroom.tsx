"use client";

import { useState } from "react";
import { cn } from "@/shared/utils";
import { X, Rotate3d, ChevronRight } from "lucide-react";
import { DisplayVehicle } from "@/modules/booking/hooks/useBooking";

export function VehicleShowroom({ vehicle, onClose, onSelect }: { vehicle: DisplayVehicle; onClose: () => void; onSelect: () => void }) {
  const [is360, setIs360] = useState(false);
  
  if (!vehicle) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-surface-0 rounded-3xl w-full max-w-6xl relative z-10 overflow-hidden shadow-sm flex flex-col md:flex-row border border-border">
        
        {/* Left: Cinematic Visuals */}
        <div className="w-full md:w-3/5 h-[350px] md:h-[600px] relative bg-surface-2 overflow-hidden group">
          <div className={cn(
            "absolute inset-0 transition-all duration-700",
            is360 ? "scale-110 rotate-1" : "scale-100"
          )}>
            <img
              src={vehicle.img || "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=600"}
              alt={vehicle.model || ""}
              className={cn(
                "w-full h-full object-cover transition-transform duration-[10s] linear",
                is360 ? "scale-110" : ""
              )}
            />
          </div>

          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="bg-surface-0/90 backdrop-blur-sm text-ink-1 text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-sm">
                Showroom Vectoria
              </span>
              <button onClick={onClose} className="w-10 h-10 bg-surface-0/10 hover:bg-surface-0/20 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all border border-white/20">
                <X size={20} className="hover:rotate-90 transition-transform" />
              </button>
            </div>

            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setIs360(!is360)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-sm text-sm",
                  is360 
                    ? "bg-amber-500 text-ink-1" 
                    : "bg-surface-0/10 backdrop-blur-sm text-white border border-white/20 hover:bg-surface-0/20"
                )}
              >
                <Rotate3d size={18} />
                {is360 ? "Quitter Mode 360°" : "Activer Vue 360°"}
              </button>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
        </div>
        
        {/* Right: Premium Specs & Actions */}
        <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col bg-surface-0">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-px w-6 bg-primary"></span>
              <span className="text-primary font-semibold text-xs uppercase tracking-wider">{vehicle.type} Luxury</span>
            </div>
            <h2 className="text-3xl font-bold text-ink-1 leading-tight mb-1 tracking-tight">{vehicle.brand}</h2>
            <h3 className="text-xl text-ink-3 font-medium">{vehicle.model}</h3>
          </div>
          
          <div className="space-y-4 mb-8">
            <p className="text-ink-2 leading-relaxed italic border-l-4 border-border pl-5">
              &quot;{vehicle.desc}&quot;
            </p>
            
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(vehicle.specs || {}).map(([key, val]) => (
                <div key={key} className="bg-surface-1 p-4 rounded-xl border border-border/50">
                  <span className="block text-xs uppercase font-semibold text-ink-3 mb-1 tracking-wider">{key}</span>
                  <span className="font-semibold text-ink-1 text-sm">{val as string}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-border flex flex-col gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-ink-1">{vehicle.price}</span>
              <span className="text-ink-3 font-medium uppercase text-xs tracking-wider">DH / JOUR</span>
            </div>
            
            <button 
              onClick={() => { onSelect(); onClose(); }} 
              className="w-full bg-primary text-primary-foreground py-5 rounded-xl font-semibold shadow-sm hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Réserver ce modèle
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
