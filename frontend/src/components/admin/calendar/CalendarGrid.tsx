"use client";

import styles from "../../../app/admin/calendar/page.module.css";

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
    <div className={styles.calendarWrapper}>
      <div className={styles.tableScroll}>
        <table className={styles.calendarTable}>
          <thead>
            <tr>
              <th className={styles.vehicleHeader}>Véhicule</th>
              {days.map((day, i) => (
                <th key={i} className={day.getDay() === 0 || day.getDay() === 6 ? styles.weekend : ""}>
                  {day.getDate()}
                  <span>{day.toLocaleString('fr-FR', { weekday: 'short' })}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vehicles.map(v => (
              <tr key={v.id}>
                <td className={styles.vehicleCell}>
                  <strong>{v.brand} {v.model}</strong>
                  <span>{v.plate}</span>
                </td>
                {days.map((day, i) => {
                  const res = getReservationForDay(v.id, day);
                  const isStart = res && new Date(res.start_date).toDateString() === day.toDateString();
                  return (
                    <td 
                      key={i} className={styles.dayCell}
                      onDragOver={handleDragOver}
                      onDrop={(e) => onDrop(e, v.id, day)}
                    >
                      {res && (
                        <div 
                          className={`${styles.reservationBar} ${styles[res.status]}`}
                          onClick={() => onSelectReservation(res)}
                          draggable
                          onDragStart={(e) => onDragStart(e, res)}
                          style={{ cursor: 'grab' }}
                          title="Glisser pour déplacer"
                        >
                          {isStart && <span className={styles.resLabel}>R#{res.id}</span>}
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
