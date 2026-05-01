"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Loader2, Info, X, User, FileText, Clock } from "lucide-react";
import styles from "./page.module.css";
import api from "@/lib/api/client";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export default function CalendarPage() {
  const { user, checking } = useAuthGuard("admin");
  const [data, setData] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedRes, setSelectedRes] = useState<any>(null);

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [currentMonth]);

  const fetchData = async () => {
    try {
      const [resRes, vehRes] = await Promise.all([
        api.get('/stats/calendar'),
        api.get('/vehicles')
      ]);
      setData(resRes.data);
      setVehicles(Array.isArray(vehRes.data) ? vehRes.data : vehRes.data.data || []);
    } catch {
      alert("Erreur de chargement du calendrier.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!checking && user) fetchData();
  }, [checking, user]);

  const getReservationForDay = (vehicleId: number, day: Date) => {
    return data.find(r => {
      const start = new Date(r.start_date);
      const end = new Date(r.end_date);
      const current = new Date(day);
      current.setHours(0,0,0,0);
      start.setHours(0,0,0,0);
      end.setHours(0,0,0,0);
      return r.vehicle_id === vehicleId && current >= start && current <= end;
    });
  };

  const handleDragStart = (e: React.DragEvent, res: any) => {
    e.dataTransfer.setData("res", JSON.stringify(res));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = async (e: React.DragEvent, targetVehicleId: number, targetDay: Date) => {
    e.preventDefault();
    const resData = e.dataTransfer.getData("res");
    if (!resData) return;
    const res = JSON.parse(resData);
    
    const oldStart = new Date(res.start_date);
    const oldEnd = new Date(res.end_date);
    const diffDays = Math.ceil(Math.abs(oldEnd.getTime() - oldStart.getTime()) / (1000 * 60 * 60 * 24)); 

    const newStart = new Date(targetDay);
    newStart.setHours(12, 0, 0, 0); // Avoid timezone issues
    
    const newEnd = new Date(targetDay);
    newEnd.setDate(newEnd.getDate() + diffDays);
    newEnd.setHours(12, 0, 0, 0);
    
    const newStartStr = newStart.toISOString().split('T')[0];
    const newEndStr = newEnd.toISOString().split('T')[0];

    try {
      await api.put(`/reservations/${res.id}`, {
        vehicle_id: targetVehicleId,
        start_date: newStartStr,
        end_date: newEndStr
      });
      fetchData(); // Refresh the calendar
    } catch (err: any) {
      alert(err.response?.data?.message || "Conflit de disponibilité. Le véhicule est occupé.");
    }
  };

  if (checking || loading) return <div className={styles.loader}><Loader2 className={styles.spin} /> Chargement du planning...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <CalendarIcon size={24} color="#6366f1" />
          <div>
            <h1>Planning de la Flotte</h1>
            <p>Vue d'ensemble des réservations et disponibilités.</p>
          </div>
        </div>
        <div className={styles.controls}>
          <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}>
            <ChevronLeft size={20} />
          </button>
          <h2>{currentMonth.toLocaleString('fr-FR', { month: 'long', year: 'numeric' }).toUpperCase()}</h2>
          <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}>
            <ChevronRight size={20} />
          </button>
        </div>
      </header>

      <div className={styles.calendarWrapper}>
        <div className={styles.tableScroll}>
          <table className={styles.calendarTable}>
            <thead>
              <tr>
                <th className={styles.vehicleHeader}>Véhicule</th>
                {daysInMonth.map((day, i) => (
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
                  {daysInMonth.map((day, i) => {
                    const res = getReservationForDay(v.id, day);
                    const isStart = res && new Date(res.start_date).toDateString() === day.toDateString();
                    return (
                      <td 
                        key={i} 
                        className={styles.dayCell}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, v.id, day)}
                      >
                        {res && (
                          <div 
                            className={`${styles.reservationBar} ${styles[res.status]}`}
                            onClick={() => setSelectedRes(res)}
                            draggable
                            onDragStart={(e) => handleDragStart(e, res)}
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

      {/* Reservation Details Modal */}
      {selectedRes && (
        <div className={styles.modalOverlay} onClick={() => setSelectedRes(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <header className={styles.modalHeader}>
              <div className={styles.resStatusBadge + ' ' + styles[selectedRes.status]}>
                #{selectedRes.id} - {selectedRes.status.toUpperCase()}
              </div>
              <button className={styles.closeBtn} onClick={() => setSelectedRes(null)}>
                <X size={20} />
              </button>
            </header>

            <div className={styles.modalContent}>
              <div className={styles.detailItem}>
                <User size={18} color="#6366f1" />
                <div>
                  <label>Client</label>
                  <strong>{selectedRes.client_name}</strong>
                </div>
              </div>

              <div className={styles.detailItem}>
                <Clock size={18} color="#6366f1" />
                <div>
                  <label>Période de location</label>
                  <strong>Du {new Date(selectedRes.start_date).toLocaleDateString('fr-FR')} au {new Date(selectedRes.end_date).toLocaleDateString('fr-FR')}</strong>
                </div>
              </div>

              <div className={styles.detailItem}>
                <FileText size={18} color="#6366f1" />
                <div>
                  <label>Documents</label>
                  <a 
                    href={`${API}/contracts/${selectedRes.id}/pdf?lang=fr&token=${localStorage.getItem('auth_token')}`} 
                    target="_blank"
                    className={styles.pdfLink}
                  >
                    Télécharger le Contrat (PDF)
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
