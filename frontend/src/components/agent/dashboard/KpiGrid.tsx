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
    { label: "Chiffre d'Affaires", value: `${stats.totalRevenue.toLocaleString("fr-FR")} DH`, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Départs Aujourd'hui", value: stats.pickups, icon: Car, color: "text-indigo-500", bg: "bg-indigo-50" },
    { label: "Retours Aujourd'hui", value: stats.returns, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Locations Actives", value: stats.active, icon: CheckCircle2, color: "text-blue-500", bg: "bg-blue-50" },
  ];

  return (
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
  );
}
