"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Filter, Download } from "lucide-react";
import api from "@/lib/api/client";

// Modular Components
import AnalyticsKpiGrid from "./admin/analytics/AnalyticsKpiGrid";
import AnalyticsCharts from "./admin/analytics/AnalyticsCharts";
import ProfitabilitySection from "./admin/analytics/ProfitabilitySection";

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [revenueData, setRevenueData] = useState([]);
  const [profitabilityData, setProfitabilityData] = useState([]);

  useEffect(() => { fetchData(); }, []);

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
    } catch (err) { console.error("Error fetching analytics data", err); }
    finally { setLoading(false); }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Compilation des données analytiques...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Intelligence Opérationnelle</h2>
          <p className="text-slate-500 font-medium italic mt-1">Analyse approfondie de la performance et de la rentabilité.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchData} className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-primary transition-all"><RefreshCw size={18} /></button>
          <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-600 hover:border-primary hover:text-primary transition-all"><Filter size={14} /> Filtrer</button>
          <button className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-slate-900/20 hover:scale-105 transition-all"><Download size={14} /> Exporter Rapport</button>
        </div>
      </div>

      <AnalyticsKpiGrid stats={stats} />
      <AnalyticsCharts revenueData={revenueData} fleetData={stats} />
      <ProfitabilitySection data={profitabilityData} />
    </div>
  );
}
