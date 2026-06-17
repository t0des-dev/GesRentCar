"use client";

import { motion } from "framer-motion";
import { TrendingUp, Car, Trophy, Wallet } from "lucide-react";
import RevenueChart from "@/components/RevenueChart";
import FleetPieChart from "@/components/FleetPieChart";
import { cn } from "@/shared/utils";
import { fmt } from "@/shared/utils/format";

interface PerformanceChartsProps {
  stats: any;
}

function SectionHeader({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-lg bg-gold/20 border-2 border-gold/40 flex items-center justify-center">
        <Icon size={20} className="text-gold" strokeWidth={2} />
      </div>
      <h2 className="text-xl font-bold text-ink-1 tracking-tight font-serif">{label}</h2>
    </div>
  );
}

export function PerformanceCharts({ stats }: PerformanceChartsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10"
    >
      <div className="bg-white rounded-2xl border-2 border-border shadow-lg p-6 md:p-8 card-premium">
        <SectionHeader icon={TrendingUp} label="Croissance des Revenus" />
        <RevenueChart data={stats.revenue_history || []} />
      </div>
      <div className="bg-white rounded-2xl border-2 border-border shadow-lg p-6 md:p-8 card-premium">
        <SectionHeader icon={Car} label="État de la Flotte" />
        <FleetPieChart data={stats.fleet_distribution || []} />
      </div>
    </motion.div>
  );
}

export function PopularModels({ stats }: { stats: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10"
    >
      <div className="bg-white rounded-2xl border-2 border-border shadow-lg p-6 md:p-8 card-premium">
        <SectionHeader icon={Trophy} label="Modèles les plus Demandés" />
        <div className="space-y-3">
          {stats.top_vehicles?.map((v: any, i: number) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              whileHover={{ y: -2 }}
              className="flex items-center justify-between p-4 bg-surface-1 rounded-xl border-2 border-border hover:border-gold/40 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center font-bold text-sm border-2",
                  i === 0 ? "bg-gold/20 border-gold text-gold" : 
                  i === 1 ? "bg-surface-2 border-border text-ink-2" : 
                  i === 2 ? "bg-amber-500/20 border-amber-400/40 text-amber-500" :
                  "bg-surface-2 border-border text-ink-3"
                )}>
                  #{i + 1}
                </div>
                <div>
                  <p className="font-bold text-ink-1 leading-none mb-1">{v.brand} {v.model}</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-3">{v.count} réservations</p>
                </div>
              </div>
              <p className="font-bold text-gold">{fmt(v.revenue)} DH</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border-2 border-border shadow-lg p-6 md:p-8 card-premium">
        <SectionHeader icon={Wallet} label="Encaissements" />
        <FleetPieChart data={stats.payment_status || []} />
      </div>
    </motion.div>
  );
}