"use client";

import { motion } from "framer-motion";
import RevenueChart from "@/components/RevenueChart";
import FleetPieChart from "@/components/FleetPieChart";

interface AnalyticsChartsProps {
  revenueData: any[];
  fleetData: any;
}

export default function AnalyticsCharts({ revenueData, fleetData }: AnalyticsChartsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-2 card-premium p-10 rounded-2xl border-2 border-border"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h4 className="font-serif text-lg text-ink-1">Performance des Revenus</h4>
            <p className="text-xs font-bold uppercase tracking-wider text-ink-3">Chiffre d'affaires par catégorie</p>
          </div>
        </div>
        <RevenueChart data={revenueData} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-premium p-10 rounded-2xl border-2 border-border flex flex-col"
      >
        <div className="mb-8">
          <h4 className="font-serif text-lg text-ink-1">Répartition Flotte</h4>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-3">Utilisation vs Disponibilité</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <FleetPieChart data={[
            { name: "Occupés", value: fleetData?.occupied_vehicles || 35 },
            { name: "Libres", value: fleetData?.free_vehicles || 15 }
          ]} />
        </div>
        <div className="mt-8 space-y-3">
          <div className="flex items-center justify-between p-4 bg-surface-2 rounded-2xl">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary" /><span className="text-xs font-bold text-ink-2">En location</span></div>
            <span className="text-xs font-bold text-ink-1">{fleetData?.occupied_vehicles || 35} vhc.</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-surface-2 rounded-2xl">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-300" /><span className="text-xs font-bold text-ink-2">Disponibles</span></div>
            <span className="text-xs font-bold text-ink-1">{fleetData?.free_vehicles || 15} vhc.</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
