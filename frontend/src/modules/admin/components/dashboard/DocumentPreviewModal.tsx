"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, ExternalLink } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/shared/utils/image";

interface DocumentPreviewModalProps {
  docs: { cin?: string; license?: string; name?: string } | null;
  onClose: () => void;
}

export default function DocumentPreviewModal({ docs, onClose }: DocumentPreviewModalProps) {
  if (!docs) return null;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  } as const;

  const modalVariants = {
    hidden: { scale: 0.9, opacity: 0, y: 20 },
    visible: { 
      scale: 1, opacity: 1, y: 0,
      transition: { type: "spring" as const, damping: 25, stiffness: 250 }
    },
    exit: { 
      scale: 0.9, opacity: 0, y: 20,
      transition: { duration: 0.2 }
    }
  } as const;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute inset-0 bg-surface-0/90 backdrop-blur-md"
          onClick={onClose}
        />

        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl border-2 border-gold/30 flex flex-col"
        >
          {/* Header */}
          <div className="p-8 border-b-2 border-border flex items-center justify-between bg-surface-1">
            <div>
              <h3 className="text-2xl font-bold text-ink-1 tracking-tight font-serif">Documents : {docs.name}</h3>
              <p className="text-sm font-bold text-ink-3 uppercase tracking-wider">Justificatifs d'identité et de conduite</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="w-12 h-12 rounded-lg bg-white border-2 border-border flex items-center justify-center hover:border-gold hover:bg-gold/5 text-ink-2 hover:text-gold transition-all"
            >
              <X size={22} strokeWidth={2} />
            </motion.button>
          </div>

          {/* Body */}
          <div className="p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {docs.cin && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-ink-3">Carte d'Identité (CIN)</span>
                  <a href={getImageUrl(docs.cin)} target="_blank" rel="noopener noreferrer" 
                     className="text-xs font-bold text-gold hover:text-gold/80 transition-colors flex items-center gap-1">
                    Ouvrir <ExternalLink size={14} strokeWidth={2} />
                  </a>
                </div>
                <div className="aspect-video rounded-xl overflow-hidden border-2 border-border group relative">
                  <Image src={getImageUrl(docs.cin) || ""} alt="CIN" width={800} height={600} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              </motion.div>
            )}

            {docs.license && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-ink-3">Permis de Conduire</span>
                  <a href={getImageUrl(docs.license)} target="_blank" rel="noopener noreferrer" 
                     className="text-xs font-bold text-gold hover:text-gold/80 transition-colors flex items-center gap-1">
                    Ouvrir <ExternalLink size={14} strokeWidth={2} />
                  </a>
                </div>
                <div className="aspect-video rounded-xl overflow-hidden border-2 border-border group relative">
                  <Image src={getImageUrl(docs.license) || ""} alt="Permis" width={800} height={600} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              </motion.div>
            )}

            {!docs.cin && !docs.license && (
              <div className="col-span-2 py-20 text-center">
                <AlertTriangle size={48} className="mx-auto mb-6 text-gold/30" strokeWidth={1} />
                <p className="text-xl font-bold text-ink-1">Aucun document numérisé pour ce client.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 bg-surface-1 border-t-2 border-border flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-gold to-gold/90 text-ink-1 rounded-lg font-bold text-xs uppercase tracking-wider hover:shadow-lg hover:shadow-gold/40 transition-all"
            >
              Fermer l'Aperçu
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}