"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Reservation } from "@/types/admin";
import { cn } from "@/lib/utils";

interface FleetCalendarProps {
  reservations: Reservation[];
  onReservationClick?: (reservation: Reservation) => void;
}

const STATUS_COLORS: Record<string, string> = {
  pending_payment: "bg-amber-500/20 border-amber-400/40 text-amber-600",
  pending:         "bg-blue-500/20 border-blue-400/40 text-blue-600",
  confirmed:       "bg-indigo-500/20 border-indigo-400/40 text-indigo-600",
  active:          "bg-emerald-500/20 border-emerald-400/40 text-emerald-600",
  completed:       "bg-ink-3/20 border-ink-3/40 text-ink-2",
};

export default function FleetCalendar({ reservations, onReservationClick }: FleetCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const realNow = new Date();
  const isCurrentMonth = realNow.getFullYear() === year && realNow.getMonth() === month;
  const todayDay = realNow.getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const vehiclesMap = useMemo(() => {
    const map = new Map<string, { brand: string; model: string; plate: string; reservations: Reservation[] }>();
    reservations.forEach(r => {
      if (r.vehicle && r.status !== "rejected") {
        const key = r.vehicle.plate || `${r.vehicle.brand} ${r.vehicle.model}`;
        if (!map.has(key)) {
          map.set(key, { 
            brand: r.vehicle.brand, 
            model: r.vehicle.model, 
            plate: r.vehicle.plate, 
            reservations: [] 
          });
        }
        map.get(key)!.reservations.push(r);
      }
    });
    return Array.from(map.values());
  }, [reservations]);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="bg-white rounded-2xl border-2 border-border shadow-lg p-6 md:p-8 mb-10 card-premium"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gold/20 border-2 border-gold/40 flex items-center justify-center">
            <CalendarIcon size={20} className="text-gold" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-bold text-ink-1 tracking-tight font-serif">Calendrier de Flotte</h2>
        </div>

        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevMonth} 
            className="p-2 bg-surface-1 hover:bg-gold/5 border-2 border-border hover:border-gold rounded-lg text-ink-2 hover:text-gold transition-all"
          >
            <ChevronLeft size={20} strokeWidth={2} />
          </motion.button>
          <span className="font-bold text-ink-1 uppercase tracking-wider text-sm min-w-[160px] text-center">
            {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </span>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextMonth} 
            className="p-2 bg-surface-1 hover:bg-gold/5 border-2 border-border hover:border-gold rounded-lg text-ink-2 hover:text-gold transition-all"
          >
            <ChevronRight size={20} strokeWidth={2} />
          </motion.button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[1000px]">
          {/* Header Row (Days) */}
          <div className="flex items-end border-b-2 border-border pb-4 mb-4">
            <div className="w-[250px] shrink-0 pr-4 bg-white z-10 sticky left-0">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-3">Véhicule</span>
            </div>
            <div className="flex flex-1">
              {days.map(day => {
                const isToday = isCurrentMonth && day === todayDay;
                return (
                  <div key={day} className="flex-1 text-center flex flex-col items-center justify-center">
                    <span className="uppercase tracking-wider text-[9px] font-bold text-ink-3 mb-1">
                      {new Date(year, month, day).toLocaleDateString('fr-FR', { weekday: 'short' })}
                    </span>
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                      isToday 
                        ? "bg-gradient-to-r from-gold to-gold/90 text-ink-1 shadow-md shadow-gold/30" 
                        : "text-ink-2"
                    )}>
                      {day}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vehicle Rows */}
          {vehiclesMap.length === 0 ? (
            <div className="text-center py-16">
              <CalendarIcon size={48} className="mx-auto mb-4 text-gold/30" strokeWidth={1} />
              <p className="text-lg font-bold text-ink-2">Aucun véhicule planifié pour ce mois.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {vehiclesMap.map((vehicle, vIndex) => (
                <motion.div 
                  key={vIndex} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: vIndex * 0.05 }}
                  className="flex items-center relative group"
                >
                  {/* Vehicle Info */}
                  <div className="w-[250px] shrink-0 pr-4 bg-white z-10 sticky left-0 border-r-2 border-border py-2">
                    <p className="font-bold text-ink-1 text-sm leading-tight">{vehicle.brand}</p>
                    <p className="font-semibold text-ink-2 text-xs">{vehicle.model}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3 mt-1">{vehicle.plate || "Immatriculation N/A"}</p>
                  </div>

                  {/* Gantt Area */}
                  <div className="flex flex-1 relative h-12 bg-surface-1 rounded-xl overflow-hidden border-2 border-border group-hover:border-gold/40 transition-all">
                    {/* Day Separators */}
                    {days.map(day => (
                      <div key={day} className="flex-1 border-r border-border/30 last:border-none" />
                    ))}

                    {/* Today Line */}
                    {isCurrentMonth && (
                      <div 
                        className="absolute top-0 bottom-0 w-0.5 bg-gold z-10 pointer-events-none shadow-[0_0_8px_rgba(216,177,65,0.6)]"
                        style={{ left: `calc(${((todayDay - 1) / daysInMonth) * 100}% + (${100 / daysInMonth / 2}%))` }}
                      />
                    )}

                    {/* Reservation Blocks */}
                    {vehicle.reservations.map(res => {
                      const start = new Date(res.start_date);
                      const end = new Date(res.end_date);
                      
                      if (start.getMonth() !== month && end.getMonth() !== month) return null;

                      const startDay = start.getMonth() < month ? 1 : start.getDate();
                      const endDay = end.getMonth() > month ? daysInMonth : end.getDate();
                      const duration = endDay - startDay + 1;
                      const leftPercent = ((startDay - 1) / daysInMonth) * 100;
                      const widthPercent = (duration / daysInMonth) * 100;

                      return (
                        <motion.div 
                          key={res.id}
                          initial={{ opacity: 0, scaleX: 0 }}
                          animate={{ opacity: 1, scaleX: 1 }}
                          whileHover={{ scale: 1.02, zIndex: 30 }}
                          onClick={() => onReservationClick?.(res)}
                          className={cn(
                            "absolute top-1 bottom-1 rounded-lg border-2 flex items-center px-3 shadow-sm hover:shadow-md cursor-pointer transition-all",
                            STATUS_COLORS[res.status] || STATUS_COLORS.pending
                          )}
                          style={{
                            left: `${leftPercent}%`,
                            width: `calc(${widthPercent}% - 4px)`,
                            marginLeft: '2px'
                          }}
                        >
                          <span className="text-[10px] font-bold truncate">
                            {res.client?.name}
                          </span>

                          {/* Tooltip */}
                          <div className="absolute hidden group-hover:flex flex-col bottom-full mb-2 left-1/2 -translate-x-1/2 bg-surface-0 text-ink-1 p-4 rounded-xl shadow-2xl border-2 border-gold/40 w-56 z-50 pointer-events-none">
                            <p className="text-sm font-bold mb-1">{res.client?.name || "Client inconnu"}</p>
                            <p className="text-xs text-ink-2 font-semibold mb-2">{res.start_date} au {res.end_date}</p>
                            <div className="flex justify-between items-center pt-2 border-t border-border">
                              <span className="text-[10px] uppercase tracking-wider text-ink-3">Total</span>
                              <span className="text-sm font-bold text-gold">{res.total_price.toLocaleString()} DH</span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-[10px] uppercase tracking-wider text-ink-3">Statut</span>
                              <span className="text-[10px] font-bold text-gold uppercase">{res.status}</span>
                            </div>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-surface-0" />
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gold/40" style={{ marginTop: '-1px' }} />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}