"use client";

import { RefreshCw, Download } from "lucide-react";
import styles from "@/app/admin/page.module.css";

interface DashboardHeaderProps {
  loading: boolean;
  onRefresh: () => void;
  onExport: () => void;
}

export default function DashboardHeader({ loading, onRefresh, onExport }: DashboardHeaderProps) {
  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>Vue d'Ensemble</h1>
        <p className={styles.subtitle}>Analysez vos performances et gérez vos réservations en temps réel.</p>
      </div>
      <div className={styles.headerActions}>
        <button
          className={styles.refreshBtn}
          onClick={onRefresh}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? styles.spinning : ""} />
          Actualiser
        </button>
        <button className={styles.exportBtn} onClick={onExport}>
          <Download size={16} />
          Exporter les Données
        </button>
      </div>
    </header>
  );
}
