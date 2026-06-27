"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Car, Camera, Star, Fuel, TrendingUp, Edit, Trash2, Loader2, ShieldAlert, Wrench, Activity, MoreVertical } from "lucide-react";
import { cn } from "@/shared/utils";
import { fmt } from "@/shared/utils/format";
import { getImageUrl } from "@/shared/utils/image";
import { Vehicle } from "@/types/admin";
import Link from "next/link";
import api from "@/shared/services/client";
import { ConfirmDialog } from "@/components/Notifications";

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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const maxDanger = Math.max(insDanger, techDanger, vigDanger);
  const insExpDate = vehicle.insurance_date ? new Date(vehicle.insurance_date).toLocaleDateString() : "Non renseignée";
  const vigExpDate = vehicle.vignette_date ? new Date(vehicle.vignette_date).toLocaleDateString() : "Non renseignée";
  const techExpDate = vehicle.tech_inspection_date ? new Date(vehicle.tech_inspection_date).toLocaleDateString() : "Non renseignée";
  const paperTooltip = `Assurance: ${insExpDate}\nVignette: ${vigExpDate}\nContrôle Tech: ${techExpDate}`;

  const handleKillSwitch = async () => {
    setConfirmOpen(true);
  };

  const confirmKillSwitch = async () => {
    setConfirmOpen(false);
    try {
      await api.put(`/vehicles/${vehicle.id}`, { status: 'maintenance' });
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: idx * 0.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "bg-surface-0 rounded-2xl border-2 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group relative",
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
            <img src={getImageUrl(vehicle.image_url) || "https://placehold.co/800x450?text=Aucune+Image"} alt={vehicle.model} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
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

        {/* Unified paper status badge at the bottom of the image */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex items-end justify-between">
            <div className="text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 block drop-shadow-md">{vehicle.category || 'EXCELLENCE'}</span>
                <h3 className="text-2xl font-black drop-shadow-lg">{vehicle.brand} <span className="text-primary font-bold italic">{vehicle.model}</span></h3>
            </div>
            <div className="flex gap-2">
                <div 
                    title={paperTooltip}
                    className={cn(
                        "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md shadow-md border cursor-help transition-all",
                        maxDanger > 80 ? "bg-red-500/90 text-white border-red-400" :
                        maxDanger > 40 ? "bg-amber-500/90 text-white border-amber-400" :
                        "bg-emerald-500/90 text-white border-emerald-400"
                    )}
                >
                    <ShieldAlert size={12} />
                    Papiers
                </div>
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
            <span className="text-lg font-black text-ink-1">{fmt(Number(vehicle.total_revenue || 0))} DH</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Marge nette</span>
            <span className={cn("text-lg font-black", roi >= 0 ? "text-emerald-600" : "text-red-600")}>
               {roi > 0 ? "+" : ""}{fmt(roi)} DH
            </span>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-border mt-auto items-center relative">
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
           
           <div className="relative flex-none">
             <motion.button
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.97 }}
               className={cn(
                 "w-11 h-11 rounded-xl flex items-center justify-center border-2 border-border bg-surface-0 text-ink-2 hover:bg-surface-1 transition-colors cursor-pointer",
                 menuOpen ? "bg-surface-2 border-ink-1 text-ink-1" : ""
               )}
               onClick={() => setMenuOpen(!menuOpen)}
               title="Plus d'actions"
             >
                <MoreVertical size={16} />
             </motion.button>

             {menuOpen && (
               <>
                 <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
                 <div className="absolute right-0 bottom-full mb-2 bg-white border border-border shadow-xl rounded-xl p-2 w-48 z-40 flex flex-col gap-1">
                    <button
                      onClick={() => { onEdit(vehicle); setMenuOpen(false); }}
                      className="flex items-center gap-2.5 w-full px-3 py-2.5 hover:bg-surface-1 text-[11px] font-bold uppercase tracking-wider text-ink-2 hover:text-ink-1 rounded-lg transition-colors text-left"
                    >
                      <Edit size={13} />
                      Éditer l'actif
                    </button>
                    {vehicle.status !== 'maintenance' && (
                      <button
                        onClick={() => { handleKillSwitch(); setMenuOpen(false); }}
                        className="flex items-center gap-2.5 w-full px-3 py-2.5 hover:bg-amber-50 text-[11px] font-bold uppercase tracking-wider text-amber-600 hover:text-amber-700 rounded-lg transition-colors text-left"
                      >
                        <ShieldAlert size={13} />
                        Maintenance d'urgence
                      </button>
                    )}
                    <button
                      onClick={() => { onDelete(vehicle.id!); setMenuOpen(false); }}
                      disabled={deletingId === vehicle.id}
                      className="flex items-center gap-2.5 w-full px-3 py-2.5 hover:bg-red-50 text-[11px] font-bold uppercase tracking-wider text-red-600 hover:text-red-700 rounded-lg transition-colors text-left disabled:opacity-55"
                    >
                      {deletingId === vehicle.id ? <Loader2 className="animate-spin" size={13} /> : <Trash2 size={13} />}
                      Supprimer l'actif
                    </button>
                 </div>
               </>
             )}
           </div>
        </div>
      </div>
    </motion.div>

    <ConfirmDialog
      open={confirmOpen}
      title="Maintenance d'urgence"
      message="Passer ce vehicule en maintenance d'urgence ?"
      confirmLabel="Confirmer"
      cancelLabel="Annuler"
      variant="warning"
      onConfirm={confirmKillSwitch}
      onCancel={() => setConfirmOpen(false)}
    />
    </>
  );
}
