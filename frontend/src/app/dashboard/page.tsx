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

// ─── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_RESERVATIONS: Reservation[] = [
  { id: 1, vehicle: "Mercedes Class C 220d", plate: "12345-A-1", startDate: "2026-06-01", endDate: "2026-06-10", totalPrice: 7650, depositAmount: 765, status: "confirmed", paidAmount: 765, hasContract: true, img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=400" },
  { id: 2, vehicle: "BMW X5 xDrive40i", plate: "67890-B-2", startDate: "2026-05-10", endDate: "2026-05-15", totalPrice: 6000, depositAmount: 600, status: "active", paidAmount: 6000, hasContract: true, img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=400" },
  { id: 3, vehicle: "Audi RS5 Coupé", plate: "11111-C-3", startDate: "2026-07-15", endDate: "2026-07-20", totalPrice: 9000, depositAmount: 900, status: "pending_payment", paidAmount: 0, hasContract: false, img: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=400" },
  { id: 4, vehicle: "Volkswagen Golf GTI", plate: "22222-D-4", startDate: "2026-04-01", endDate: "2026-04-05", totalPrice: 2000, depositAmount: 200, status: "cancelled", paidAmount: 0, hasContract: false, img: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=400" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"all" | ReservationStatus>("all");
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
  const { data: apiReservations, isLoading: reservationsLoading } = useMyReservations();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  
  const RESERVATIONS: Reservation[] = useMemo(() => (apiReservations as any)?.data ?? MOCK_RESERVATIONS, [apiReservations]);

  const filtered = useMemo(() => activeTab === "all" ? RESERVATIONS : RESERVATIONS.filter((r) => r.status === activeTab), [RESERVATIONS, activeTab]);

  const totalSpent = useMemo(() => RESERVATIONS.filter(r => r.status === "completed" || r.status === "active").reduce((acc, r) => acc + (r.paidAmount || 0), 0), [RESERVATIONS]);
  const upcoming = useMemo(() => RESERVATIONS.filter(r => r.status === "confirmed").length, [RESERVATIONS]);
  const pending  = useMemo(() => RESERVATIONS.filter(r => r.status === "pending_payment").length, [RESERVATIONS]);

  return (
    <main className="min-h-screen bg-slate-950 text-white pt-28 pb-20">
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
      </div>
    </main>
  );
}
