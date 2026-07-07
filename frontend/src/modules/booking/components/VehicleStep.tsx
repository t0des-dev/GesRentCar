"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/shared/utils";
import { Car, Loader2, ChevronRight, Users, Settings2, Fuel, Star, ArrowLeft, Info } from "lucide-react";
import { calculatePrice } from "@/shared/utils/pricing";
import { fmt } from "@/shared/utils/format";
import { BookingStepProps } from "@/types/booking";
import { DisplayVehicle } from "@/modules/booking/hooks/useBooking";
import { motion } from "framer-motion";

interface VehicleStepProps extends BookingStepProps {
  isLoading: boolean;
  vehicles: DisplayVehicle[];
  onNext: () => void;
}

export default function VehicleStep({ booking, update, isLoading, vehicles, onNext }: VehicleStepProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleSelect = (v: DisplayVehicle) => {
    update("vehicleId", v.id);
    setExpandedId(v.id);
  };

  const handleBack = () => {
    setExpandedId(null);
    update("vehicleId", null);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-ink-3">
        <Loader2 className="animate-spin mb-4" size={36} strokeWidth={1} />
        <p className="text-xs font-semibold uppercase tracking-wider">Ouverture du showroom...</p>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-ink-4 bg-surface-1 rounded-3xl border-2 border-dashed border-border">
        <Car size={48} className="mb-4 opacity-20" />
        <p className="font-semibold uppercase tracking-wider text-sm">Aucun joyau disponible actuellement</p>
      </div>
    );
  }

  const selectedVehicle = expandedId ? vehicles.find((v) => v.id === expandedId) : null;

  const pricingEstimate = selectedVehicle
    ? calculatePrice({
        pricePerDay: selectedVehicle.price,
        days: 1,
        startDate: "",
        flexibility: "best_price",
        mileage: "limited",
      })
    : null;

  return (
    <div className="space-y-8">
      {expandedId === null ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {vehicles.map((v, idx) => {
            const isSelected = booking.vehicleId === v.id;
            return (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  "group relative bg-surface-0 rounded-3xl overflow-hidden border transition-all duration-500 flex flex-col",
                  isSelected
                    ? "border-primary/30 shadow-sm ring-1 ring-primary/20"
                    : "border-border/80 hover:border-border hover:shadow-sm"
                )}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={v.img || "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=600"}
                    alt={v.model || ""}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-surface-0/90 backdrop-blur-sm text-ink-1 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider">
                      {v.type}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider shadow-sm">
                      ✓ Sélectionné
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={9} className="fill-primary text-primary" />
                    ))}
                  </div>
                  <h3 className="text-lg font-bold text-ink-1 tracking-tight mb-1 uppercase">
                    {v.brand} <span className="text-ink-3 font-medium">{v.model}</span>
                  </h3>
                  <p className="text-xs text-ink-2 leading-relaxed mb-4 line-clamp-2">{v.desc}</p>

                  <div className="grid grid-cols-3 gap-2 mb-5">
                    {[
                      { icon: Users, val: v.specs?.seats || 5, label: "PLACES" },
                      { icon: Settings2, val: v.specs?.transmission || "AUTO", label: "TRANS" },
                      { icon: Fuel, val: v.specs?.fuel || "DIESEL", label: "CARB" },
                    ].map((spec, i) => (
                      <div key={i} className="bg-surface-1 rounded-xl p-2.5 flex flex-col items-center justify-center gap-1 border border-border">
                        <spec.icon size={12} className="text-primary" />
                        <span className="text-[10px] font-semibold text-ink-1 uppercase">{spec.val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-ink-3 text-[10px] font-semibold uppercase tracking-wider">Tarif privilège</span>
                      <span className="text-xl font-bold text-ink-1">
                        {v.price} <span className="text-xs text-ink-3 font-medium">DH/j</span>
                      </span>
                    </div>
                    <button
                      onClick={() => handleSelect(v)}
                      className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <Car size={16} />
                      Sélectionner
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : selectedVehicle ? (
        <motion.div
          key={selectedVehicle.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="bg-surface-0 rounded-3xl overflow-hidden border border-primary/20 shadow-lg"
        >
          <div className="flex flex-col lg:flex-row">
            <div className="relative lg:w-3/5 h-[300px] lg:h-[500px] overflow-hidden">
              <Image
                src={selectedVehicle.img || "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=600"}
                alt={selectedVehicle.model || ""}
                width={1200}
                height={800}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              <div className="absolute top-6 left-6 flex items-center gap-3">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-white/20 transition-all border border-white/20"
                >
                  <ArrowLeft size={14} />
                  Retour
                </button>
                <span className="bg-white/90 text-ink-1 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider shadow-sm">
                  {selectedVehicle.type}
                </span>
              </div>
            </div>

            <div className="lg:w-2/5 p-8 lg:p-10 flex flex-col bg-surface-0">
              <div className="mb-6">
                <span className="text-primary font-semibold text-[10px] uppercase tracking-[0.2em]">Showroom Vectoria</span>
                <h2 className="text-2xl lg:text-3xl font-bold text-ink-1 tracking-tight mt-1 uppercase">
                  {selectedVehicle.brand} <span className="text-ink-3 font-medium">{selectedVehicle.model}</span>
                </h2>
                <p className="text-sm text-ink-2 leading-relaxed mt-3 italic border-l-4 border-primary/30 pl-4">
                  &ldquo;{selectedVehicle.desc}&rdquo;
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { icon: Users, val: selectedVehicle.specs?.seats || 5, label: "PLACES" },
                  { icon: Settings2, val: selectedVehicle.specs?.transmission || "AUTO", label: "TRANSMISSION" },
                  { icon: Fuel, val: selectedVehicle.specs?.fuel || "DIESEL", label: "CARBURANT" },
                ].map((spec, i) => (
                  <div key={i} className="bg-surface-1 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border border-border">
                    <spec.icon size={16} className="text-primary" />
                    <span className="text-xs font-bold text-ink-1">{spec.val}</span>
                    <span className="text-[9px] text-ink-3 font-semibold uppercase tracking-wider">{spec.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-border space-y-4">
                <div className="bg-surface-1 rounded-2xl p-5 space-y-3 border border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-ink-3 text-xs font-semibold uppercase tracking-wider">Prix par jour</span>
                    <span className="text-lg font-bold text-ink-1">{fmt(selectedVehicle.price)} <span className="text-xs text-ink-3 font-medium">DH</span></span>
                  </div>
                  {pricingEstimate && (
                    <>
                      <div className="h-px bg-border" />
                      <div className="flex items-center justify-between">
                        <span className="text-ink-3 text-xs font-semibold uppercase tracking-wider">Total estimé (1 jour)</span>
                        <span className="text-2xl font-bold text-primary">{fmt(pricingEstimate.total)} <span className="text-xs text-ink-3 font-medium">DH</span></span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-ink-4 text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1">
                          <Info size={10} />
                          Dont caution (10%)
                        </span>
                        <span className="text-sm font-bold text-ink-2">{fmt(pricingEstimate.deposit)} DH</span>
                      </div>
                      {pricingEstimate.dynamicReason && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 flex items-center gap-2">
                          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                            {pricingEstimate.dynamicReason}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <button
                  onClick={onNext}
                  className="w-full bg-primary text-primary-foreground py-5 rounded-xl font-semibold shadow-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
                >
                  Réserver ce véhicule
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}
