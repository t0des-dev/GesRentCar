"use client";

import { motion } from "framer-motion";
import { X, Wrench } from "lucide-react";
import { Maintenance, Vehicle } from "@/types/admin";
import api from "@/shared/services/client";

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
    <div className="fixed inset-0 bg-ink-1/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface-0 w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-y-auto shadow-xl border-2 border-border/60">
        <div className="p-8 pb-4 flex justify-between items-center border-b border-border">
          <div className="flex items-center gap-4">
            <Wrench className="text-primary" size={28} />
            <h3 className="text-xl font-bold text-ink-1">Journal : {vehicle.brand} {vehicle.model}</h3>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onClose} className="p-2 text-ink-3 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50"><X size={24} /></motion.button>
        </div>

        <div className="p-8">
          <div className="bg-surface-1 border-2 border-border/60 p-8 rounded-2xl mb-8">
            <h4 className="text-lg font-bold text-ink-1 mb-6">Nouvelle Intervention</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-ink-3">Type</label>
                  <input type="text" className="input-premium" placeholder="ex: Vidange Premium" id="m_type" />
               </div>
               <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-ink-3">Coût (DH)</label>
                  <input type="number" className="input-premium" id="m_cost" />
               </div>
            </div>
            <div className="flex flex-col gap-2 mt-4">
               <label className="text-xs font-bold uppercase tracking-wider text-ink-3">Description</label>
               <textarea className="input-premium" id="m_desc" rows={3}></textarea>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="bg-gradient-to-r from-gold to-gold/90 text-ink-1 w-full mt-8 rounded-xl h-12 font-bold text-sm" onClick={handleAddMaintenance}>
              Enregistrer l'Intervention
            </motion.button>
          </div>

          <div>
            <h4 className="text-lg font-bold text-ink-1 mb-6">Historique des Soins</h4>
            {maintenances.length === 0 ? <p className="italic text-ink-3 text-center py-10">Aucun historique enregistré.</p> : (
              <div className="flex flex-col gap-6">
                {maintenances.map((m, i) => (
                  <div key={i} className="flex gap-6 relative">
                    <div className="w-3 h-3 bg-primary rounded-full mt-1.5 flex-shrink-0 shadow-[0_0_0_4px_white,0_0_0_6px_#e2e8f0]"></div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <strong className="text-sm text-ink-1">{m.type}</strong>
                        <span className="text-sm font-semibold text-ink-2">{m.cost} DH</span>
                      </div>
                      <p className="text-sm text-ink-2 mb-2">{m.description}</p>
                      <small className="text-xs font-bold uppercase tracking-wider text-ink-3">{m.maintenance_date}</small>
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
