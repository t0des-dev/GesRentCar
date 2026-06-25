"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthGuard } from "@/modules/auth/hooks/useAuthGuard";
import api from "@/shared/services/client";
import { Reservation } from "@/types/admin";
import { motion } from "framer-motion";
import { RefreshCw, Download, ClipboardList } from "lucide-react";
import { notifyError } from "@/components/Notifications";

// Components
import ReservationsTable from "@/modules/admin/components/dashboard/ReservationsTable";
import ReservationDrawer from "@/modules/admin/components/dashboard/ReservationDrawer";
import DocumentPreviewModal from "@/modules/admin/components/dashboard/DocumentPreviewModal";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export default function ReservationsPage() {
  const { user, checking } = useAuthGuard("admin");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [previewDocs, setPreviewDocs] = useState<{cin?: string, license?: string, name?: string} | null>(null);
  const [drawerReservation, setDrawerReservation] = useState<Reservation | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/reservations");
      setReservations(Array.isArray(res.data) ? res.data : res.data.data ?? []);
    } catch (err) {
      console.error("Error fetching reservations", err);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (!checking && user) {
      fetchData();
    }
  }, [fetchData, checking, user]);

  const handleAction = async (id: number, action: "accept" | "reject") => {
    setActionLoading(id);
    try {
      await api.post(`/reservations/${id}/${action}`);
      await fetchData();
    } catch (err) {
      console.error(`Error performing action ${action} on reservation ${id}`, err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleGenerateContract = async (id: number) => {
    setActionLoading(id);
    try {
      await api.post(`/reservations/${id}/contract`);
      await fetchData();
    } catch (err) {
      console.error(`Error generating contract for reservation ${id}`, err);
      notifyError("Erreur lors de la generation du contrat.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleExport = () => {
    const token = localStorage.getItem("vectoria_token") || localStorage.getItem("auth_token") || "";
    window.open(`${API}/exports/reservations?token=${token}`, "_blank");
  };

  if (checking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Vérification de la session...</p>
      </div>
    );
  }

  return (
    <>
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-12"
      >
        {/* Title & Subtitle */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gold/20 border-2 border-gold/40 flex items-center justify-center">
              <ClipboardList size={20} className="text-gold" strokeWidth={2} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-ink-1 tracking-tight font-serif">Réservations</h1>
          </div>
          <p className="text-ink-2 text-lg font-light">Suivez, examinez et validez les contrats et demandes de réservation de votre flotte.</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchData}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-surface-1 border-2 border-border hover:border-gold text-ink-1 rounded-lg text-sm font-bold uppercase tracking-wider transition-all disabled:opacity-60"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} strokeWidth={2} />
            Actualiser
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gold to-gold/90 text-ink-1 rounded-lg text-sm font-bold uppercase tracking-wider hover:shadow-lg hover:shadow-gold/40 transition-all"
          >
            <Download size={18} strokeWidth={2} />
            Exporter
          </motion.button>
        </div>
      </motion.header>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Chargement des réservations...</p>
        </div>
      ) : (
        <ReservationsTable 
          reservations={reservations} 
          onAction={handleAction} 
          onGenerateContract={handleGenerateContract}
          onPreviewDocs={setPreviewDocs}
          actionLoading={actionLoading}
          onRowClick={setDrawerReservation}
        />
      )}

      <DocumentPreviewModal docs={previewDocs} onClose={() => setPreviewDocs(null)} />

      {drawerReservation && (
        <ReservationDrawer 
          reservation={drawerReservation} 
          onClose={() => setDrawerReservation(null)}
          onGenerateContract={handleGenerateContract}
          actionLoading={actionLoading}
        />
      )}
    </>
  );
}
