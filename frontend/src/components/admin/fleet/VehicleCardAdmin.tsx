"use client";

import { motion } from "framer-motion";
import { Car, Camera, Star, Fuel, TrendingUp, History, Edit, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Vehicle } from "@/types/admin";
import styles from "@/app/admin/fleet/page.module.css";

interface VehicleCardAdminProps {
  vehicle: Vehicle;
  idx: number;
  onEdit: (v: Vehicle) => void;
  onDelete: (id: number) => void;
  onHistory: (id: number) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>, id: number) => void;
  deletingId: number | null;
}

export default function VehicleCardAdmin({ 
  vehicle, 
  idx, 
  onEdit, 
  onDelete, 
  onHistory, 
  onImageUpload, 
  deletingId 
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

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: idx * 0.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={styles.showroomCard}
    >
      <div className={styles.cardVisual}>
        {vehicle.image_url ? (
          <img src={`http://localhost:8000${vehicle.image_url}`} alt={vehicle.model} />
        ) : (
          <div className="w-full h-full bg-[#FDFCFB] flex items-center justify-center text-[#F5E6D3]">
            <Car size={80} strokeWidth={0.5} />
          </div>
        )}
        
        <div className={styles.statusOverlay}>
          <span className={cn(styles.statusBadge, styles[`status_${vehicle.status}`])}>
            {vehicle.status === 'available' ? 'Disponible' : vehicle.status === 'rented' ? 'En Location' : 'Maintenance'}
          </span>
        </div>

        {isStar && (
          <div className={styles.starBadge}>
            <Star size={12} fill="currentColor" />
            Étoile de la Flotte
          </div>
        )}

        <label className={styles.uploadOverlay}>
           <input type="file" hidden onChange={e => onImageUpload(e, vehicle.id)} />
           <Camera size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </label>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <span className={styles.categoryTag}>{vehicle.category || 'EXCELLENCE'}</span>
          <h3 className={styles.vehicleName}>{vehicle.brand} <span className="italic text-[#C5A059]">{vehicle.model}</span></h3>
          <div className={styles.plateInfo}>
            <code>{vehicle.plate}</code>
            <span>•</span>
            <span>{vehicle.mileage || 0} KM</span>
            <span>•</span>
            <span>{vehicle.year || '2024'}</span>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
           <div className="flex items-center gap-2 bg-[#FDFCFB] px-4 py-2 rounded-xl border border-[#F5E6D3]">
              <Fuel size={14} className="text-[#C5A059]" />
              <span className="text-[10px] font-black uppercase text-[#1A1A1A]">{vehicle.fuel_type || 'Diesel'}</span>
           </div>
           <div className="flex items-center gap-2 bg-[#FDFCFB] px-4 py-2 rounded-xl border border-[#F5E6D3]">
              <TrendingUp size={14} className="text-[#C5A059]" />
              <span className="text-[10px] font-black uppercase text-[#1A1A1A]">{vehicle.horsepower || '190'} CV</span>
           </div>
        </div>

        <div className={styles.financials}>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Revenus Générés</span>
            <span className={styles.metricValue}>{Number(vehicle.total_revenue || 0).toLocaleString()} DH</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Net ROI</span>
            <span className={cn(styles.metricValue, roi >= 0 ? styles.roiValue_positive : styles.roiValue_negative)}>
               {roi.toLocaleString()} DH
            </span>
          </div>
        </div>

        <div className={styles.alertStrip}>
           {(checkExpiry(vehicle.insurance_date) || isExpired(vehicle.insurance_date)) && (
             <span className={cn(styles.expiryAlert, isExpired(vehicle.insurance_date) ? styles.danger : styles.warning)}>
                Assurance {isExpired(vehicle.insurance_date) ? "Expirée" : "⚠️ Proche"}
             </span>
           )}
        </div>

        <div className={styles.cardActions}>
           <button className={styles.actionBtn} onClick={() => onHistory(vehicle.id)}>
              <History size={16} />
              Historique
           </button>
           <button className={styles.actionBtn} onClick={() => onEdit(vehicle)}>
              <Edit size={16} />
              Editer
           </button>
           <button 
             className={cn(styles.actionBtn, styles.deleteBtn)} 
             onClick={() => onDelete(vehicle.id)}
             disabled={deletingId === vehicle.id}
           >
             {deletingId === vehicle.id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
           </button>
        </div>
      </div>
    </motion.div>
  );
}
