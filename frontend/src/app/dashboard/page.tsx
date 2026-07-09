"use client";

import { useState, useEffect, useMemo } from "react";
import { useMyReservations } from "@/shared/hooks/useApi";
import { useAuth } from "@/modules/auth/context/context";
import { AnimatePresence } from "framer-motion";
import { fmt } from "@/shared/utils/format";

// Modular Components
import ProfileHeader from "@/modules/dashboard/components/ProfileHeader";
import StatsGrid from "@/modules/dashboard/components/StatsGrid";
import ReservationTabs from "@/modules/dashboard/components/ReservationTabs";
import ReservationList from "@/modules/dashboard/components/ReservationList";
import ReservationDetailModal from "@/modules/dashboard/components/ReservationDetailModal";
import ClientDashboard from "@/modules/dashboard/components/ClientDashboard";

// ─── Types ─────────────────────────────────────────────────────────────────
type ReservationStatus = "confirmed" | "active" | "completed" | "cancelled" | "pending_payment";

interface Reservation {
  id: number;
  vehicle: string;
  plate: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  depositAmount: number;
  status: ReservationStatus;
  paidAmount: number;
  hasContract: boolean;
  img?: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"all" | ReservationStatus>("all");
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
  const { data: apiReservations, isLoading: reservationsLoading } = useMyReservations();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);
  
  const RESERVATIONS: Reservation[] = useMemo(() => (apiReservations as any)?.data ?? [], [apiReservations]);

  const filtered = useMemo(() => activeTab === "all" ? RESERVATIONS : RESERVATIONS.filter((r) => r.status === activeTab), [RESERVATIONS, activeTab]);

  const totalSpent = useMemo(() => RESERVATIONS.filter(r => r.status === "completed" || r.status === "active").reduce((acc, r) => acc + (r.paidAmount || 0), 0), [RESERVATIONS]);
  const upcoming = useMemo(() => RESERVATIONS.filter(r => r.status === "confirmed").length, [RESERVATIONS]);
  const pending  = useMemo(() => RESERVATIONS.filter(r => r.status === "pending_payment").length, [RESERVATIONS]);

  return (
    <main className="min-h-screen bg-background text-foreground pt-28 pb-20">
      <AnimatePresence>
        {selectedRes && <ReservationDetailModal reservation={selectedRes} onClose={() => setSelectedRes(null)} />}
      </AnimatePresence>
 
      <div className="container mx-auto px-6 max-w-6xl">
        <ProfileHeader session={user ? { user } : null} />

        <StatsGrid 
          totalCount={RESERVATIONS.length} 
          confirmedCount={upcoming} 
          pendingCount={pending} 
          totalSpent={mounted ? `${fmt(totalSpent)} DH` : `${totalSpent} DH`} 
        />

        <ReservationTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          reservations={RESERVATIONS} 
        />

        <ReservationList 
          reservations={filtered} 
          loading={reservationsLoading} 
          onSelect={setSelectedRes} 
        />

        <div className="mt-12 pt-12 border-t border-surface-2">
          <ClientDashboard />
        </div>
      </div>
    </main>
  );
}
