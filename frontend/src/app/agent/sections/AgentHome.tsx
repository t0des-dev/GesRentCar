"use client";

import { useEffect, useState, useMemo } from "react";
import { Car, ArrowRight } from "lucide-react";

// Modular Sub-components
import KpiGrid from "@/modules/agent/components/dashboard/KpiGrid";
import RecentActivity from "@/modules/agent/components/dashboard/RecentActivity";
import QuickActions from "@/modules/agent/components/dashboard/QuickActions";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const getToken = () => typeof window !== "undefined" ? localStorage.getItem("vectoria_token") || "" : "";

export default function AgentHome({ onNewRental }: { onNewRental: () => void }) {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    const u = localStorage.getItem("vectoria_user");
    if (u) setUser(JSON.parse(u));

    fetch(`${API}/reservations`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then((d) => { setReservations(Array.isArray(d) ? d : d.data ?? []); })
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return {
      totalRevenue: reservations.reduce((s, r) => s + (parseFloat(r.total_price) || 0), 0),
      pickups: reservations.filter((r) => r.start_date?.split('T')[0] === today).length,
      returns: reservations.filter((r) => r.end_date?.split('T')[0] === today).length,
      active: reservations.filter((r) => r.status === "confirmed").length,
    };
  }, [reservations]);

  return (
    <div className="space-y-10">
      {/* Salutation & Date */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">
            Bonjour, <span className="text-primary">{user?.name?.split(" ")[0] ?? "Agent"}</span>
          </h2>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-slate-400 font-medium text-xs uppercase tracking-widest">
              {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
            <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-semibold text-emerald-600 uppercase tracking-widest">Live</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onNewRental}
          className="btn-primary flex items-center gap-3 text-[10px]"
        >
          <Car size={18} />
          Nouvelle Location
          <ArrowRight size={16} />
        </button>
      </div>

      <KpiGrid stats={stats} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentActivity reservations={reservations} loading={loading} />
        <QuickActions />
      </div>
    </div>
  );
}
