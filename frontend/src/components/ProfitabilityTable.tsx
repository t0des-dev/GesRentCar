"use client";

import { useState, useEffect } from "react";
import api from "@/shared/services/client";
import { cn } from "@/shared/utils";
import { TrendingUp, TrendingDown, DollarSign, Car } from "lucide-react";
import { fmt } from "@/shared/utils/format";

interface VehicleProfit {
  brand: string;
  model: string;
  plate: string;
  total_revenue: number;
  total_costs: number;
  net_profit: number;
}

export default function ProfitabilityTable({ data: initialData }: { data?: VehicleProfit[] }) {
  const [data, setData] = useState<VehicleProfit[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (!initialData) {
      api.get("/stats/profitability")
        .then(res => setData(res.data))
        .catch(err => console.error("Profitability fetch error:", err))
        .finally(() => setLoading(false));
    } else {
      setData(initialData);
      setLoading(false);
    }
  }, [initialData]);

  if (loading) return (
    <div className="p-20 text-center flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Calcul du ROI en cours...</p>
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Véhicule</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Revenus Bruts</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Charges (Maint.)</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Profit Net</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Marge %</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((v, i) => {
            const margin = v.total_revenue > 0 ? (v.net_profit / v.total_revenue) * 100 : 0;
            return (
              <tr key={v.plate} className="group hover:bg-slate-50 transition-all duration-300">
                <td className="px-6 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                      <Car size={18} />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 tracking-tight leading-none mb-1">{v.brand} {v.model}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{v.plate}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 text-right font-bold text-slate-700">
                  {fmt(v.total_revenue)} <span className="text-[10px] text-slate-400">DH</span>
                </td>
                <td className="px-6 py-6 text-right font-bold text-rose-500/80">
                  -{fmt(v.total_costs)} <span className="text-[10px] text-slate-300">DH</span>
                </td>
                <td className="px-6 py-6 text-right">
                  <div className={cn(
                    "inline-flex items-center gap-1.5 font-black text-sm",
                    v.net_profit >= 0 ? "text-emerald-600" : "text-rose-600"
                  )}>
                    {fmt(v.net_profit)} DH
                    {v.net_profit >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  </div>
                </td>
                <td className="px-6 py-6 text-right">
                  <div className={cn(
                    "inline-flex px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase",
                    margin > 50 ? "bg-emerald-50 text-emerald-600" : margin > 20 ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
                  )}>
                    {margin.toFixed(1)}%
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
