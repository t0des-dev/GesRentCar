"use client";

import { useState, useMemo } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Reservation } from "@/types/admin";
import styles from "@/app/admin/page.module.css";

interface FleetCalendarProps {
  reservations: Reservation[];
  onReservationClick?: (reservation: Reservation) => void;
}

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

  // Group reservations by vehicle
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

  const getReservationStatusColor = (status: string) => {
    switch (status) {
      case "pending_payment":
      case "attente_paiement": return "bg-amber-100 border-amber-300 text-amber-800";
      case "pending":
      case "pending_partner": return "bg-blue-100 border-blue-300 text-blue-800";
      case "confirmed": return "bg-indigo-100 border-indigo-300 text-indigo-800";
      case "active": return "bg-emerald-100 border-emerald-300 text-emerald-800";
      case "completed": return "bg-slate-200 border-slate-300 text-slate-700";
      default: return "bg-slate-100 border-slate-200 text-slate-800";
    }
  };

  return (
    <section className="bg-white rounded-[44px] p-8 border border-slate-200/50 shadow-sm mb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <CalendarIcon size={20} className="text-primary" />
          <h2 className="text-[1.75rem] font-black tracking-tight text-slate-900 m-0">Calendrier de Flotte</h2>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <span className="font-bold text-slate-700 uppercase tracking-widest text-sm min-w-[140px] text-center">
            {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={nextMonth} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="min-w-[1000px]">
          {/* Header Row (Days) */}
          <div className="flex border-b border-slate-100 pb-4 mb-4 ml-[250px]">
            {days.map(day => {
              const isToday = isCurrentMonth && day === todayDay;
              return (
                <div 
                  key={day} 
                  className={`flex-1 text-center text-xs font-black flex flex-col items-center justify-center
                    ${isToday ? 'text-primary' : 'text-slate-400'}`}
                >
                  <span className="uppercase tracking-widest text-[9px] mb-1">
                    {new Date(year, month, day).toLocaleDateString('fr-FR', { weekday: 'short' })}
                  </span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isToday ? 'bg-primary text-white shadow-md shadow-primary/30' : ''}`}>
                    {day}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vehicle Rows */}
          {vehiclesMap.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-bold">Aucun véhicule planifié pour ce mois.</div>
          ) : (
            <div className="flex flex-col gap-4">
              {vehiclesMap.map((vehicle, vIndex) => (
                <div key={vIndex} className="flex items-center relative group">
                  {/* Vehicle Info Sidebar */}
                  <div className="w-[250px] shrink-0 pr-4 bg-white z-10 sticky left-0 border-r border-slate-50 py-2">
                    <p className="font-black text-slate-900 text-sm leading-tight">{vehicle.brand}</p>
                    <p className="font-bold text-slate-500 text-xs">{vehicle.model}</p>
                    <p className="text-[9px] font-black uppercase text-slate-300 mt-1 tracking-widest">{vehicle.plate || "Immatriculation N/A"}</p>
                  </div>

                  {/* Gantt Area */}
                  <div className="flex flex-1 relative h-12 bg-slate-50/50 rounded-xl overflow-hidden border border-slate-100 group-hover:bg-slate-50 transition-colors">
                    {/* Day Separators */}
                    {days.map(day => (
                      <div key={day} className="flex-1 border-r border-slate-100/50 last:border-none" />
                    ))}

                    {/* Today Line */}
                    {isCurrentMonth && (
                      <div 
                        className="absolute top-0 bottom-0 w-0.5 bg-red-400/80 z-10 pointer-events-none shadow-[0_0_8px_rgba(248,113,113,0.6)]"
                        style={{ left: `calc(${((todayDay - 1) / daysInMonth) * 100}% + (${100 / daysInMonth / 2}%))` }}
                      />
                    )}

                    {/* Reservation Blocks */}
                    {vehicle.reservations.map(res => {
                      const start = new Date(res.start_date);
                      const end = new Date(res.end_date);
                      
                      // Filter if outside this month
                      if (start.getMonth() !== month && end.getMonth() !== month) return null;

                      // Calculate span
                      const startDay = start.getMonth() < month ? 1 : start.getDate();
                      const endDay = end.getMonth() > month ? daysInMonth : end.getDate();
                      
                      const duration = endDay - startDay + 1;
                      
                      const leftPercent = ((startDay - 1) / daysInMonth) * 100;
                      const widthPercent = (duration / daysInMonth) * 100;

                      return (
                        <div 
                          key={res.id}
                          onClick={() => onReservationClick?.(res)}
                          className={`absolute top-1 bottom-1 rounded-lg border flex items-center px-3 shadow-sm hover:z-30 hover:scale-[1.02] transition-transform cursor-pointer group ${getReservationStatusColor(res.status)}`}
                          style={{
                            left: `${leftPercent}%`,
                            width: `calc(${widthPercent}% - 4px)`,
                            marginLeft: '2px'
                          }}
                        >
                          <span className="text-[10px] font-black truncate">
                            {res.client?.name}
                          </span>

                          {/* Custom Hover Tooltip */}
                          <div className="absolute hidden group-hover:flex flex-col bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white p-3 rounded-xl shadow-2xl w-52 z-50 pointer-events-none">
                             <p className="text-xs font-black mb-1">{res.client?.name || "Client inconnu"}</p>
                             <p className="text-[10px] text-slate-300 font-bold mb-1">{res.start_date} au {res.end_date}</p>
                             <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-700">
                               <span className="text-[9px] uppercase tracking-widest text-slate-400">Total</span>
                               <span className="text-xs font-black text-emerald-400">{res.total_price.toLocaleString()} DH</span>
                             </div>
                             <div className="flex justify-between items-center mt-1">
                               <span className="text-[9px] uppercase tracking-widest text-slate-400">Statut</span>
                               <span className="text-[9px] font-black text-primary uppercase">{res.status}</span>
                             </div>
                             {/* Triangle pointer */}
                             <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
