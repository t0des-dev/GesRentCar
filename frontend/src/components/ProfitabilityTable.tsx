"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

interface VehicleProfit {
  brand: string;
  model: string;
  plate: string;
  total_revenue: number;
  total_costs: number;
  net_profit: number;
}

export default function ProfitabilityTable() {
  const [data, setData] = useState<VehicleProfit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/stats/profitability")
      .then(res => setData(res.data))
      .catch(err => console.error("Profitability fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center opacity-50 uppercase tracking-widest text-[10px]">Analyse de rentabilité...</div>;

  return (
    <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
      <div className="p-10 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-white/[0.02] to-transparent">
        <div>
          <p className="text-[9px] font-black text-primary uppercase tracking-[0.4em] mb-2">Performance Financière</p>
          <h3 className="font-black text-white text-xl tracking-tighter flex items-center gap-3">
            <DollarSign className="text-primary" size={24} strokeWidth={3} />
            Rentabilité de la Flotte
          </h3>
        </div>
        <div className="text-right">
          <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
            Live Analytics
          </span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02]">
              <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Véhicule</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Revenus Bruts</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Charges (Maint.)</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Marge Nette</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((v, i) => (
              <tr key={v.plate} className="group hover:bg-white/[0.03] transition-all duration-500">
                <td className="px-10 py-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:border-primary/30 transition-all duration-500">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <p className="text-base font-black text-white tracking-tight group-hover:text-primary transition-colors duration-500">{v.brand} {v.model}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{v.plate}</p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8 text-right font-bold text-slate-200">
                  <span className="text-xs text-slate-500 mr-1 font-medium">DH</span>
                  {Number(v.total_revenue).toLocaleString()}
                </td>
                <td className="px-10 py-8 text-right font-bold text-rose-500/70">
                  <span className="text-xs mr-1 font-medium">-DH</span>
                  {Number(v.total_costs).toLocaleString()}
                </td>
                <td className="px-10 py-8 text-right">
                  <div className={cn(
                    "inline-flex flex-col items-end px-6 py-3 rounded-2xl border transition-all duration-500",
                    v.net_profit >= 0 
                      ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30" 
                      : "bg-rose-500/5 border-rose-500/10 text-rose-500 group-hover:bg-rose-500/10 group-hover:border-rose-500/30"
                  )}>
                    <div className="flex items-center gap-2 font-black text-lg tracking-tighter">
                      {Number(v.net_profit).toLocaleString()} DH
                      {v.net_profit >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-60">
                      {v.net_profit >= 0 ? "Profit Net" : "Déficit"}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-8 bg-white/[0.01] border-t border-white/5 text-center">
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">
          Données consolidées basées sur les flux réels de trésorerie
        </p>
      </div>
    </div>
  );
}
