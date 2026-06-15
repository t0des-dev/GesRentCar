"use client";

import { motion } from "framer-motion";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrev: () => void;
  onNext: () => void;
}

export default function CalendarHeader({ currentMonth, onPrev, onNext }: CalendarHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-premium flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-2 border-border"
    >
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-2xl"><CalendarIcon size={24} className="text-primary" /></div>
        <div>
          <h1 className="font-serif text-2xl text-ink-1 tracking-tight">Planning de la Flotte</h1>
          <p className="text-xs font-bold text-ink-2 italic mt-0.5">Vue d'ensemble des réservations et disponibilités.</p>
        </div>
      </div>
      <div className="flex items-center gap-3 bg-surface-2 p-1.5 rounded-2xl border-2 border-border">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPrev}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-1 text-ink-2 hover:bg-gold/20 hover:text-gold transition-colors"
        >
          <ChevronLeft size={20} />
        </motion.button>
        <h2 className="text-sm font-bold uppercase tracking-wider text-ink-1 min-w-[180px] text-center">{currentMonth.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}</h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-1 text-ink-2 hover:bg-gold/20 hover:text-gold transition-colors"
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>
    </motion.header>
  );
}
