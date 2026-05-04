"use client";

import { motion } from "framer-motion";
import { X, Wrench } from "lucide-react";
import { Maintenance, Vehicle } from "@/types/admin";
import styles from "@/app/admin/fleet/page.module.css";
import api from "@/lib/api/client";

interface MaintenanceModalProps {
  vehicle: Vehicle | null;
  maintenances: Maintenance[];
  onClose: () => void;
  onRefresh: () => void;
}

export default function MaintenanceModal({ vehicle, maintenances, onClose, onRefresh }: MaintenanceModalProps) {
  if (!vehicle) return null;

  const handleAddMaintenance = async () => {
    const t = (document.getElementById('m_type') as HTMLInputElement).value;
    const c = (document.getElementById('m_cost') as HTMLInputElement).value;
    const d = (document.getElementById('m_desc') as HTMLTextAreaElement).value;
    if (!t || !c) return;

    try {
      await api.post('/maintenances', {
        vehicle_id: vehicle.id,
        type: t,
        cost: c,
        maintenance_date: new Date().toISOString().split('T')[0],
        description: d,
      });
      onRefresh();
    } catch (err) {
      alert("Erreur lors de l'enregistrement.");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className="flex items-center gap-4">
            <Wrench className="text-[#C5A059]" size={28} />
            <h3>Journal : {vehicle.brand} {vehicle.model}</h3>
          </div>
          <button onClick={onClose}><X size={24} /></button>
        </div>

        <div className={styles.maintenanceBody}>
          <div className={styles.quickForm}>
            <h4>Nouvelle Intervention</h4>
            <div className={styles.formRow}>
               <div className={styles.inputGroup}>
                  <label>Type</label>
                  <input type="text" placeholder="ex: Vidange Premium" id="m_type" />
               </div>
               <div className={styles.inputGroup}>
                  <label>Coût (DH)</label>
                  <input type="number" id="m_cost" />
               </div>
            </div>
            <div className={styles.inputGroup} style={{ marginTop: '1rem' }}>
               <label>Description</label>
               <textarea id="m_desc" rows={3}></textarea>
            </div>
            <button className={styles.submitBtn} style={{ marginTop: '2rem' }} onClick={handleAddMaintenance}>
              Enregistrer l'Intervention
            </button>
          </div>

          <div className={styles.historyList}>
            <h4>Historique des Soins</h4>
            {maintenances.length === 0 ? <p className="italic text-[#8C8C8C] text-center py-10">Aucun historique enregistré.</p> : (
              <div className={styles.timeline}>
                {maintenances.map((m, i) => (
                  <div key={i} className={styles.timelineItem}>
                    <div className={styles.timelineDot}></div>
                    <div className={styles.timelineContent}>
                      <div className={styles.mHeader}>
                        <strong>{m.type}</strong>
                        <span>{m.cost} DH</span>
                      </div>
                      <p className="text-sm text-[#8C8C8C] mb-2">{m.description}</p>
                      <small className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">{m.maintenance_date}</small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
