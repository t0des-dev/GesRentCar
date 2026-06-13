"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Loader2 } from "lucide-react";
import api from "@/lib/api/client";

// Modular Components
import CalendarHeader from "@/components/admin/calendar/CalendarHeader";
import CalendarGrid from "@/components/admin/calendar/CalendarGrid";
import CalendarReservationModal from "@/components/admin/calendar/CalendarReservationModal";

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
    while (date.getMonth() === month) { days.push(new Date(date)); date.setDate(date.getDate() + 1); }
    return days;
  }, [currentMonth]);

  const fetchData = async () => {
    try {
      const [resRes, vehRes] = await Promise.all([api.get('/stats/calendar'), api.get('/vehicles')]);
      setData(resRes.data);
      setVehicles(Array.isArray(vehRes.data) ? vehRes.data : vehRes.data.data || []);
    } catch { alert("Erreur de chargement."); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (!checking && user) fetchData(); }, [checking, user]);

  const getReservationForDay = (vehicleId: number, day: Date) => {
    return data.find(r => {
      const start = new Date(r.start_date);
      const end = new Date(r.end_date);
      const current = new Date(day);
      current.setHours(0,0,0,0); start.setHours(0,0,0,0); end.setHours(0,0,0,0);
      return r.vehicle_id === vehicleId && current >= start && current <= end;
    });
  };

  const handleDrop = async (e: React.DragEvent, targetVehicleId: number, targetDay: Date) => {
    e.preventDefault();
    const resData = e.dataTransfer.getData("res");
    if (!resData) return;
    const res = JSON.parse(resData);
    const oldStart = new Date(res.start_date);
    const oldEnd = new Date(res.end_date);
    const diffDays = Math.ceil(Math.abs(oldEnd.getTime() - oldStart.getTime()) / (1000 * 60 * 60 * 24)); 
    const newStart = new Date(targetDay); newStart.setHours(12, 0, 0, 0);
    const newEnd = new Date(targetDay); newEnd.setDate(newEnd.getDate() + diffDays); newEnd.setHours(12, 0, 0, 0);
    
    try {
      await api.put(`/reservations/${res.id}`, { vehicle_id: targetVehicleId, start_date: newStart.toISOString().split('T')[0], end_date: newEnd.toISOString().split('T')[0] });
      fetchData();
    } catch (err: any) { alert(err.response?.data?.message || "Conflit de disponibilité."); }
  };

  if (checking || loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="animate-spin text-primary" size={32} />
      <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Chargement du planning...</p>
    </div>
  );

  return (
    <div className="page-container">
      <CalendarHeader 
        currentMonth={currentMonth} 
        onPrev={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} 
        onNext={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} 
      />

      <CalendarGrid 
        days={daysInMonth} 
        vehicles={vehicles} 
        getReservationForDay={getReservationForDay} 
        onSelectReservation={setSelectedRes} 
        onDragStart={(e, res) => e.dataTransfer.setData("res", JSON.stringify(res))} 
        onDrop={handleDrop} 
      />

      <CalendarReservationModal 
        reservation={selectedRes} 
        onClose={() => setSelectedRes(null)} 
        apiUrl={API} 
      />
    </div>
  );
}
