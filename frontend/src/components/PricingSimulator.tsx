"use client";

import { useState, useMemo } from "react";
import { TrendingUp, Zap, Calendar, Info, Save } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { fmt } from "@/shared/utils/format";

export default function PricingSimulator() {
  const [basePrice, setBasePrice] = useState(500);
  const [seasonality, setSeasonality] = useState(1.2); // 1.2x during peak
  const [demand, setDemand] = useState(1.1); // 1.1x current demand
  
  const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];
  
  // Simulated data generation
  const pricingData = useMemo(() => {
    return months.map((month, index) => {
      // Logic: Summer months (5-7) and Dec (11) have higher natural demand
      let multiplier = 1.0;
      if (index >= 5 && index <= 8) multiplier = seasonality;
      if (index === 11) multiplier = seasonality * 1.1;
      
      const price = Math.round(basePrice * multiplier * demand);
      return {
        month,
        price
      };
    });
  }, [basePrice, seasonality, demand]);

  const estimatedRevenue = Math.round(pricingData.reduce((acc, curr) => acc + curr.price, 0) * 20); // Simulating 20 days/month average

  return (
    <div className="bg-white border border-slate-200/60 rounded-[44px] p-10 shadow-[0_20px_60px_rgba(0,0,0,0.02)] h-full flex flex-col">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Zap className="text-primary fill-primary/20" size={28} />
            Pricing Dynamique <span className="text-primary/20 text-sm ml-2 font-black uppercase tracking-widest">Intelligence Artificielle</span>
          </h3>
          <p className="text-slate-400 font-bold text-sm mt-1">Simulez l'impact de vos tarifs sur le marché</p>
        </div>
        <button className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl hover:scale-105 transition-all">
          <Save size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10">
        {/* Controls */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prix de Base (MAD)</label>
              <span className="text-lg font-black text-slate-900">{basePrice}</span>
            </div>
            <input 
              type="range" min="100" max="2000" step="50"
              value={basePrice} onChange={(e) => setBasePrice(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Boost Saison Haute</label>
              <span className="text-lg font-black text-primary">x{seasonality}</span>
            </div>
            <input 
              type="range" min="1" max="2.5" step="0.1"
              value={seasonality} onChange={(e) => setSeasonality(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pression de la Demande</label>
              <span className="text-lg font-black text-indigo-400">+{Math.round((demand-1)*100)}%</span>
            </div>
            <input 
              type="range" min="0.8" max="1.5" step="0.05"
              value={demand} onChange={(e) => setDemand(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        </div>

        {/* Stats Summary */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100 flex flex-col justify-center transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <TrendingUp size={14} className="text-green-500" /> CA Prévu (Année)
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 tracking-tighter">
                {fmt(estimatedRevenue)}
              </span>
              <span className="text-lg font-black text-slate-400">MAD</span>
            </div>
          </div>

          <div className="bg-indigo-50 rounded-[32px] p-8 border border-indigo-100 flex flex-col justify-center">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Calendar size={14} /> Pic de Demande estimé
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 tracking-tight">Juillet - Août</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recharts Chart */}
      <div className="flex-1 min-h-[300px] mt-4 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={pricingData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
              tickFormatter={(val) => `${val} DH`}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)', padding: '20px' }}
              labelStyle={{ fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}
              itemStyle={{ fontWeight: 700, color: '#6366f1' }}
              formatter={(val) => [`${val} MAD`, 'Prix Simulé']}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#6366f1" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorPrice)" 
              dot={{ fill: '#6366f1', strokeWidth: 2, r: 4, stroke: '#fff' }}
              activeDot={{ r: 8, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <div className="bg-white p-2 rounded-lg shadow-sm">
          <Info size={16} className="text-primary" />
        </div>
        <p className="text-[11px] font-bold text-slate-500 leading-tight">
          Ce simulateur utilise vos données de performance pour optimiser vos tarifs. Vos réglages seront appliqués automatiquement lors des nouvelles réservations.
        </p>
      </div>
    </div>
  );
}
