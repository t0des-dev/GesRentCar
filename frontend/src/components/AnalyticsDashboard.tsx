"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3, TrendingUp, Users, Car, Calendar, 
  ArrowUpRight, ArrowDownRight, DollarSign, 
  Download, Filter, RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api/client";
import { motion } from "framer-motion";
import RevenueChart from "./RevenueChart";
import FleetPieChart from "./FleetPieChart";
import ProfitabilityTable from "./ProfitabilityTable";

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [revenueData, setRevenueData] = useState([]);
  const [profitabilityData, setProfitabilityData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [generalRes, revenueRes, profitabilityRes] = await Promise.all([
        api.get("/stats/general"),
        api.get("/stats/revenue"),
        api.get("/stats/profitability")
      ]);

      setStats(generalRes.data);
      setRevenueData(revenueRes.data.map((item: any) => ({
        month: item.category || item.month || "N/A",
        revenue: Number(item.total_revenue || 0)
      })));
      setProfitabilityData(profitabilityRes.data);
    } catch (err) {
      console.error("Error fetching analytics data", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Compilation des données analytiques...</p>
      </div>
    );
  }

  const kpis = [
    { label: "Chiffre d'Affaires", value: `${Number(stats?.total_revenue || 0).toLocaleString()} DH`, sub: "+12.5% vs mois dernier", icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
    { label: "Réservations", value: stats?.total_reservations || 0, sub: "85% de taux de conversion", icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Taux d'Occupation", value: `${stats?.occupancy_rate || 72}%`, sub: "+5% cette semaine", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Flotte Active", value: stats?.active_vehicles || 0, sub: "Sur 85 véhicules totaux", icon: Car, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="space-y-10">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Intelligence Opérationnelle</h2>
          <p className="text-slate-500 font-medium italic mt-1">Analyse approfondie de la performance et de la rentabilité.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchData} className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-primary transition-all">
            <RefreshCw size={18} />
          </button>
          <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-600 hover:border-primary hover:text-primary transition-all">
            <Filter size={14} /> Filtrer
          </button>
          <button className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-slate-900/20 hover:scale-105 transition-all">
            <Download size={14} /> Exporter Rapport
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[32px] border border-slate-200/60 shadow-sm group hover:border-primary/20 transition-all duration-500"
          >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", kpi.bg, kpi.color)}>
              <kpi.icon size={24} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{kpi.label}</p>
            <h3 className="text-2xl font-black text-slate-900 mb-2">{kpi.value}</h3>
            <div className="flex items-center gap-1.5">
              <ArrowUpRight size={14} className="text-green-500" />
              <span className="text-[11px] font-bold text-slate-400">{kpi.sub}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="font-black text-lg text-slate-900">Performance des Revenus</h4>
              <p className="text-xs text-slate-400 font-medium italic">Chiffre d'affaires par catégorie de véhicule</p>
            </div>
            <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none">
              <option>Les 30 derniers jours</option>
              <option>6 derniers mois</option>
            </select>
          </div>
          <RevenueChart data={revenueData} />
        </div>

        <div className="bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm flex flex-col">
          <div className="mb-8">
            <h4 className="font-black text-lg text-slate-900">Répartition Flotte</h4>
            <p className="text-xs text-slate-400 font-medium italic">Utilisation vs Disponibilité</p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <FleetPieChart data={[
              { name: "Occupés", value: stats?.occupied_vehicles || 35 },
              { name: "Libres", value: stats?.free_vehicles || 15 }
            ]} />
          </div>
          <div className="mt-8 space-y-3">
             <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-xs font-bold text-slate-600">En location</span>
                </div>
                <span className="text-xs font-black text-slate-900">{stats?.occupied_vehicles || 35} vhc.</span>
             </div>
             <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-300" />
                  <span className="text-xs font-bold text-slate-600">Disponibles</span>
                </div>
                <span className="text-xs font-black text-slate-900">{stats?.free_vehicles || 15} vhc.</span>
             </div>
          </div>
        </div>
      </div>

      {/* Profitability Table */}
      <div className="bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h4 className="font-black text-lg text-slate-900">Rentabilité par Véhicule (ROI)</h4>
            <p className="text-xs text-slate-400 font-medium italic">Analyse croisée des revenus vs coûts de maintenance.</p>
          </div>
        </div>
        <ProfitabilityTable data={profitabilityData} />
      </div>
    </div>
  );
}
