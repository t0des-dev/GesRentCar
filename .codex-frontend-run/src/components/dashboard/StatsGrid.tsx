"use client";

import { cn } from "@/lib/utils";
import { Car, CheckCircle, Clock, Wallet } from "lucide-react";
import { motion } from "framer-motion";

interface StatsGridProps {
  totalCount: number;
  confirmedCount: number;
  pendingCount: number;
  totalSpent: string | number;
}

export default function StatsGrid({ totalCount, confirmedCount, pendingCount, totalSpent }: StatsGridProps) {
  const stats = [
    { icon: Car, label: "Expériences", value: totalCount, color: "from-primary/30 to-primary/10", iconColor: "text-primary", borderColor: "border-primary/40" },
    { icon: CheckCircle, label: "Confirmées", value: confirmedCount, color: "from-emerald-500/30 to-emerald-500/10", iconColor: "text-emerald-400", borderColor: "border-emerald-400/40" },
    { icon: Clock, label: "En Attente", value: pendingCount, color: "from-amber-500/30 to-amber-500/10", iconColor: "text-amber-400", borderColor: "border-amber-400/40" },
    { icon: Wallet, label: "Total Investi", value: totalSpent, color: "from-gold/30 to-gold/10", iconColor: "text-gold", borderColor: "border-gold/40" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.08, duration: 0.5 }}
          whileHover={{ y: -4 }}
          className={cn(
            "relative rounded-xl p-6 border-2 transition-all duration-300 group overflow-hidden",
            `bg-gradient-to-br ${stat.color} ${stat.borderColor} hover:border-opacity-60 hover:shadow-lg hover:shadow-${stat.iconColor.split('-')[1]}/20`
          )}
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="relative z-10 flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-ink-3 mb-3">{stat.label}</p>
              <p className="text-3xl font-bold text-ink-1">{stat.value}</p>
            </div>
            <div className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300",
              `bg-white/10 ${stat.iconColor} group-hover:scale-110 group-hover:bg-white/20`
            )}>
              <stat.icon size={24} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
