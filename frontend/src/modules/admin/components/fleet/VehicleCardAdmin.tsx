"use client";

import { motion } from "framer-motion";
import { Car, Camera, Star, Fuel, TrendingUp, Edit, Trash2, Loader2, ShieldAlert, Wrench, Activity } from "lucide-react";
import { cn } from "@/shared/utils";
import { Vehicle } from "@/types/admin";
import Link from "next/link";
import api from "@/shared/services/client";

interface VehicleCardAdminProps {
  vehicle: Vehicle;
  idx: number;
  onEdit: (v: Vehicle) => void;
  onDelete: (id: number) => void;
  onHistory: (id: number) => void; // Keep for compatibility if used elsewhere, but we'll prefer the Link
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>, id: number) => void;
  deletingId: number | null;
  isSelected?: boolean;
  onSelect?: (id: number) => void;
}

export default function VehicleCardAdmin({
  vehicle,
  idx,
  onEdit,
  onDelete,
  onImageUpload,
  deletingId,
  isSelected = false,
  onSelect
}: VehicleCardAdminProps) {
  const roi = (vehicle.total_revenue || 0) - (vehicle.total_maintenance_cost || 0);
  const isStar = roi > 50000;

  const checkExpiry = (dateStr?: string) => {
    if (!dateStr) return 0;
    const days = (new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
    if (days < 0) return 100; // Expired = 100% danger
    if (days > 365) return 0;
    return Math.max(0, 100 - (days / 30) * 100); // 30 days = 0 danger, 0 days = 100 danger
  };

  const insDanger = checkExpiry(vehicle.insurance_date);
  const techDanger = checkExpiry(vehicle.tech_inspection_date);
  const vigDanger = checkExpiry(vehicle.vignette_date);

  const handleKillSwitch = async () => {
    if (!confirm("Passer ce véhicule en maintenance d'urgence ?")) return;
    try {
      await api.put(`/vehicles/${vehicle.id}`, { status: 'maintenance' });
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: idx * 0.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "bg-surface-0 rounded-2xl border-2 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group relative",
        isSelected ? "border-primary shadow-primary/20" : "border-border/60 hover:border-primary/50"
      )}
    >
      <div className="h-64 relative overflow-hidden bg-surface-1">
        {onSelect && (
          <div className="absolute top-4 left-4 z-20">
            <input 
              type="checkbox" 
              checked={isSelected}
              onChange={() => onSelect(vehicle.id!)}
              className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer shadow-sm backdrop-blur-md bg-white/50"
            />
          </div>
        )}

        {vehicle.image_url ? (
          <div className="w-full h-full relative">
            <img src={`${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api").replace("/api", "")}${vehicle.image_url}`} alt={vehicle.model} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-80" />
          </div>
        ) : (
          <div className="w-full h-full bg-surface-1 flex items-center justify-center text-ink-3">
            <Car size={80} strokeWidth={0.5} />
          </div>
        )}

        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
          <span className={cn(
            "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg backdrop-blur-md border border-white/20",
            vehicle.status === 'available' ? 'bg-emerald-500/90 text-white' :
            vehicle.status === 'rented' ? 'bg-blue-500/90 text-white' :
            'bg-amber-500/90 text-white'
          )}>
            {vehicle.status === 'available' ? 'Disponible' : vehicle.status === 'rented' ? 'En Location' : 'Maintenance'}
          </span>
          {vehicle.status !== 'maintenance' && (
            <button 
              onClick={handleKillSwitch}
              title="Passer en maintenance d'urgence"
              className="w-8 h-8 rounded-full bg-red-500/80 backdrop-blur-md text-white flex items-center justify-center hover:bg-red-600 transition shadow-lg border border-white/20 cursor-pointer"
            >
              <ShieldAlert size={14} />
            </button>
          )}
        </div>

        {isStar && (
          <div className={cn(
            "absolute left-4 bg-amber-500/90 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg z-20",
            onSelect ? "top-12" : "top-4"
          )}>
            <Star size={12} fill="currentColor" />
            Top Perf
          </div>
        )}

        <label className="absolute inset-0 flex items-center justify-center cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
           <input type="file" hidden onChange={e => onImageUpload(e, vehicle.id!)} />
           <Camera size={24} className="text-white drop-shadow-md" />
        </label>

        {/* Health Rings at the bottom of the image */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex items-end justify-between">
            <div className="text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 block drop-shadow-md">{vehicle.category || 'EXCELLENCE'}</span>
                <h3 className="text-2xl font-black drop-shadow-lg">{vehicle.brand} <span className="text-primary font-bold italic">{vehicle.model}</span></h3>
            </div>
            <div className="flex gap-2">
                {[
                  { label: "ASS", val: insDanger },
                  { label: "VIG", val: vigDanger },
                  { label: "V.T", val: techDanger }
                ].map((ring, i) => (
                    <div key={i} className="flex flex-col items-center justify-center gap-1">
                        <div className="w-6 h-6 rounded-full border-[3px] flex items-center justify-center bg-black/50 backdrop-blur-sm" style={{ 
                            borderColor: ring.val > 80 ? '#ef4444' : ring.val > 40 ? '#f59e0b' : '#10b981'
                        }}>
                            {ring.val > 80 && <ShieldAlert size={10} className="text-white" />}
                        </div>
                        <span className="text-[7px] font-bold text-white/90 drop-shadow-md">{ring.label}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col bg-surface-0">
        <div className="flex gap-3 mb-5">
           <div className="flex items-center gap-2 bg-surface-1 px-3 py-1.5 rounded-lg border border-border/60">
              <Fuel size={14} className="text-primary" />
              <span className="text-[10px] font-bold uppercase text-ink-2">{vehicle.fuel_type || 'Diesel'}</span>
           </div>
           <div className="flex items-center gap-2 bg-surface-1 px-3 py-1.5 rounded-lg border border-border/60">
              <TrendingUp size={14} className="text-primary" />
              <span className="text-[10px] font-bold uppercase text-ink-2">{vehicle.horsepower || '190'} CV</span>
           </div>
           <div className="flex items-center gap-2 bg-surface-1 px-3 py-1.5 rounded-lg border border-border/60 ml-auto">
              <span className="text-[10px] font-black uppercase text-ink-2">{vehicle.plate}</span>
           </div>
        </div>

        <div className="bg-surface-1 rounded-xl p-4 grid grid-cols-2 gap-4 mb-5 border border-border/60">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Revenus générés</span>
            <span className="text-lg font-black text-ink-1">{Number(vehicle.total_revenue || 0).toLocaleString()} DH</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Marge nette</span>
            <span className={cn("text-lg font-black", roi >= 0 ? "text-emerald-600" : "text-red-600")}>
               {roi > 0 ? "+" : ""}{roi.toLocaleString()} DH
            </span>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-border mt-auto">
           <Link href={`/admin/fleet/${vehicle.id}`} className="flex-1">
             <motion.button
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.97 }}
               className="w-full h-11 rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider border-2 border-primary bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"
             >
                <Activity size={14} />
                Dashboard
             </motion.button>
           </Link>
           <motion.button
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.97 }}
             className="w-11 h-11 rounded-xl flex items-center justify-center text-[10px] font-bold uppercase tracking-wider border-2 border-border bg-surface-0 text-ink-2 hover:bg-ink-1 hover:text-surface-0 hover:border-ink-1 transition-colors cursor-pointer flex-none"
             onClick={() => onEdit(vehicle)}
             title="Éditer le véhicule"
           >
              <Edit size={14} />
           </motion.button>
           <motion.button
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.97 }}
             className={cn(
               "w-11 h-11 rounded-xl flex items-center justify-center text-[10px] font-bold uppercase tracking-wider border-2 cursor-pointer transition-colors flex-none",
               "bg-red-50 border-red-200 text-red-600 hover:bg-red-600 hover:border-red-600 hover:text-white"
             )}
             onClick={() => onDelete(vehicle.id!)}
             disabled={deletingId === vehicle.id}
             title="Supprimer"
           >
             {deletingId === vehicle.id ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
           </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
