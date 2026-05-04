"use client";

import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "../../../app/admin/calendar/page.module.css";

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrev: () => void;
  onNext: () => void;
}

export default function CalendarHeader({ currentMonth, onPrev, onNext }: CalendarHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.titleArea}>
        <div className="bg-primary/10 p-3 rounded-2xl"><CalendarIcon size={24} className="text-primary" /></div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Planning de la Flotte</h1>
          <p className="text-slate-500 font-medium italic mt-0.5">Vue d'ensemble des réservations et disponibilités.</p>
        </div>
      </div>
      <div className={styles.controls}>
        <button onClick={onPrev} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary transition-all shadow-sm"><ChevronLeft size={20} /></button>
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 mx-6 min-w-[200px] text-center">{currentMonth.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}</h2>
        <button onClick={onNext} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary transition-all shadow-sm"><ChevronRight size={20} /></button>
      </div>
    </header>
  );
}
