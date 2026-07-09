"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  Percent,
  BarChart3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { cn } from "@/shared/utils";
import { fmt } from "@/shared/utils/format";

interface ForecastData {
  month: string;
  actual: number | null;
  forecast: number;
  lower: number;
  upper: number;
}

export default function RevenueForecast() {
  const [data, setData] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const historical = [
      { month: "Jan", actual: 125000, forecast: 125000, lower: 125000, upper: 125000 },
      { month: "Fév", actual: 132000, forecast: 132000, lower: 132000, upper: 132000 },
      { month: "Mar", actual: 148000, forecast: 148000, lower: 148000, upper: 148000 },
      { month: "Avr", actual: 155000, forecast: 155000, lower: 155000, upper: 155000 },
      { month: "Mai", actual: 168000, forecast: 168000, lower: 168000, upper: 168000 },
      { month: "Jun", actual: 175000, forecast: 175000, lower: 175000, upper: 175000 },
      { month: "Jul", actual: 192000, forecast: 192000, lower: 192000, upper: 192000 },
      { month: "Août", actual: null, forecast: 185000, lower: 165000, upper: 205000 },
      { month: "Sep", actual: null, forecast: 158000, lower: 138000, upper: 178000 },
      { month: "Oct", actual: null, forecast: 142000, lower: 122000, upper: 162000 },
    ];
    setTimeout(() => { setData(historical); setLoading(false); }, 300);
  }, []);

  const stats = useMemo(() => {
    const actualTotal = data.filter(d => d.actual !== null).reduce((sum, d) => sum + (d.actual || 0), 0);
    const forecastTotal = data.filter(d => d.actual === null).reduce((sum, d) => sum + d.forecast, 0);
    const projectedYear = actualTotal + forecastTotal;
    return { actualTotal, forecastTotal, projectedYear, confidence: 87 };
  }, [data]);

  if (loading) {
    return (
      <div className="bg-white border border-border rounded-2xl p-20 text-center flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-ink-3">Calcul des prévisions...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <BarChart3 size={18} className="text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-ink-1 uppercase tracking-wider text-sm">Prévisions Revenus</h3>
          <p className="text-[10px] text-ink-3 font-bold uppercase tracking-widest">Projection 3 mois</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-surface-1 rounded-xl p-4 border border-border">
          <p className="text-[10px] font-bold text-ink-3 uppercase tracking-widest mb-1 flex items-center gap-1">
            <DollarSign size={12} /> Réel (7 mois)
          </p>
          <p className="text-lg font-black text-ink-1">{fmt(stats.actualTotal)} <span className="text-[10px] text-ink-3">DH</span></p>
        </div>
        <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1 flex items-center gap-1">
            <TrendingUp size={12} /> Prévu (3 mois)
          </p>
          <p className="text-lg font-black text-primary">{fmt(stats.forecastTotal)} <span className="text-[10px] text-primary/60">DH</span></p>
        </div>
        <div className="bg-surface-1 rounded-xl p-4 border border-border">
          <p className="text-[10px] font-bold text-ink-3 uppercase tracking-widest mb-1 flex items-center gap-1">
            <Percent size={12} /> Confiance
          </p>
          <p className="text-lg font-black text-ink-1">{stats.confidence}<span className="text-[10px] text-ink-3">%</span></p>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#c9a84c" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="confidenceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.08} />
                <stop offset="95%" stopColor="#c9a84c" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 700 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 700 }} tickFormatter={(v) => `${v / 1000}k`} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", padding: 12 }}
              formatter={(val, name) => [`${fmt(Number(val))} DH`, name === "actual" ? "Réel" : name === "forecast" ? "Prévu" : ""]}
            />
            <Area type="monotone" dataKey="upper" stroke="none" fill="url(#confidenceGrad)" />
            <Area type="monotone" dataKey="lower" stroke="none" fill="#fff" />
            <Area type="monotone" dataKey="forecast" stroke="#c9a84c" strokeWidth={2} strokeDasharray="6 4" fill="url(#forecastGrad)" dot={false} />
            <Area type="monotone" dataKey="actual" stroke="#c9a84c" strokeWidth={3} fill="none" dot={{ fill: "#c9a84c", r: 4, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6, strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-primary rounded" />
          <span className="text-[10px] font-bold text-ink-3 uppercase tracking-widest">Réel</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-primary rounded border-dashed" style={{ borderTop: "2px dashed #c9a84c", height: 0 }} />
          <span className="text-[10px] font-bold text-ink-3 uppercase tracking-widest">Prévu</span>
        </div>
      </div>
    </div>
  );
}
