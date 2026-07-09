"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  X,
  Plus,
  Trash2,
  Car,
  CreditCard,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/shared/utils";
import { fmt } from "@/shared/utils/format";

interface VehicleOption {
  id: number;
  name: string;
  pricePerDay: number;
  image?: string;
}

interface SelectedVehicle {
  vehicle: VehicleOption;
  startDate: string;
  endDate: string;
}

const MOCK_VEHICLES: VehicleOption[] = [
  { id: 1, name: "Renault Clio 2024", pricePerDay: 350 },
  { id: 2, name: "Dacia Duster 2024", pricePerDay: 500 },
  { id: 3, name: "Peugeot 308 2024", pricePerDay: 450 },
  { id: 4, name: "Toyota Yaris 2024", pricePerDay: 400 },
  { id: 5, name: "Volkswagen Golf 2024", pricePerDay: 550 },
];

export default function MultiVehicleBooking() {
  const [selected, setSelected] = useState<SelectedVehicle[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  const total = useMemo(() => {
    return selected.reduce((sum, s) => {
      const start = new Date(s.startDate);
      const end = new Date(s.endDate);
      const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
      return sum + s.vehicle.pricePerDay * days;
    }, 0);
  }, [selected]);

  const handleAddVehicle = (vehicle: VehicleOption) => {
    if (selected.some(s => s.vehicle.id === vehicle.id)) return;
    const today = new Date().toISOString().split("T")[0];
    const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];
    setSelected(prev => [...prev, { vehicle, startDate: today, endDate: nextWeek }]);
    setShowPicker(false);
  };

  const handleRemove = (vehicleId: number) => {
    setSelected(prev => prev.filter(s => s.vehicle.id !== vehicleId));
  };

  const handleDateChange = (vehicleId: number, field: "startDate" | "endDate", value: string) => {
    setSelected(prev => prev.map(s =>
      s.vehicle.id === vehicleId ? { ...s, [field]: value } : s
    ));
  };

  const handleBookAll = () => {
    alert(`Réservation de ${selected.length} véhicule(s) pour ${fmt(total)} DH`);
  };

  return (
    <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Car size={18} className="text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-ink-1 uppercase tracking-wider text-sm">Réservation Multiple</h3>
            <p className="text-[10px] text-ink-3 font-bold uppercase tracking-widest">{selected.length} véhicule(s) sélectionné(s)</p>
          </div>
        </div>
        <button
          onClick={() => setShowPicker(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors"
        >
          <Plus size={14} />
          Ajouter
        </button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {selected.map((s) => {
            const start = new Date(s.startDate);
            const end = new Date(s.endDate);
            const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
            const subtotal = s.vehicle.pricePerDay * days;

            return (
              <motion.div
                key={s.vehicle.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-4 rounded-xl border border-border bg-surface-0 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center">
                      <Car size={14} className="text-ink-3" />
                    </div>
                    <div>
                      <p className="font-bold text-ink-1 text-sm">{s.vehicle.name}</p>
                      <p className="text-[10px] text-ink-3 font-bold uppercase tracking-widest">{s.vehicle.pricePerDay} DH/jour</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(s.vehicle.id)}
                    className="p-2 rounded-lg text-ink-3 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-ink-3 uppercase tracking-widest mb-1 block">Début</label>
                    <input
                      type="date"
                      value={s.startDate}
                      onChange={(e) => handleDateChange(s.vehicle.id, "startDate", e.target.value)}
                      className="w-full px-3 py-2 bg-surface-1 border border-border rounded-lg text-xs text-ink-1 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-ink-3 uppercase tracking-widest mb-1 block">Fin</label>
                    <input
                      type="date"
                      value={s.endDate}
                      onChange={(e) => handleDateChange(s.vehicle.id, "endDate", e.target.value)}
                      className="w-full px-3 py-2 bg-surface-1 border border-border rounded-lg text-xs text-ink-1 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="mt-2 text-right">
                  <span className="text-[10px] font-bold text-ink-3 uppercase tracking-widest">{days} jour(s) · </span>
                  <span className="text-sm font-black text-primary">{fmt(subtotal)} DH</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {selected.length === 0 && (
        <div className="py-12 text-center border-2 border-dashed border-border rounded-xl">
          <Car size={32} className="mx-auto text-ink-3/30 mb-3" />
          <p className="text-ink-3 text-sm font-bold">Aucun véhicule sélectionné</p>
          <p className="text-[10px] text-ink-3 font-bold uppercase tracking-widest mt-1">Cliquez sur &quot;Ajouter&quot; pour commencer</p>
        </div>
      )}

      {selected.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-ink-3 uppercase tracking-widest">Total estimé</span>
            <span className="text-xl font-black text-ink-1">{fmt(total)} <span className="text-[10px] text-ink-3">DH</span></span>
          </div>
          <button
            onClick={handleBookAll}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors"
          >
            <CreditCard size={14} />
            Réserver tout ({selected.length})
          </button>
        </div>
      )}

      <AnimatePresence>
        {showPicker && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-ink-1/50 backdrop-blur-sm" onClick={() => setShowPicker(false)} />
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-ink-1 uppercase tracking-wider text-sm">Choisir un véhicule</h3>
                <button onClick={() => setShowPicker(false)} className="p-1.5 rounded-lg text-ink-3 hover:text-ink-2 hover:bg-surface-2 transition-colors">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {MOCK_VEHICLES.map(v => {
                  const isAdded = selected.some(s => s.vehicle.id === v.id);
                  return (
                    <button
                      key={v.id}
                      onClick={() => handleAddVehicle(v)}
                      disabled={isAdded}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                        isAdded ? "border-surface-2 bg-surface-1 opacity-50 cursor-not-allowed" : "border-border hover:border-primary/30 hover:bg-primary/5"
                      )}
                    >
                      <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center shrink-0">
                        <Car size={16} className="text-ink-3" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-ink-1 text-sm">{v.name}</p>
                        <p className="text-[10px] text-ink-3 font-bold uppercase tracking-widest">{v.pricePerDay} DH/jour</p>
                      </div>
                      {isAdded && <CheckCircle size={16} className="text-emerald-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
