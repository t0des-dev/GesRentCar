"use client";

import Image from "next/image";
import { cn } from "@/shared/utils";
import { Car, Loader2, RotateCcw, ChevronRight, Users, Settings2, Fuel, Star } from "lucide-react";
import { BookingStepProps } from "@/types/booking";
import { DisplayVehicle } from "@/modules/booking/hooks/useBooking";
import { motion } from "framer-motion";

interface VehicleStepProps extends BookingStepProps {
  isLoading: boolean;
  vehicles: DisplayVehicle[];
  onPreview: (v: DisplayVehicle) => void;
  onNext: () => void;
}

export default function VehicleStep({ booking, update, isLoading, vehicles, onPreview: _onPreview, onNext }: VehicleStepProps) {
  return (
    <div className="space-y-8">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-ink-3">
          <Loader2 className="animate-spin mb-4" size={36} strokeWidth={1} />
          <p className="text-xs font-semibold uppercase tracking-wider">Ouverture du showroom...</p>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-ink-4 bg-surface-1 rounded-3xl border-2 border-dashed border-border">
          <Car size={48} className="mb-4 opacity-20" />
          <p className="font-semibold uppercase tracking-wider text-sm">Aucun joyau disponible actuellement</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vehicles.map((v, idx) => {
            const isSelected = booking.vehicleId === v.id;
            return (
              <motion.div 
                key={v.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "group relative bg-surface-0 rounded-3xl overflow-hidden border transition-all duration-500", 
                  isSelected 
                    ? "md:col-span-2 border-primary/30 shadow-sm ring-1 ring-primary/20" 
                    : "border-border/80 hover:border-border hover:shadow-sm"
                )}
              >
                <div className={cn(
                  "flex flex-col",
                  isSelected ? "lg:flex-row" : "flex-col"
                )}>
                  {/* Image Section */}
                  <div className={cn(
                    "relative overflow-hidden",
                    isSelected ? "lg:w-3/5 h-[400px]" : "h-64"
                  )}>
                    <Image src={v.img || "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=600"} alt={v.model || ""} width={800} height={500} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
                    
                    <div className="absolute top-6 left-6 flex gap-2">
                      <span className="bg-surface-0/90 backdrop-blur-sm text-ink-1 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                        {v.type}
                      </span>
                      {isSelected && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm"
                        >
                          ✓ Sélectionné
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className={cn(
                    "p-8 flex flex-col justify-between",
                    isSelected ? "lg:w-2/5 bg-surface-1/50" : ""
                  )}>
                    <div>
                      <div className="flex items-center gap-1 mb-3">
                        {[1,2,3,4,5].map(i => <Star key={i} size={10} className="fill-primary text-primary" />)}
                      </div>
                      <h3 className="text-2xl font-bold text-ink-1 tracking-tight mb-1 uppercase">
                        {v.brand} <span className="text-ink-3 font-medium">{v.model}</span>
                      </h3>
                      <p className="text-sm text-ink-2 leading-relaxed mb-6">
                        {v.desc}
                      </p>

                      <div className="grid grid-cols-3 gap-3 mb-8">
                        {[
                          { icon: Users, val: v.specs?.seats || 5, label: "PLACES" },
                          { icon: Settings2, val: v.specs?.transmission || "AUTO", label: "TRANS" },
                          { icon: Fuel, val: v.specs?.fuel || "DIESEL", label: "CARB" }
                        ].map((spec, i) => (
                          <div key={i} className="bg-surface-1 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 border border-border">
                            <spec.icon size={14} className="text-primary" />
                            <span className="text-xs font-semibold text-ink-1 uppercase">{spec.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-ink-3 font-semibold text-xs uppercase tracking-wider">Tarif Privilège</span>
                        <span className="text-2xl font-bold text-ink-1 tracking-tight">{v.price} <span className="text-sm text-ink-3 font-medium">DH/j</span></span>
                      </div>
                      
                      <div className="flex gap-3">
                        {isSelected ? (
                          <>
                            <button onClick={() => update("vehicleId", null)} className="flex-1 bg-surface-0 border border-border text-ink-3 py-4 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center gap-2">
                              <RotateCcw size={14} />
                              Changer
                            </button>
                            <button onClick={onNext} className="flex-[2] bg-primary text-primary-foreground py-4 rounded-xl text-xs font-semibold uppercase tracking-wider shadow-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                              Confirmer le choix
                              <ChevronRight size={16} />
                            </button>
                          </>
                        ) : (
                          <button onClick={() => update("vehicleId", v.id)} className="w-full bg-primary text-primary-foreground py-5 rounded-xl text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-sm flex items-center justify-center gap-2">
                            <Car size={18} />
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
