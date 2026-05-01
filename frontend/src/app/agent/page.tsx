"use client";

import { useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import AgentHome from "./sections/AgentHome";
import NewRental from "./sections/NewRental";
import MyReservations from "./sections/MyReservations";
import VehicleInspection from "./sections/VehicleInspection";
import { LayoutDashboard, PlusCircle, ClipboardList, ShieldCheck } from "lucide-react";
import styles from "./page.module.css";

const TABS = [
  { id: "home",         label: "Accueil",    icon: LayoutDashboard },
  { id: "new",          label: "Nouvelle",   icon: PlusCircle },
  { id: "reservations", label: "Locations",  icon: ClipboardList },
  { id: "inspection",   label: "Inspection", icon: ShieldCheck },
];

export default function AgentPortal() {
  const { checking } = useAuthGuard();
  const [tab, setTab] = useState("home");

  if (checking) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "#94a3b8" }}>
      Vérification de la session...
    </div>
  );

  return (
    <div className={styles.portal}>
      <nav className={styles.tabs}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`${styles.tab} ${tab === id ? styles.tabActive : ""}`}
            onClick={() => setTab(id)}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className={styles.content}>
        {tab === "home"         && <AgentHome onNewRental={() => setTab("new")} />}
        {tab === "new"          && <NewRental />}
        {tab === "reservations" && <MyReservations />}
        {tab === "inspection"   && <VehicleInspection />}
      </div>
    </div>
  );
}
