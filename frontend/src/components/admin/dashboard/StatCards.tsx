"use client";

import { TrendingUp, Calendar, Car, Percent } from "lucide-react";
import { DashboardStats } from "@/types/admin";
import styles from "@/app/admin/page.module.css";

interface StatCardsProps {
  stats: DashboardStats | null;
  loading: boolean;
}

export default function StatCards({ stats, loading }: StatCardsProps) {
  if (loading) {
    return (
      <div className={styles.skeletonGrid}>
        {[1, 2, 3, 4].map((i) => <div key={i} className={styles.skeleton} />)}
      </div>
    );
  }

  if (!stats) return null;

  const kpiCards = [
    {
      label: "Revenus Totaux",
      value: `${stats.revenue.toLocaleString('fr-FR')} DH`,
      icon: TrendingUp,
      color: "#10b981",
      bg: "rgba(16, 185, 129, 0.08)",
    },
    {
      label: "Réservations",
      value: stats.reservations_count,
      icon: Calendar,
      color: "#6366f1",
      bg: "rgba(99, 102, 241, 0.08)",
    },
    {
      label: "Locations Actives",
      value: stats.active_bookings,
      icon: Car,
      color: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.08)",
    },
    {
      label: "Taux d'Occupation",
      value: `${stats.occupancy_rate}%`,
      icon: Percent,
      color: "#8b5cf6",
      bg: "rgba(139, 92, 246, 0.08)",
    },
  ];

  return (
    <div className={styles.statsGrid}>
      {kpiCards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className={styles.statCard}>
            <div
              className={styles.statIcon}
              style={{ background: card.bg, color: card.color }}
            >
              <Icon size={24} />
            </div>
            <div>
              <span className={styles.statLabel}>{card.label}</span>
              <span className={styles.statValue}>
                {card.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
