"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { X, Rotate3d, ChevronRight } from "lucide-react";

export function VehicleShowroom({ vehicle, onClose, onSelect }: { vehicle: any; onClose: () => void; onSelect: () => void }) {
  const [is360, setIs360] = useState(false);
  
  if (!vehicle) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl" onClick={onClose} />
      
      <div className="bg-white rounded-[48px] w-full max-w-6xl relative z-10 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row animate-in zoom-in-95 duration-500 border border-white/20">
        
        {/* Left: Cinematic Visuals */}
        <div className="w-full md:w-3/5 h-[350px] md:h-[650px] relative bg-slate-100 overflow-hidden group">
          <div className={cn(
            "absolute inset-0 transition-all duration-1000 ease-in-out",
            is360 ? "scale-125 rotate-2" : "scale-100"
          )}>
            <img 
              src={vehicle.img} 
              alt={vehicle.model} 
              className={cn(
                "w-full h-full object-cover transition-transform duration-[10s] linear infinite",
                is360 ? "animate-slow-zoom" : ""
              )}
            />
          </div>

          <div className="absolute inset-0 p-8 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-lg">
                Showroom Vectoria
              </span>
              <button onClick={onClose} className="w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all border border-white/20 group">
                <X size={24} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setIs360(!is360)}
                className={cn(
                  "flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all shadow-2xl",
                  is360 
                    ? "bg-amber-500 text-slate-900 scale-110" 
                    : "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20"
                )}
              >
                <Rotate3d size={20} />
                {is360 ? "Quitter Mode 360°" : "Activer Vue 360°"}
              </button>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
        </div>
        
        {/* Right: Premium Specs & Actions */}
        <div className="w-full md:w-2/5 p-8 md:p-14 flex flex-col bg-white">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-px w-8 bg-amber-500"></span>
              <span className="text-amber-600 font-black text-[10px] uppercase tracking-widest">{vehicle.type} Luxury</span>
            </div>
            <h2 className="text-5xl font-black text-slate-900 leading-tight mb-2 tracking-tighter">{vehicle.brand}</h2>
            <h3 className="text-2xl font-bold text-slate-400">{vehicle.model}</h3>
          </div>
          
          <div className="space-y-6 mb-12">
            <p className="text-slate-500 font-medium leading-relaxed italic border-l-4 border-slate-100 pl-6 text-lg">
              "{vehicle.desc}"
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(vehicle.specs).map(([key, val]) => (
                <div key={key} className="bg-slate-50 p-5 rounded-[24px] border border-slate-100/50 hover:bg-white hover:border-amber-200 transition-all group">
                  <span className="block text-[9px] uppercase font-black text-slate-400 mb-1 tracking-widest group-hover:text-amber-500 transition-colors">{key}</span>
                  <span className="font-black text-slate-900 text-sm">{val as string}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-10 border-t border-slate-100 flex flex-col gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900">{vehicle.price}</span>
              <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">DH / JOUR</span>
            </div>
            
            <button 
              onClick={() => { onSelect(); onClose(); }} 
              className="w-full bg-slate-900 text-white py-6 rounded-[24px] font-black text-lg shadow-2xl hover:bg-primary transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
            >
              Réserver ce modèle
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
