"use client";

import { motion } from "framer-motion";
import { Car, Camera, Star, Fuel, TrendingUp, History, Edit, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Vehicle } from "@/types/admin";

interface VehicleCardAdminProps {
  vehicle: Vehicle;
  idx: number;
  onEdit: (v: Vehicle) => void;
  onDelete: (id: number) => void;
  onHistory: (id: number) => void;
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
  onHistory,
  onImageUpload,
  deletingId,
  isSelected = false,
  onSelect
}: VehicleCardAdminProps) {
  const roi = (vehicle.total_revenue || 0) - (vehicle.total_maintenance_cost || 0);
  const isStar = roi > 50000;

  const checkExpiry = (dateStr?: string) => {
    if (!dateStr) return false;
    const days = (new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
    return days < 30 && days >= 0;
  };

  const isExpired = (dateStr?: string) => {
    if (!dateStr) return false;
    return new Date(dateStr).getTime() < new Date().getTime();
  };

  const alerts = [];
  if (isExpired(vehicle.insurance_date) || checkExpiry(vehicle.insurance_date)) alerts.push({ type: 'Assurance', expired: isExpired(vehicle.insurance_date) });
  if (isExpired(vehicle.tech_inspection_date) || checkExpiry(vehicle.tech_inspection_date)) alerts.push({ type: 'Visite Tech.', expired: isExpired(vehicle.tech_inspection_date) });
  if (isExpired(vehicle.vignette_date) || checkExpiry(vehicle.vignette_date)) alerts.push({ type: 'Vignette', expired: isExpired(vehicle.vignette_date) });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: idx * 0.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "bg-surface-0 rounded-2xl border-2 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md group",
        isSelected ? "border-primary shadow-primary/10" : "border-border/60"
      )}
    >
      <div className="h-64 relative overflow-hidden bg-surface-1">
        {onSelect && (
          <div className="absolute top-4 left-4 z-20">
            <input 
              type="checkbox" 
              checked={isSelected}
              onChange={() => onSelect(vehicle.id!)}
              className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer shadow-sm"
            />
          </div>
        )}

        {vehicle.image_url ? (
          <img src={`${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api").replace("/api", "")}${vehicle.image_url}`} alt={vehicle.model} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-surface-1 flex items-center justify-center text-ink-3">
            <Car size={80} strokeWidth={0.5} />
          </div>
        )}

        <div className="absolute top-4 right-4 z-10">
          <span className={cn(
            "px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider shadow-sm",
            vehicle.status === 'available' ? 'bg-emerald-500 text-white' :
            vehicle.status === 'rented' ? 'bg-blue-500 text-white' :
            'bg-amber-500 text-white'
          )}>
            {vehicle.status === 'available' ? 'Disponible' : vehicle.status === 'rented' ? 'En Location' : 'Maintenance'}
          </span>
        </div>

        {isStar && (
          <div className={cn(
            "absolute left-4 bg-amber-500 text-white px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1 shadow-sm z-10",
            onSelect ? "top-12" : "top-4"
          )}>
            <Star size={12} fill="currentColor" />
            Étoile de la Flotte
          </div>
        )}

        <label className="absolute inset-0 flex items-center justify-center cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
           <input type="file" hidden onChange={e => onImageUpload(e, vehicle.id!)} />
           <Camera size={20} className="text-white" />
        </label>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-ink-3 block mb-1">{vehicle.category || 'EXCELLENCE'}</span>
          <h3 className="text-xl font-bold text-ink-1 mb-1">{vehicle.brand} <span className="italic text-primary">{vehicle.model}</span></h3>
          <div className="text-xs font-semibold text-ink-3 flex items-center gap-3">
            <code className="bg-surface-1 px-1.5 py-0.5 rounded border-2 border-border text-ink-2 text-[10px]">{vehicle.plate}</code>
            <span>•</span>
            <span>{vehicle.mileage || 0} KM</span>
            <span>•</span>
            <span>{vehicle.year || '2024'}</span>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
           <div className="flex items-center gap-2 bg-surface-1 px-3 py-1.5 rounded-xl border-2 border-border">
              <Fuel size={14} className="text-primary" />
              <span className="text-xs font-bold uppercase text-ink-2">{vehicle.fuel_type || 'Diesel'}</span>
           </div>
           <div className="flex items-center gap-2 bg-surface-1 px-3 py-1.5 rounded-xl border-2 border-border">
              <TrendingUp size={14} className="text-primary" />
              <span className="text-xs font-bold uppercase text-ink-2">{vehicle.horsepower || '190'} CV</span>
           </div>
        </div>

        <div className="bg-surface-1 rounded-2xl p-4 grid grid-cols-2 gap-4 mb-4 border-2 border-border">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-3">Revenus</span>
            <span className="text-lg font-bold text-ink-1">{Number(vehicle.total_revenue || 0).toLocaleString()} DH</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-3">Net ROI</span>
            <span className={cn("text-lg font-bold", roi >= 0 ? "text-emerald-600" : "text-red-600")}>
               {roi.toLocaleString()} DH
            </span>
          </div>
        </div>

        {alerts.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
             {alerts.map((alert, i) => (
               <span key={i} className={cn(
                 "text-[9px] font-semibold uppercase tracking-wider px-2 py-1 rounded border",
                 alert.expired
                   ? "bg-red-50 text-red-700 border-red-200"
                   : "bg-amber-50 text-amber-700 border-amber-200"
               )}>
                  {alert.type} {alert.expired ? "Expirée" : "⚠️ Proche"}
               </span>
             ))}
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t border-border mt-auto">
           <motion.button
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.97 }}
             className="flex-1 h-12 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider border-2 border-border bg-surface-0 text-ink-2 hover:bg-ink-1 hover:text-surface-0 hover:border-ink-1 transition-colors cursor-pointer"
             onClick={() => onHistory(vehicle.id)}
           >
              <History size={16} />
              Historique
           </motion.button>
           <motion.button
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.97 }}
             className="flex-1 h-12 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider border-2 border-border bg-surface-0 text-ink-2 hover:bg-ink-1 hover:text-surface-0 hover:border-ink-1 transition-colors cursor-pointer"
             onClick={() => onEdit(vehicle)}
           >
              <Edit size={16} />
              Editer
           </motion.button>
           <motion.button
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.97 }}
             className={cn(
               "w-12 h-12 rounded-xl flex items-center justify-center text-xs font-bold uppercase tracking-wider border-2 cursor-pointer transition-colors flex-none",
               "bg-red-50 border-red-200 text-red-600 hover:bg-red-600 hover:border-red-600 hover:text-white"
             )}
             onClick={() => onDelete(vehicle.id)}
             disabled={deletingId === vehicle.id}
           >
             {deletingId === vehicle.id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
           </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
