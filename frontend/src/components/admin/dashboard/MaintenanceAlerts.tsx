"use client";

import { AlertTriangle, Car } from "lucide-react";
import styles from "@/app/admin/page.module.css";

interface MaintenanceAlertsProps {
  alerts?: { vehicle: string; plate: string; days: number }[];
}

export default function MaintenanceAlerts({ alerts }: MaintenanceAlertsProps) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <section className={styles.section} style={{ marginTop: '2.5rem', border: '1px solid #fee2e2' }}>
      <div className={styles.sectionHeader}>
        <AlertTriangle size={20} className="text-red-500" />
        <h2 className="text-red-900">Alertes de Maintenance Critique</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {alerts.map((alert, i) => (
          <div key={i} className="flex items-center gap-4 bg-red-50 p-4 rounded-2xl border border-red-100">
            <div className="w-10 h-10 rounded-xl bg-white text-red-500 flex items-center justify-center shadow-sm">
              <Car size={20} />
            </div>
            <div>
              <p className="font-bold text-red-900 text-sm">{alert.vehicle}</p>
              <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest">{alert.plate}</p>
            </div>
            <div className="ml-auto bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">
              {alert.days}j
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
