"use client";

import { useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";

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
    <div className="flex items-center justify-center h-[60vh] text-slate-400 font-semibold uppercase text-[10px] tracking-widest">
      Vérification de la session...
    </div>
  );

  return (
    <main className="min-h-screen pt-28 pb-20 bg-slate-50">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <AgentSidebar activeTab={tab} setTab={setTab} />
          </aside>
          
          {/* Main Content Area */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-100/80 shadow-sm overflow-hidden">
            <div className="p-8 md:p-10">
              {tab === "home"         && <AgentHome onNewRental={() => setTab("new")} />}
              {tab === "new"          && <NewRental />}
              {tab === "reservations" && <MyReservations />}
              {tab === "inspection"   && <VehicleInspection />}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
