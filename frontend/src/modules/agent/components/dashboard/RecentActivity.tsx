"use client";

import { motion } from "framer-motion";
import { Calendar, Search } from "lucide-react";
import { cn } from "@/shared/utils";

interface RecentActivityProps {
  reservations: any[];
  loading: boolean;
}

export default function RecentActivity({ reservations, loading }: RecentActivityProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="lg:col-span-2 space-y-5"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold uppercase tracking-wider text-ink-1 flex items-center gap-2">
          <Calendar size={14} className="text-primary" />
          Réservations Récentes
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-xs font-bold text-primary uppercase tracking-wider hover:underline"
        >
          Tout voir
        </motion.button>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-0 rounded-2xl border-2 border-border overflow-hidden shadow-sm"
      >
        {loading ? (
          <div className="p-10 text-center text-ink-3 animate-pulse uppercase text-xs font-bold tracking-wider">
            Chargement des données...
          </div>
        ) : reservations.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Search size={40} className="text-border mx-auto" />
            <p className="text-ink-3 italic text-sm">Aucune activité enregistrée.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {reservations.slice(0, 5).map((r) => (
              <div key={r.id} className="p-5 flex items-center justify-between hover:bg-surface-1 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface-0 border-2 border-border flex items-center justify-center font-bold text-xs text-ink-3 shadow-sm">
                    #{r.id?.toString().padStart(4, "0")}
                  </div>
                  <div>
                    <p className="font-bold text-ink-1 text-sm group-hover:text-primary transition-colors">
                      {r.vehicle ? `${r.vehicle.brand} ${r.vehicle.model}` : "Véhicule Premium"}
                    </p>
                    <p className="text-xs font-medium text-ink-3 uppercase tracking-wider">
                      {r.start_date?.split('T')[0]} → {r.end_date?.split('T')[0]}
                    </p>
                  </div>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border-2",
                  r.status === 'confirmed' ? "badge-success" :
                  r.status === 'pending' ? "badge-warning" :
                  r.status === 'pending_payment' || r.status === 'attente_paiement' ? "badge-primary" :
                  r.status === 'pending_partner' ? "bg-surface-1 text-pink-600 border-border" :
                  "badge-neutral"
                )}>
                  {r.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
