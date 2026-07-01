"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthGuard } from "@/modules/auth/hooks/useAuthGuard";
import api from "@/shared/services/client";
import { Reservation } from "@/types/admin";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Download, ClipboardList, XCircle, CheckCircle, AlertTriangle, FileText } from "lucide-react";
import { notifyError } from "@/components/Notifications";

// Components
import ReservationsTable from "@/modules/admin/components/dashboard/ReservationsTable";
import ReservationDrawer from "@/modules/admin/components/dashboard/ReservationDrawer";
import DocumentPreviewModal from "@/modules/admin/components/dashboard/DocumentPreviewModal";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

const STATUS_TABS = [
  { id: "all", label: "Toutes", icon: FileText },
  { id: "pending", label: "En attente", icon: AlertTriangle },
  { id: "confirmed", label: "Confirmées", icon: CheckCircle },
  { id: "ongoing", label: "En cours", icon: FileText },
  { id: "completed", label: "Terminées", icon: CheckCircle },
  { id: "cancelled", label: "Annulées", icon: XCircle },
];

export default function ReservationsPage() {
  const { user, checking } = useAuthGuard("admin");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [previewDocs, setPreviewDocs] = useState<{ cin?: string; license?: string; name?: string } | null>(null);
  const [drawerReservation, setDrawerReservation] = useState<Reservation | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Confirm/Cancel modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"confirm" | "cancel">("confirm");
  const [modalReservation, setModalReservation] = useState<Reservation | null>(null);
  const [cancelReason, setCancelReason] = useState("");

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

  const openModal = (reservation: Reservation, type: "confirm" | "cancel") => {
    setModalReservation(reservation);
    setModalType(type);
    setCancelReason("");
    setModalOpen(true);
  };

  const handleModalSubmit = async () => {
    if (!modalReservation) return;
    setActionLoading(modalReservation.id);
    try {
      if (modalType === "confirm") {
        await api.post(`/reservations/${modalReservation.id}/accept`);
      } else {
        await api.put(`/reservations/${modalReservation.id}`, {
          status: "cancelled",
          documents: { cancel_reason: cancelReason },
        });
      }
      setModalOpen(false);
      await fetchData();
    } catch (err) {
      console.error(`Error: ${modalType}`, err);
      notifyError(modalType === "confirm" ? "Erreur lors de la confirmation." : "Erreur lors de l'annulation.");
    } finally {
      setActionLoading(null);
    }
  };

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

  const filteredReservations = activeTab === "all"
    ? reservations
    : activeTab === "pending"
      ? reservations.filter((r) => ["pending", "pending_payment", "pending_partner"].includes(r.status))
      : activeTab === "ongoing"
        ? reservations.filter((r) => r.status === "ongoing" || r.status === "active")
        : reservations.filter((r) => r.status === activeTab);

  const tabCounts = {
    all: reservations.length,
    pending: reservations.filter((r) => ["pending", "pending_payment", "pending_partner"].includes(r.status)).length,
    confirmed: reservations.filter((r) => r.status === "confirmed").length,
    ongoing: reservations.filter((r) => r.status === "ongoing" || r.status === "active").length,
    completed: reservations.filter((r) => r.status === "completed").length,
    cancelled: reservations.filter((r) => r.status === "cancelled").length,
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
        className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-8"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gold/20 border-2 border-gold/40 flex items-center justify-center">
              <ClipboardList size={20} className="text-gold" strokeWidth={2} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-ink-1 tracking-tight font-serif">Réservations</h1>
          </div>
          <p className="text-ink-2 text-lg font-light">Suivez, examinez et validez les contrats et demandes de réservation.</p>
        </div>

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

      {/* Status Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {STATUS_TABS.map((tab) => {
          const Icon = tab.icon;
          const count = tabCounts[tab.id as keyof typeof tabCounts] ?? 0;
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border-2 ${
                isActive
                  ? "bg-gold text-ink-1 border-gold shadow-lg shadow-gold/30"
                  : "bg-surface-1 text-ink-3 border-border hover:border-gold/50 hover:text-ink-1"
              }`}
            >
              <Icon size={14} strokeWidth={2} />
              {tab.label}
              {count > 0 && (
                <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? "bg-ink-1 text-gold" : "bg-gold/20 text-gold"}`}>
                  {count}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Chargement des réservations...</p>
        </div>
      ) : (
        <ReservationsTable
          reservations={filteredReservations}
          onAction={handleAction}
          onGenerateContract={handleGenerateContract}
          onPreviewDocs={setPreviewDocs}
          actionLoading={actionLoading}
          onRowClick={setDrawerReservation}
          onConfirm={(r) => openModal(r, "confirm")}
          onCancel={(r) => openModal(r, "cancel")}
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

      {/* Confirm/Cancel Modal */}
      <AnimatePresence>
        {modalOpen && modalReservation && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-surface-0/90 backdrop-blur-md"
              onClick={() => setModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-md p-8 relative z-10 shadow-2xl border-2 border-border"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${modalType === "confirm" ? "bg-emerald-100" : "bg-red-100"}`}>
                  {modalType === "confirm" ? (
                    <CheckCircle size={24} className="text-emerald-600" />
                  ) : (
                    <XCircle size={24} className="text-red-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-ink-1">
                    {modalType === "confirm" ? "Confirmer la réservation" : "Annuler la réservation"}
                  </h3>
                  <p className="text-sm text-ink-2">
                    VRC-{modalReservation.id.toString().padStart(5, "0")} — {modalReservation.client?.name}
                  </p>
                </div>
              </div>

              {modalType === "confirm" ? (
                <p className="text-sm text-ink-2 mb-6">
                  Le client <strong>{modalReservation.client?.name}</strong> sera notifié par SMS que sa réservation est confirmée.
                </p>
              ) : (
                <div className="mb-6">
                  <p className="text-sm text-ink-2 mb-3">Veuillez indiquer le motif d&apos;annulation :</p>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Ex: Document invalide, dates non disponibles..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm text-ink-1 resize-none h-24"
                  />
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl border-2 border-border text-ink-2 text-xs font-bold uppercase tracking-wider hover:border-gold/50 transition-all"
                >
                  Annuler
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleModalSubmit}
                  disabled={actionLoading !== null || (modalType === "cancel" && !cancelReason.trim())}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all disabled:opacity-50 ${
                    modalType === "confirm"
                      ? "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:shadow-lg hover:shadow-emerald-500/40"
                      : "bg-gradient-to-r from-red-600 to-red-500 hover:shadow-lg hover:shadow-red-500/40"
                  }`}
                >
                  {actionLoading !== null ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Traitement...
                    </span>
                  ) : modalType === "confirm" ? (
                    "Confirmer"
                  ) : (
                    "Annuler la réservation"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
