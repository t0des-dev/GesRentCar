"use client";

import { cn } from "@/lib/utils";
import { Car, Loader2, Maximize2, RotateCcw, ChevronRight, Users, Settings2, Fuel } from "lucide-react";
import { BookingStepProps } from "@/types/booking";

interface VehicleStepProps extends BookingStepProps {
  isLoading: boolean;
  vehicles: any[];
  onPreview: (v: any) => void;
  onNext: () => void;
}

export default function VehicleStep({ booking, update, isLoading, vehicles, onPreview, onNext }: VehicleStepProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
      {isLoading ? (
        <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="animate-spin mb-4" size={32} />
          <p>Chargement des véhicules disponibles...</p>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center py-20 text-slate-400">
          <Car size={48} className="mb-4 opacity-50" />
          <p>Aucun véhicule disponible pour le moment.</p>
        </div>
      ) : (
        vehicles
          .filter(v => !booking.vehicleId || booking.vehicleId === v.id)
          .map((v) => (
            <div key={v.id} className={cn(
              "bg-white rounded-[40px] overflow-hidden border border-slate-100 transition-all duration-700 relative group", 
              booking.vehicleId === v.id 
                ? "ring-8 ring-primary/5 md:col-span-2 max-w-2xl mx-auto w-full shadow-2xl scale-[1.02] border-primary/20" 
                : "hover:shadow-xl hover:border-slate-200 hover:-translate-y-1"
            )}>
              <div className={cn("relative cursor-pointer overflow-hidden", booking.vehicleId === v.id ? "h-80" : "h-56")} onClick={() => onPreview(v)}>
                <img src={v.img} alt={v.model} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out" />
                
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                  <button className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-sm shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex items-center gap-2">
                    <Maximize2 size={18} />
                    Voir Détails 360°
                  </button>
                </div>

                {booking.vehicleId === v.id && (
                  <div className="absolute top-6 left-6 bg-primary text-white px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 animate-in fade-in zoom-in duration-500">
                    ✓ Sélectionné
                  </div>
                )}

                <div className="absolute bottom-6 right-6 glass-dark px-4 py-2 rounded-2xl border border-white/20">
                  <span className="text-white font-black text-lg">{v.price} <span className="text-[10px] opacity-60">DH/j</span></span>
                </div>
              </div>

              <div className="p-8">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">{v.type}</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{v.brand} <span className="text-slate-400 font-bold">{v.model}</span></h3>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-8">
                  <div className="bg-slate-50 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 border border-slate-100">
                    <Users size={16} className="text-slate-400" />
                    <span className="text-[10px] font-black text-slate-900">{v.specs?.seats || 5} PLACES</span>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 border border-slate-100">
                    <Settings2 size={16} className="text-slate-400" />
                    <span className="text-[10px] font-black text-slate-900 uppercase">{v.specs?.transmission || "AUTO"}</span>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 border border-slate-100">
                    <Fuel size={16} className="text-slate-400" />
                    <span className="text-[10px] font-black text-slate-900 uppercase">{v.specs?.fuel || "DIESEL"}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {booking.vehicleId === v.id ? (
                    <>
                      <button onClick={() => update("vehicleId", null)} className="flex-1 bg-slate-100 text-slate-500 py-5 rounded-[20px] font-black text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center gap-2">
                        <RotateCcw size={16} />
                        Annuler
                      </button>
                      <button onClick={onNext} className="flex-[2] bg-slate-900 text-white py-5 rounded-[20px] font-black text-xs uppercase tracking-widest shadow-2xl shadow-slate-900/30 hover:bg-primary transition-all flex items-center justify-center gap-2 group/btn">
                        Confirmer & Continuer
                        <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </>
                  ) : (
                    <button onClick={() => update("vehicleId", v.id)} className="w-full bg-slate-900 text-white py-5 rounded-[20px] font-black text-xs uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl hover:shadow-primary/30 flex items-center justify-center gap-3">
                      <Car size={18} />
                      Réserver ce modèle
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
      )}
    </div>
  );
}
