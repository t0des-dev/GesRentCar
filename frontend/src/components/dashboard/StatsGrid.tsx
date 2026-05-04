"use client";

import { cn } from "@/lib/utils";
import { Car, CheckCircle, Clock, CreditCard } from "lucide-react";

interface StatsGridProps {
  totalCount: number;
  confirmedCount: number;
  pendingCount: number;
  totalSpent: string | number;
}

export default function StatsGrid({ totalCount, confirmedCount, pendingCount, totalSpent }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      <KpiCard icon={Car} label="Expériences" value={totalCount} color="bg-primary/20 text-primary border-primary/20" />
      <KpiCard icon={CheckCircle} label="Confirmées" value={confirmedCount} color="bg-emerald-500/20 text-emerald-400 border-emerald-500/20" />
      <KpiCard icon={Clock} label="En Attente" value={pendingCount} color="bg-amber-500/20 text-amber-400 border-amber-500/20" />
      <KpiCard icon={CreditCard} label="Total Investi" value={totalSpent} color="bg-white/5 text-white border-white/10" />
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType; label: string; value: string | number; color: string;
}) {
  return (
    <div className={cn("bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex items-center gap-6 group hover:border-primary/40 transition-all duration-500", color.split(' ')[2])}>
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-lg", color.split(' ')[0])}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-black text-white tracking-tighter">{value}</p>
      </div>
    </div>
  );
}
