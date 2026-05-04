"use client";

import { TrendingUp, Car, Trophy, Wallet } from "lucide-react";
import RevenueChart from "@/components/RevenueChart";
import FleetPieChart from "@/components/FleetPieChart";
import styles from "@/app/admin/page.module.css";

interface PerformanceChartsProps {
  stats: any;
}

export function PerformanceCharts({ stats }: PerformanceChartsProps) {
  return (
    <div className={styles.chartsGrid}>
      <div className={styles.chartCard}>
        <div className={styles.sectionHeader}>
          <div className="bg-primary/10 p-3 rounded-2xl"><TrendingUp size={20} className="text-primary" /></div>
          <h2>Croissance des Revenus</h2>
        </div>
        <RevenueChart data={stats.revenue_history || []} />
      </div>
      <div className={styles.chartCard}>
        <div className={styles.sectionHeader}>
          <div className="bg-slate-100 p-3 rounded-2xl"><Car size={20} className="text-slate-600" /></div>
          <h2>État de la Flotte</h2>
        </div>
        <FleetPieChart data={stats.fleet_distribution || []} />
      </div>
    </div>
  );
}

export function PopularModels({ stats }: { stats: any }) {
  return (
    <div className={styles.chartsGrid}>
      <div className={styles.chartCard}>
        <div className={styles.sectionHeader}>
          <div className="bg-yellow-50 p-3 rounded-2xl"><Trophy size={20} className="text-yellow-500" /></div>
          <h2>Modèles les plus Demandés</h2>
        </div>
        <div className="space-y-3">
          {stats.top_vehicles?.map((v: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/20 transition-all hover:bg-white hover:shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm text-primary flex items-center justify-center font-black text-sm border border-slate-100">#{i + 1}</div>
                <div>
                  <p className="font-bold text-slate-900 leading-none mb-1">{v.brand} {v.model}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{v.count} réservations</p>
                </div>
              </div>
              <div className="text-right"><p className="font-black text-slate-900">{v.revenue.toLocaleString()} DH</p></div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.chartCard}>
        <div className={styles.sectionHeader}>
          <div className="bg-indigo-50 p-3 rounded-2xl"><Wallet size={20} className="text-primary" /></div>
          <h2>Encaissements</h2>
        </div>
        <FleetPieChart data={stats.payment_status || []} />
      </div>
    </div>
  );
}
