"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import PricingSimulator from "@/components/PricingSimulator";
import ProfitabilityTable from "@/components/ProfitabilityTable";
import styles from "./page.module.css";
import api from "@/lib/api/client";
import { Reservation, DashboardStats } from "@/types/admin";

// Modular Components
import DashboardHeader from "@/components/admin/dashboard/DashboardHeader";
import StatCards from "@/components/admin/dashboard/StatCards";
import FleetCalendar from "@/components/admin/dashboard/FleetCalendar";
import ReservationsTable from "@/components/admin/dashboard/ReservationsTable";
import MaintenanceAlerts from "@/components/admin/dashboard/MaintenanceAlerts";
import DocumentPreviewModal from "@/components/admin/dashboard/DocumentPreviewModal";
import { PerformanceCharts, PopularModels } from "@/components/admin/dashboard/DashboardAnalytics";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export default function AdminDashboard() {
  const { user, checking } = useAuthGuard("admin");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [previewDocs, setPreviewDocs] = useState<{cin?: string, license?: string, name?: string} | null>(null);

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

  useEffect(() => { if (!checking && user) fetchData(); }, [fetchData, checking, user]);

  if (checking) return <div className="flex items-center justify-center h-[60vh] text-slate-400">Vérification de la session...</div>;

  const handleAction = async (id: number, action: "accept" | "reject") => {
    setActionLoading(id);
    try { await api.post(`/reservations/${id}/${action}`); await fetchData(); }
    catch (_err) { /* ignore */ } finally { setActionLoading(null); }
  };

  const handleGenerateContract = async (id: number) => {
    setActionLoading(id);
    try { await api.post(`/reservations/${id}/contract`); await fetchData(); }
    catch { alert("Erreur génération"); } finally { setActionLoading(null); }
  };

  const handleExport = () => {
    const token = localStorage.getItem("auth_token") || "";
    window.open(`${API}/exports/reservations?token=${token}`, "_blank");
  };

  return (
    <div className={styles.page}>
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

      <FleetCalendar reservations={reservations} />

      <ReservationsTable 
        reservations={reservations} 
        onAction={handleAction} 
        onGenerateContract={handleGenerateContract}
        onPreviewDocs={setPreviewDocs}
        actionLoading={actionLoading}
      />

      <MaintenanceAlerts alerts={stats?.maintenance_alerts} />
      <DocumentPreviewModal docs={previewDocs} onClose={() => setPreviewDocs(null)} />
    </div>
  );
}
