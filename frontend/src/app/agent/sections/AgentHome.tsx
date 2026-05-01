"use client";

import { useEffect, useState } from "react";
import { Car, Calendar, TrendingUp, ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import styles from "../sections.module.css";

const API = "http://localhost:8000/api";
const getToken = () => typeof window !== "undefined" ? localStorage.getItem("vectoria_token") || "" : "";

export default function AgentHome({ onNewRental }: { onNewRental: () => void }) {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = localStorage.getItem("vectoria_user");
    if (u) setUser(JSON.parse(u));

    fetch(`${API}/reservations`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then((d) => { setReservations(Array.isArray(d) ? d : d.data ?? []); })
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const todayPickups  = reservations.filter((r) => r.start_date === today);
  const todayReturns  = reservations.filter((r) => r.end_date   === today);
  const activeRentals = reservations.filter((r) => r.status === "confirmed");
  const totalRevenue  = reservations.reduce((s, r) => s + (r.total_price || 0), 0);

  const kpis = [
    { label: "Revenus Générés",   value: `${totalRevenue.toLocaleString("fr-FR")} DH`, icon: TrendingUp, color: "#10b981" },
    { label: "Départs Aujourd'hui",value: todayPickups.length,  icon: Car,      color: "#6366f1" },
    { label: "Retours Aujourd'hui",value: todayReturns.length,  icon: Clock,    color: "#f59e0b" },
    { label: "Locations Actives",  value: activeRentals.length, icon: CheckCircle2, color: "#3b82f6" },
  ];

  return (
    <div>
      {/* Salutation */}
      <div className={styles.greeting}>
        <h2>Bonjour, {user?.name?.split(" ")[0] ?? "Agent"} 👋</h2>
        <p>{new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</p>
      </div>

      {/* KPIs */}
      <div className={styles.kpiGrid}>
        {kpis.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: `${color}18`, color }}>
              <Icon size={20} />
            </div>
            <div>
              <p className={styles.kpiLabel}>{label}</p>
              <p className={styles.kpiValue} style={{ color }}>{loading ? "…" : value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bouton Nouvelle Location */}
      <button className={styles.ctaBtn} onClick={onNewRental}>
        <Car size={20} />
        Démarrer une Nouvelle Location
        <ArrowRight size={18} />
      </button>

      {/* Dernières réservations */}
      <div className={styles.sectionCard}>
        <h3 className={styles.sectionTitle}><Calendar size={16} /> Réservations Récentes</h3>
        {loading ? (
          <div className={styles.skeleton} />
        ) : reservations.length === 0 ? (
          <p className={styles.empty}>Aucune réservation pour le moment.</p>
        ) : (
          <div className={styles.miniList}>
            {reservations.slice(0, 5).map((r) => (
              <div key={r.id} className={styles.miniRow}>
                <span className={styles.miniId}>#{r.id?.toString().padStart(4, "0")}</span>
                <span>{r.vehicle ? `${r.vehicle.brand} ${r.vehicle.model}` : "Véhicule"}</span>
                <span className={styles.miniDate}>{r.start_date} → {r.end_date}</span>
                <span className={`${styles.badge} ${styles[`s_${r.status}`]}`}>{r.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
