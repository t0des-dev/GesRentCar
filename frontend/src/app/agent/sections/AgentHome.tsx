"use client";

import { useEffect, useState, useMemo } from "react";
import { Car, ArrowRight } from "lucide-react";

// Modular Sub-components
import KpiGrid from "@/components/agent/dashboard/KpiGrid";
import RecentActivity from "@/components/agent/dashboard/RecentActivity";
import QuickActions from "@/components/agent/dashboard/QuickActions";

const API = "http://localhost:8000/api";
const getToken = () => typeof window !== "undefined" ? localStorage.getItem("vectoria_token") || "" : "";

export default function AgentHome({ onNewRental }: { onNewRental: () => void }) {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

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
    <div className="space-y-12">
      {/* Salutation & Date */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">
            Bonjour, <span className="text-primary italic">{user?.name?.split(" ")[0] ?? "Agent"}</span> 👋
          </h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em]">
            {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <button 
          onClick={onNewRental}
          className="group flex items-center gap-4 bg-slate-900 text-white px-8 py-5 rounded-[24px] font-black uppercase text-[10px] tracking-[0.3em] hover:bg-primary shadow-2xl hover:shadow-primary/30 transition-all duration-500 overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Car size={20} className="relative z-10 group-hover:scale-110 transition-transform" />
          <span className="relative z-10">Nouvelle Location</span>
          <ArrowRight size={18} className="relative z-10 group-hover:translate-x-2 transition-transform" />
        </button>
      </div>

      <KpiGrid stats={stats} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RecentActivity reservations={reservations} loading={loading} />
        <QuickActions />
      </div>
    </div>
  );
}
