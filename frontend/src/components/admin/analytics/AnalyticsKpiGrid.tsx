"use client";

import { motion } from "framer-motion";
import { DollarSign, Calendar, TrendingUp, Car, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyticsKpiGridProps {
  stats: any;
}

export default function AnalyticsKpiGrid({ stats }: AnalyticsKpiGridProps) {
  const kpis = [
    { label: "Chiffre d'Affaires", value: `${Number(stats?.total_revenue || 0).toLocaleString()} DH`, sub: "+12.5% vs mois dernier", icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
    { label: "Réservations", value: stats?.total_reservations || 0, sub: "85% de taux de conversion", icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Taux d'Occupation", value: `${stats?.occupancy_rate || 72}%`, sub: "+5% cette semaine", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Flotte Active", value: stats?.active_vehicles || 0, sub: "Sur 85 véhicules totaux", icon: Car, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, i) => (
        <motion.div 
          key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
          className="bg-white p-8 rounded-[32px] border border-slate-200/60 shadow-sm group hover:border-primary/20 transition-all duration-500"
        >
          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", kpi.bg, kpi.color)}><kpi.icon size={24} /></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{kpi.label}</p>
          <h3 className="text-2xl font-black text-slate-900 mb-2">{kpi.value}</h3>
          <div className="flex items-center gap-1.5"><ArrowUpRight size={14} className="text-green-500" /><span className="text-[11px] font-bold text-slate-400">{kpi.sub}</span></div>
        </motion.div>
      ))}
    </div>
  );
}
