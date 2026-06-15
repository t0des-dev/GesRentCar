"use client";

import { RefreshCw, Download } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardHeaderProps {
  loading: boolean;
  onRefresh: () => void;
  onExport: () => void;
}

export default function DashboardHeader({ loading, onRefresh, onExport }: DashboardHeaderProps) {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-12"
    >
      {/* Title & Subtitle */}
      <div className="flex-1">
        <h1 className="text-4xl md:text-5xl font-bold text-ink-1 tracking-tight font-serif mb-3">Vue d'Ensemble</h1>
        <p className="text-ink-2 text-lg font-light">Analysez vos performances et gérez vos réservations en temps réel.</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-surface-1 border-2 border-border hover:border-gold text-ink-1 rounded-lg text-sm font-bold uppercase tracking-wider transition-all disabled:opacity-60"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} strokeWidth={2} />
          Actualiser
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onExport}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gold to-gold/90 text-ink-1 rounded-lg text-sm font-bold uppercase tracking-wider hover:shadow-lg hover:shadow-gold/40 transition-all"
        >
          <Download size={18} strokeWidth={2} />
          Exporter
        </motion.button>
      </div>
    </motion.header>
  );
}
