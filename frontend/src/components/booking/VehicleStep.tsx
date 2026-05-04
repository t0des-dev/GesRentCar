"use client";

import { cn } from "@/lib/utils";
import { Car, Loader2, Maximize2, RotateCcw, ChevronRight, Users, Settings2, Fuel, Star } from "lucide-react";
import { BookingStepProps } from "@/types/booking";
import { motion, AnimatePresence } from "framer-motion";

interface VehicleStepProps extends BookingStepProps {
  isLoading: boolean;
  vehicles: any[];
  onPreview: (v: any) => void;
  onNext: () => void;
}

export default function VehicleStep({ booking, update, isLoading, vehicles, onPreview, onNext }: VehicleStepProps) {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 text-slate-400">
          <Loader2 className="animate-spin mb-6" size={48} strokeWidth={1} />
          <p className="text-xs font-black uppercase tracking-[0.3em]">Ouverture du showroom...</p>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-slate-300 bg-slate-50 rounded-[48px] border-2 border-dashed border-slate-100">
          <Car size={64} className="mb-6 opacity-20" />
          <p className="font-black uppercase tracking-widest text-sm">Aucun joyau disponible actuellement</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {vehicles.map((v, idx) => {
            const isSelected = booking.vehicleId === v.id;
            return (
              <motion.div 
                key={v.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "group relative bg-white rounded-[56px] overflow-hidden border transition-all duration-700", 
                  isSelected 
                    ? "md:col-span-2 border-primary/30 shadow-[0_40px_100px_rgba(var(--primary-rgb),0.15)] ring-1 ring-primary/20" 
                    : "border-slate-100 hover:border-slate-200 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
                )}
              >
                <div className={cn(
                  "flex flex-col",
                  isSelected ? "lg:flex-row" : "flex-col"
                )}>
                  {/* Image Section */}
                  <div className={cn(
                    "relative overflow-hidden cursor-pointer",
                    isSelected ? "lg:w-3/5 h-[450px]" : "h-72"
                  )} onClick={() => onPreview(v)}>
                    <img src={v.img} alt={v.model} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px]">
                      <button className="bg-white/90 backdrop-blur-md text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all">
                        Explorer à 360°
                      </button>
                    </div>

                    <div className="absolute top-8 left-8 flex gap-3">
                      <div className="bg-slate-900/80 backdrop-blur-md text-white px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.2em] border border-white/10">
                        {v.type}
                      </div>
                      {isSelected && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="bg-primary text-white px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/40"
                        >
                          ✓ Sélectionné
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className={cn(
                    "p-10 flex flex-col justify-between",
                    isSelected ? "lg:w-2/5 bg-slate-50/50" : "bg-white"
                  )}>
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        {[1,2,3,4,5].map(i => <Star key={i} size={10} className="fill-primary text-primary" />)}
                      </div>
                      <h3 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter mb-2 uppercase">
                        {v.brand} <span className="text-slate-400 font-bold">{v.model}</span>
                      </h3>
                      <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 opacity-80">
                        {v.desc}
                      </p>

                      <div className="grid grid-cols-3 gap-4 mb-10">
                        {[
                          { icon: Users, val: v.specs?.seats || 5, label: "PLACES" },
                          { icon: Settings2, val: v.specs?.transmission || "AUTO", label: "TRANS" },
                          { icon: Fuel, val: v.specs?.fuel || "DIESEL", label: "CARB" }
                        ].map((spec, i) => (
                          <div key={i} className="bg-white rounded-3xl p-4 flex flex-col items-center justify-center gap-2 border border-slate-100 shadow-sm">
                            <spec.icon size={16} className="text-primary" />
                            <span className="text-[9px] font-black text-slate-900 uppercase tracking-tighter">{spec.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Tarif Privilège</span>
                        <span className="text-3xl font-black text-slate-900 tracking-tighter">{v.price} <span className="text-sm text-slate-400 tracking-normal font-bold">DH/j</span></span>
                      </div>
                      
                      <div className="flex gap-4">
                        {isSelected ? (
                          <>
                            <button onClick={() => update("vehicleId", null)} className="flex-1 bg-white border border-slate-200 text-slate-400 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center gap-2">
                              <RotateCcw size={16} />
                              Changer
                            </button>
                            <button onClick={onNext} className="flex-[2] bg-primary text-white py-5 rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group/btn">
                              Confirmer le choix
                              <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                          </>
                        ) : (
                          <button onClick={() => update("vehicleId", v.id)} className="w-full bg-slate-900 text-white py-6 rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-primary transition-all shadow-xl hover:shadow-primary/30 flex items-center justify-center gap-3 group/btn">
                            <Car size={20} />
                            Sélectionner
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
