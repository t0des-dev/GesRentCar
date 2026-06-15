"use client";

import { motion } from "framer-motion";
import { Car, Activity, Wrench, AlertTriangle } from "lucide-react";

interface FleetKPIsProps {
  total: number;
  available: number;
  maintenance: number;
  alerts: number;
}

export default function FleetKPIs({ total, available, maintenance, alerts }: FleetKPIsProps) {
  const availabilityRate = total > 0 ? Math.round((available / total) * 100) : 0;

  const kpis = [
    {
      title: "Flotte Totale",
      value: total,
      icon: Car,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-100",
    },
    {
      title: "Disponibilité",
      value: `${availabilityRate}%`,
      icon: Activity,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-100",
    },
    {
      title: "En Maintenance",
      value: maintenance,
      icon: Wrench,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-100",
    },
    {
      title: "Alertes Papiers",
      value: alerts,
      icon: AlertTriangle,
      color: alerts > 0 ? "text-red-500" : "text-slate-400",
      bg: alerts > 0 ? "bg-red-500/10" : "bg-slate-100",
      border: alerts > 0 ? "border-red-100" : "border-slate-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {kpis.map((kpi, idx) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={`flex items-center gap-4 p-5 rounded-2xl border bg-white shadow-sm ${kpi.border}`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${kpi.bg} ${kpi.color}`}>
            <kpi.icon size={24} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{kpi.title}</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{kpi.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
