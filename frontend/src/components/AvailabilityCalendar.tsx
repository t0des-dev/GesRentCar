"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/utils";

interface CalendarReservationModalProps {
  availability: Record<string, "available" | "booked" | "maintenance">;
  onSelectDate?: (date: string) => void;
  selectedStart?: string;
  selectedEnd?: string;
}

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTH_NAMES = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

export default function AvailabilityCalendar({ availability, onSelectDate, selectedStart, selectedEnd }: CalendarReservationModalProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7;

  const calendarDays = useMemo(() => {
    const days: Array<{ date: string; day: number; status: string; isToday: boolean; isSelected: boolean }> = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      const isToday = dateStr === today.toISOString().split("T")[0];
      const isSelected = dateStr === selectedStart || dateStr === selectedEnd;
      days.push({
        date: dateStr,
        day: i,
        status: availability[dateStr] || "available",
        isToday,
        isSelected,
      });
    }
    return days;
  }, [daysInMonth, currentMonth, currentYear, availability, selectedStart, selectedEnd]);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-border p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 hover:bg-surface-1 rounded-lg transition-colors">
          <ChevronLeft size={16} className="text-ink-2" />
        </button>
        <h3 className="text-sm font-bold text-ink-1 uppercase tracking-wider">
          {MONTH_NAMES[currentMonth]} {currentYear}
        </h3>
        <button onClick={nextMonth} className="p-2 hover:bg-surface-1 rounded-lg transition-colors">
          <ChevronRight size={16} className="text-ink-2" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-bold uppercase tracking-wider text-ink-3 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {calendarDays.map(d => (
          <motion.button
            key={d.date}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={d.status === "booked" || d.status === "maintenance"}
            onClick={() => onSelectDate?.(d.date)}
            className={cn(
              "h-9 rounded-lg text-xs font-bold transition-all relative",
              d.status === "booked" && "bg-red-100 text-red-400 cursor-not-allowed line-through",
              d.status === "maintenance" && "bg-amber-100 text-amber-400 cursor-not-allowed",
              d.status === "available" && !d.isSelected && "hover:bg-gold/10 text-ink-1 cursor-pointer",
              d.isSelected && "bg-primary text-white ring-2 ring-primary/30",
              d.isToday && !d.isSelected && "ring-2 ring-gold/50",
            )}
          >
            {d.day}
          </motion.button>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-white border border-border" /><span className="text-[10px] text-ink-3">Disponible</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-red-100 border border-red-200" /><span className="text-[10px] text-ink-3">Réservé</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-amber-100 border border-amber-200" /><span className="text-[10px] text-ink-3">Maintenance</span></div>
      </div>
    </div>
  );
}
