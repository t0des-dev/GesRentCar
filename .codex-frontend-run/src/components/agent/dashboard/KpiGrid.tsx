"use client";

import { motion } from "framer-motion";
import { TrendingUp, Car, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiGridProps {
  stats: {
    totalRevenue: number;
    pickups: number;
    returns: number;
    active: number;
  };
  loading: boolean;
}

export default function KpiGrid({ stats, loading }: KpiGridProps) {
  const kpis = [
    { label: "Chiffre d'Affaires", value: `${stats.totalRevenue.toLocaleString("fr-FR")} DH`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Départs Aujourd'hui", value: stats.pickups, icon: Car, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Retours Aujourd'hui", value: stats.returns, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Locations Actives", value: stats.active, icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {kpis.map(({ label, value, icon: Icon, color, bg }) => (
        <motion.div 
          key={label}
          whileHover={{ y: -4 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-0 rounded-2xl border-2 border-border p-5 shadow-sm flex flex-col gap-4"
        >
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", bg, color)}>
            <Icon size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-ink-3">{label}</p>
            <p className={cn("text-xl font-bold", color)}>
              {loading ? "..." : value}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
