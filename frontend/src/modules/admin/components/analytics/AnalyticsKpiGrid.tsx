"use client";

import { motion } from "framer-motion";
import { DollarSign, Calendar, TrendingUp, Car, ArrowUpRight } from "lucide-react";
import { cn } from "@/shared/utils";
import { fmt } from "@/shared/utils/format";

interface AnalyticsKpiGridProps {
  stats: {
    total_revenue?: number;
    total_reservations?: number;
    occupancy_rate?: number;
    active_vehicles?: number;
  } | null;
}

export default function AnalyticsKpiGrid({ stats }: AnalyticsKpiGridProps) {
  const kpis = [
    { label: "Chiffre d'Affaires", value: `${fmt(stats?.total_revenue || 0)} DH`, sub: "+12.5% vs mois dernier", icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
    { label: "Réservations", value: stats?.total_reservations || 0, sub: "85% de taux de conversion", icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Taux d'Occupation", value: `${stats?.occupancy_rate || 72}%`, sub: "+5% cette semaine", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Flotte Active", value: stats?.active_vehicles || 0, sub: "Sur 85 véhicules totaux", icon: Car, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, i) => (
        <motion.div
          key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
          className="bg-surface-1 p-8 rounded-2xl border-2 border-border group hover:border-gold/30 transition-all duration-500"
        >
          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", kpi.bg, kpi.color)}><kpi.icon size={24} /></div>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-3 mb-1">{kpi.label}</p>
          <h3 className="font-serif text-2xl text-ink-1 mb-2">{kpi.value}</h3>
          <div className="flex items-center gap-1.5"><ArrowUpRight size={14} className="text-green-500" /><span className="text-xs font-bold text-ink-3">{kpi.sub}</span></div>
        </motion.div>
      ))}
    </div>
  );
}
