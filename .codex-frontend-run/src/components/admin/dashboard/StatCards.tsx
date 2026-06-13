"use client";

import { TrendingUp, Calendar, Car, Percent } from "lucide-react";
import { DashboardStats } from "@/types/admin";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCardsProps {
  stats: DashboardStats | null;
  loading: boolean;
}

export default function StatCards({ stats, loading }: StatCardsProps) {
  // Loading skeletons
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="h-32 bg-surface-1 border-2 border-border rounded-xl shimmer-gold"
          />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const kpiCards = [
    {
      label: "Revenus Totaux",
      value: `${stats.revenue.toLocaleString('fr-FR')} DH`,
      icon: TrendingUp,
      gradient: "from-emerald-500/30 to-emerald-500/10",
      border: "border-emerald-400/40",
      icon_color: "text-emerald-400",
    },
    {
      label: "Réservations",
      value: stats.reservations_count,
      icon: Calendar,
      gradient: "from-primary/30 to-primary/10",
      border: "border-primary/40",
      icon_color: "text-primary",
    },
    {
      label: "Locations Actives",
      value: stats.active_bookings,
      icon: Car,
      gradient: "from-gold/30 to-gold/10",
      border: "border-gold/40",
      icon_color: "text-gold",
    },
    {
      label: "Taux d'Occupation",
      value: `${stats.occupancy_rate}%`,
      icon: Percent,
      gradient: "from-purple-500/30 to-purple-500/10",
      border: "border-purple-400/40",
      icon_color: "text-purple-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpiCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className={cn(
              "bg-gradient-to-br rounded-2xl border-2 p-6 card-premium",
              card.gradient,
              card.border
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-widest text-ink-3 mb-3">{card.label}</p>
                <p className="text-2xl md:text-3xl font-bold text-ink-1 tracking-tight">{card.value}</p>
              </div>
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={cn("w-12 h-12 rounded-lg flex items-center justify-center bg-white/10 backdrop-blur-sm", card.icon_color)}
              >
                <Icon size={24} strokeWidth={2} />
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
