"use client";

import { useEffect, useState } from "react";
import { Car, Calendar, TrendingUp, ArrowRight, Clock, CheckCircle2, LayoutDashboard, Search, FileCheck } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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

  const today = new Date().toISOString().split("T")[0];
  const todayPickups  = reservations.filter((r) => r.start_date?.split('T')[0] === today);
  const todayReturns  = reservations.filter((r) => r.end_date?.split('T')[0]   === today);
  const activeRentals = reservations.filter((r) => r.status === "confirmed");
  const totalRevenue  = reservations.reduce((s, r) => s + (parseFloat(r.total_price) || 0), 0);

  const kpis = [
    { label: "Chiffre d'Affaires", value: `${totalRevenue.toLocaleString("fr-FR")} DH`, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Départs Aujourd'hui", value: todayPickups.length, icon: Car, color: "text-indigo-500", bg: "bg-indigo-50" },
    { label: "Retours Aujourd'hui", value: todayReturns.length, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Locations Actives", value: activeRentals.length, icon: CheckCircle2, color: "text-blue-500", bg: "bg-blue-50" },
  ];

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

      {/* KPI Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map(({ label, value, icon: Icon, color, bg }) => (
          <motion.div 
            key={label}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col gap-6"
          >
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform", bg, color)}>
              <Icon size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
              <p className={cn("text-2xl font-black", color)}>
                {loading ? "..." : value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid: Recent Activity & Search */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Reservations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] flex items-center gap-3">
              <Calendar size={14} className="text-primary" />
              Réservations Récentes
            </h3>
            <button className="text-[9px] font-black text-primary uppercase tracking-widest hover:border-b border-primary pb-1 transition-all">
              Tout voir
            </button>
          </div>
          
          <div className="bg-slate-50/50 rounded-[48px] border border-slate-100 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-slate-300 animate-pulse uppercase text-[10px] font-black tracking-widest">
                Chargement des données...
              </div>
            ) : reservations.length === 0 ? (
              <div className="p-20 text-center space-y-4">
                <Search size={48} className="text-slate-100 mx-auto" />
                <p className="text-slate-300 italic text-sm">Aucune activité enregistrée.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {reservations.slice(0, 5).map((r) => (
                  <div key={r.id} className="p-6 flex items-center justify-between hover:bg-white transition-colors group">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center font-black text-xs text-slate-400 shadow-sm">
                        #{r.id?.toString().padStart(4, "0")}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-sm group-hover:text-primary transition-colors">
                          {r.vehicle ? `${r.vehicle.brand} ${r.vehicle.model}` : "Véhicule Premium"}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {r.start_date?.split('T')[0]} → {r.end_date?.split('T')[0]}
                        </p>
                      </div>
                    </div>
                    <div className={cn(
                      "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                      r.status === 'confirmed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                      r.status === 'pending' ? "bg-amber-50 text-amber-600 border-amber-100" :
                      "bg-slate-50 text-slate-400 border-slate-100"
                    )}>
                      {r.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions / Tips */}
        <div className="space-y-6">
          <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] px-2 flex items-center gap-3">
             <LayoutDashboard size={14} className="text-primary" />
             Raccourcis VIP
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {[
              { label: "Gérer le Parc", icon: Car, desc: "Inventaire & Dispo" },
              { label: "Contrats PDF", icon: FileCheck, desc: "Historique Signature" },
              { label: "Performance", icon: TrendingUp, desc: "Analyses de l'Agence" },
            ].map((action, i) => (
              <button 
                key={i} 
                className="w-full p-6 bg-white border border-slate-100 rounded-[32px] text-left hover:shadow-xl hover:shadow-slate-200/40 transition-all group flex items-center gap-5"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                  <action.icon size={20} />
                </div>
                <div>
                  <p className="font-black text-slate-900 text-xs uppercase tracking-widest mb-1">{action.label}</p>
                  <p className="text-[10px] text-slate-400 font-bold">{action.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
