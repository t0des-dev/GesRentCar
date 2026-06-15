"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Car, Calendar, DollarSign, Shield } from "lucide-react";

interface ReservationDetailModalProps {
  reservation: any;
  onClose: () => void;
}

export default function ReservationDetailModal({ reservation, onClose }: ReservationDetailModalProps) {
  if (!reservation) return null;

  const modalVariants = {
    hidden: { scale: 0.9, opacity: 0, y: 20 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: { 
      scale: 0.9, 
      opacity: 0, 
      y: 20,
      transition: { duration: 0.3 }
    }
  } as const;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  } as const;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute inset-0 bg-surface-0/80 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white rounded-2xl w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl border-2 border-gold/30"
        >
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="absolute top-6 right-6 z-20 w-12 h-12 bg-surface-1 border-2 border-border hover:border-gold hover:bg-gold/5 text-ink-2 hover:text-gold rounded-lg flex items-center justify-center transition-all"
          >
            <X size={22} strokeWidth={2} />
          </motion.button>

          {/* Hero Image */}
          <div className="h-64 relative overflow-hidden">
            {reservation.img ? (
              <img 
                src={reservation.img} 
                alt={reservation.vehicle} 
                className="absolute inset-0 w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-surface-1">
                <Car size={72} className="text-gold/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-0 via-surface-0/40 to-transparent flex items-end p-8">
              <div>
                <div className="inline-block px-4 py-2 rounded-lg bg-gold/20 border border-gold/40 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gold">Référence #{reservation.id}00X</span>
                </div>
                <h2 className="text-3xl font-bold text-ink-1 tracking-tight font-serif">{reservation.vehicle}</h2>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            
            {/* Details Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Dates */}
              <div className="bg-surface-1 p-6 rounded-xl border-2 border-border hover:border-gold/40 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar size={18} className="text-gold" />
                  <p className="text-xs font-bold uppercase tracking-widest text-ink-3">Itinéraire Temporel</p>
                </div>
                <p className="font-semibold text-lg text-ink-1">
                  {reservation.startDate}
                </p>
                <p className="text-ink-2 text-sm mt-1">→</p>
                <p className="font-semibold text-lg text-ink-1">
                  {reservation.endDate}
                </p>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-br from-gold/10 to-gold/5 p-6 rounded-xl border-2 border-gold/40">
                <div className="flex items-center gap-3 mb-3">
                  <DollarSign size={18} className="text-gold" />
                  <p className="text-xs font-bold uppercase tracking-widest text-ink-3">Investissement</p>
                </div>
                <p className="font-bold text-3xl text-gold">
                  {reservation.totalPrice.toLocaleString()} <span className="text-lg text-ink-3">DH</span>
                </p>
                <div className="flex items-center gap-2 mt-3 text-emerald-600">
                  <Shield size={14} strokeWidth={2} />
                  <p className="text-xs font-bold uppercase tracking-wider">Transaction Sécurisée</p>
                </div>
              </div>
            </motion.div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3 justify-end"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-8 py-3 rounded-lg bg-surface-1 border-2 border-border hover:border-gold text-ink-1 font-bold text-xs uppercase tracking-wider transition-all"
              >
                Retour
              </motion.button>

              {reservation.hasContract && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-gold to-gold/90 text-ink-1 font-bold text-xs uppercase tracking-wider hover:shadow-lg hover:shadow-gold/40 transition-all"
                >
                  Télécharger l'Acte
                </motion.button>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
