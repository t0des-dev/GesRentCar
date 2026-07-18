"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, User, Clock, FileText } from "lucide-react";
import { cn } from "@/shared/utils";
import { Reservation } from "@/types/admin";

interface CalendarReservationModalProps {
  reservation: Reservation;
  onClose: () => void;
  apiUrl: string;
}

export default function CalendarReservationModal({ reservation, onClose, apiUrl }: CalendarReservationModalProps) {
  return (
    <AnimatePresence>
      {reservation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-surface-0/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-surface-1 rounded-2xl p-8 shadow-xl w-full max-w-md border-2 border-border"
            onClick={e => e.stopPropagation()}
          >
            <header className="flex justify-between items-center mb-6">
              <span className={cn(
                "px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider",
                reservation.status === 'confirmed' ? 'bg-indigo-50 text-indigo-700' :
                reservation.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                reservation.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                'bg-surface-2 text-ink-2'
              )}>
                #{reservation.id} - {reservation.status.toUpperCase()}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 flex items-center justify-center bg-surface-2 text-ink-3 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors"
                onClick={onClose}
              >
                <X size={20} />
              </motion.button>
            </header>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-surface-2 rounded-2xl">
                <User size={18} className="text-primary" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-3">Client</p>
                  <strong className="font-serif text-base text-ink-1">{reservation.client?.name || 'N/A'}</strong>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-surface-2 rounded-2xl">
                <Clock size={18} className="text-primary" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-3">Période de location</p>
                  <strong className="font-serif text-base text-ink-1">Du {new Date(reservation.start_date).toLocaleDateString('fr-FR')} au {new Date(reservation.end_date).toLocaleDateString('fr-FR')}</strong>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-surface-2 rounded-2xl">
                <FileText size={18} className="text-primary" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-3">Documents</p>
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={`${apiUrl}/public/reservations/${reservation.id}/contract?lang=fr`}
                    target="_blank"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gold to-gold/90 text-ink-1 rounded-xl text-xs font-bold uppercase tracking-wider mt-1"
                  >
                    Télécharger le Contrat (PDF)
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
