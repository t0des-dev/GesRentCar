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
    <div className="flex items-center justify-center h-[60vh] text-slate-400 font-black uppercase text-[10px] tracking-widest">
      Vérification de la session...
    </div>
  );

  return (
    <main className="min-h-screen pt-32 pb-24 bg-slate-50/50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-72">
            <AgentSidebar activeTab={tab} setTab={setTab} />
          </aside>
          
          {/* Main Content Area */}
          <div className="flex-1 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[700px]">
            <div className="p-8 md:p-12">
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
