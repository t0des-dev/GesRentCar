"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthGuard } from "@/modules/auth/hooks/useAuthGuard";
import PricingSimulator from "@/components/PricingSimulator";
import ProfitabilityTable from "@/components/ProfitabilityTable";
import api from "@/shared/services/client";
import { Reservation, DashboardStats } from "@/types/admin";

// Modular Components
import DashboardHeader from "@/modules/admin/components/dashboard/DashboardHeader";
import StatCards from "@/modules/admin/components/dashboard/StatCards";
import FleetCalendar from "@/modules/admin/components/dashboard/FleetCalendar";
import ReservationDrawer from "@/modules/admin/components/dashboard/ReservationDrawer";
import MaintenanceAlerts from "@/modules/admin/components/dashboard/MaintenanceAlerts";
import { PerformanceCharts, PopularModels } from "@/modules/admin/components/dashboard/DashboardAnalytics";
import { notifyError } from "@/components/Notifications";
import MaintenanceScheduler from "@/components/MaintenanceScheduler";
import RevenueForecast from "@/components/RevenueForecast";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export default function AdminDashboard() {
  const { user, checking } = useAuthGuard("admin");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [drawerReservation, setDrawerReservation] = useState<Reservation | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, resRes] = await Promise.all([api.get("/stats"), api.get("/reservations")]);
      setStats(statsRes.data);
      setReservations(Array.isArray(resRes.data) ? resRes.data : resRes.data.data ?? []);
    } catch {
      setStats({
        revenue: 6000, reservations_count: 1, active_bookings: 1, occupancy_rate: 25,
        revenue_history: [{ month: "Jan", revenue: 2000 }, { month: "Feb", revenue: 4000 }, { month: "Mar", revenue: 6000 }],
        fleet_distribution: [{ name: "Interne", value: 4 }, { name: "Partenaires", value: 2 }],
        top_vehicles: [{ brand: "Mercedes", model: "Class C", count: 12, revenue: 10200 }],
        payment_status: [{ name: "Payé", value: 45 }, { name: "En attente", value: 12 }]
      });
    } finally { setLoading(false); }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (!checking && user) fetchData(); }, [fetchData, checking, user]);

  if (checking) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Vérification de la session...</p>
    </div>
  );

  const handleGenerateContract = async (id: number) => {
    setActionLoading(id);
    try { await api.post(`/reservations/${id}/contract`); await fetchData(); }
    catch { notifyError("Erreur lors de la generation du contrat."); } finally { setActionLoading(null); }
  };

  const handleExport = () => {
    const token = localStorage.getItem("vectoria_token") || localStorage.getItem("auth_token") || "";
    window.open(`${API}/exports/reservations?token=${token}`, "_blank");
  };

  return (
    <>
      <DashboardHeader loading={loading} onRefresh={fetchData} onExport={handleExport} />
      <StatCards stats={stats} loading={loading} />

      {!loading && stats && (
        <>
          <PerformanceCharts stats={stats} />
          <div className="mb-12"><PricingSimulator /></div>
          <PopularModels stats={stats} />
        </>
      )}

      {!loading && <div className="mb-12"><ProfitabilityTable /></div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <RevenueForecast />
        <MaintenanceScheduler />
      </div>

      <FleetCalendar 
        reservations={reservations} 
        onReservationClick={setDrawerReservation} 
      />

      <MaintenanceAlerts alerts={stats?.maintenance_alerts} />

      {drawerReservation && (
        <ReservationDrawer 
          reservation={drawerReservation} 
          onClose={() => setDrawerReservation(null)}
          onGenerateContract={handleGenerateContract}
          actionLoading={actionLoading}
        />
      )}
    </>
  );
}
