"use client";

import { useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import styles from "./page.module.css";

// Modular Components
import AgentSidebar from "@/components/agent/AgentSidebar";

// Sections (already modular)
import AgentHome from "./sections/AgentHome";
import NewRental from "./sections/NewRental";
import MyReservations from "./sections/MyReservations";
import VehicleInspection from "./sections/VehicleInspection";

export default function AgentPortal() {
  const { checking } = useAuthGuard();
  const [tab, setTab] = useState("home");

  if (checking) return (
    <div className="flex items-center justify-center h-[60vh] text-slate-400 font-black uppercase text-[10px] tracking-widest">
      Vérification de la session...
    </div>
  );

  return (
    <div className={styles.portal}>
      <AgentSidebar activeTab={tab} setTab={setTab} />
      
      <div className={styles.content}>
        {tab === "home"         && <AgentHome onNewRental={() => setTab("new")} />}
        {tab === "new"          && <NewRental />}
        {tab === "reservations" && <MyReservations />}
        {tab === "inspection"   && <VehicleInspection />}
      </div>
    </div>
  );
}
