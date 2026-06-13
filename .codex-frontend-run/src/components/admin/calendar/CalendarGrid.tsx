"use client";

import { cn } from "@/lib/utils";

interface CalendarGridProps {
  days: Date[];
  vehicles: any[];
  getReservationForDay: (vId: number, day: Date) => any;
  onSelectReservation: (res: any) => void;
  onDragStart: (e: React.DragEvent, res: any) => void;
  onDrop: (e: React.DragEvent, vId: number, day: Date) => void;
}

export default function CalendarGrid({ days, vehicles, getReservationForDay, onSelectReservation, onDragStart, onDrop }: CalendarGridProps) {
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  return (
    <div className="card-premium p-0 overflow-hidden border-2 border-border">
      <div className="overflow-x-auto max-w-full">
        <table className="min-w-full w-max border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-surface-2/50 w-[250px] min-w-[250px] max-w-[250px] text-left px-10 py-4 text-xs font-bold uppercase tracking-wider text-ink-3 border-r-2 border-border">Véhicule</th>
              {days.map((day, i) => (
                <th key={i} className={cn(
                  "w-[60px] min-w-[60px] max-w-[60px] px-2 py-4 text-xs font-bold uppercase tracking-wider text-center border-b-2 border-border",
                  day.getDay() === 0 || day.getDay() === 6 ? 'bg-surface-2 text-red-400' : 'text-ink-3'
                )}>
                  {day.getDate()}
                  <span className="block text-[9px] font-bold text-ink-3 mt-1">{day.toLocaleString('fr-FR', { weekday: 'short' })}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vehicles.map(v => (
              <tr key={v.id}>
                <td className="sticky left-0 z-[9] bg-surface-1 w-[250px] min-w-[250px] max-w-[250px] px-10 py-6 border-r-2 border-border">
                  <strong className="block text-sm font-bold text-ink-1">{v.brand} {v.model}</strong>
                  <span className="block mt-1 text-xs font-bold tracking-wider text-ink-3 font-mono">{v.plate}</span>
                </td>
                {days.map((day, i) => {
                  const res = getReservationForDay(v.id, day);
                  const isStart = res && new Date(res.start_date).toDateString() === day.toDateString();
                  return (
                    <td
                      key={i} className="p-0 h-20 border border-border relative"
                      onDragOver={handleDragOver}
                      onDrop={(e) => onDrop(e, v.id, day)}
                    >
                      {res && (
                        <div
                          className={cn(
                            "absolute inset-x-0 top-3 bottom-3 z-[2] flex items-center px-3 text-xs font-bold rounded-xl shadow-sm cursor-grab transition-all hover:scale-[1.02] hover:-translate-y-0.5 hover:z-[5] hover:shadow-md border-2 border-l-[6px]",
                            res.status === 'confirmed' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                            res.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            res.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-surface-2 text-ink-2 border-border'
                          )}
                          onClick={() => onSelectReservation(res)}
                          draggable
                          onDragStart={(e) => onDragStart(e, res)}
                          title="Glisser pour déplacer"
                        >
                          {isStart && <span className="truncate">R#{res.id}</span>}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
