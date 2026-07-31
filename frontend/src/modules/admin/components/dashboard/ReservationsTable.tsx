"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, Car, CheckCircle, Download, RefreshCw, Eye, Users, Search, ChevronLeft, ChevronRight, XCircle, Clock, Trash2, CheckSquare, Square, FileSpreadsheet } from "lucide-react";
import { Reservation } from "@/types/admin";
import { cn } from "@/shared/utils";
import { fmt } from "@/shared/utils/format";
import { exportToCsv } from "@/shared/utils/exportCsv";
import { useTranslation } from "@/shared/hooks/useTranslation";

interface ReservationsTableProps {
  reservations: Reservation[];
  onAction: (id: number, action: "accept" | "reject") => void;
  onGenerateContract: (id: number) => void;
  onPreviewDocs: (docs: { cin?: string; license?: string; name?: string }) => void;
  actionLoading: number | null;
  onRowClick: (reservation: Reservation) => void;
  onConfirm?: (reservation: Reservation) => void;
  onCancel?: (reservation: Reservation) => void;
  onBulkAction?: (ids: number[], action: "accept" | "reject") => void;
  currentPage?: number;
  lastPage?: number;
  total?: number;
  onPageChange?: (page: number) => void;
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch { return dateStr; }
};

const STATUS_STYLES: Record<string, { bg: string; border: string; text: string }> = {
  confirmed:        { bg: "from-emerald-500/20 to-emerald-500/10", border: "border-emerald-400/40",  text: "text-emerald-500" },
  active:           { bg: "from-primary/20 to-primary/10",         border: "border-primary/40",      text: "text-primary" },
  ongoing:          { bg: "from-sky-500/20 to-sky-500/10",          border: "border-sky-400/40",      text: "text-sky-500" },
  completed:        { bg: "from-blue-500/20 to-blue-500/10",        border: "border-blue-400/40",     text: "text-blue-500" },
  pending_payment:  { bg: "from-amber-500/20 to-amber-500/10",      border: "border-amber-400/40",    text: "text-amber-500" },
  attente_paiement: { bg: "from-orange-500/20 to-orange-500/10",    border: "border-orange-400/40",   text: "text-orange-500" },
  pending:          { bg: "from-amber-500/20 to-amber-500/10",      border: "border-amber-400/40",    text: "text-amber-500" },
  pending_partner:  { bg: "from-purple-500/20 to-purple-500/10",    border: "border-purple-400/40",   text: "text-purple-500" },
  rejected:         { bg: "from-red-500/20 to-red-500/10",          border: "border-red-400/40",      text: "text-red-500" },
  cancelled:        { bg: "from-red-500/20 to-red-500/10",          border: "border-red-400/40",      text: "text-red-500" },
};

function getStatusLabels(t: (key: string) => string): Record<string, string> {
  return {
    confirmed: t("status_confirmed"), active: t("status_active"), ongoing: t("status_ongoing"), completed: t("status_completed"),
    pending_payment: t("status_pending_payment"), attente_paiement: t("status_pending_payment"),
    pending: t("status_pending"), pending_partner: t("status_pending_partner"), rejected: t("status_rejected"), cancelled: t("status_cancelled"),
  };
}

function StatusBadge({ status, statusLabels }: { status: string; statusLabels: Record<string, string> }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.pending;
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-gradient-to-br border-2", s.bg, s.border, s.text)}>
      {status === "confirmed" && <CheckCircle size={12} />}
      {status === "active" && <Car size={12} />}
      {status === "ongoing" && <Car size={12} />}
      {status === "cancelled" && <XCircle size={12} />}
      {status === "pending_partner" && <Clock size={12} />}
      {statusLabels[status] ?? status}
    </span>
  );
}

export default function ReservationsTable({
  reservations, onAction, onGenerateContract, onPreviewDocs, actionLoading,
  onRowClick, onConfirm, onCancel, onBulkAction,
  currentPage = 1, lastPage = 1, total, onPageChange,
}: ReservationsTableProps) {
  const { t } = useTranslation();
  const statusLabels = useMemo(() => getStatusLabels(t), [t]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  const filteredReservations = useMemo(() => {
    return reservations.filter(r =>
      r.client?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.vehicle?.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.vehicle?.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toString().includes(searchQuery)
    );
  }, [reservations, searchQuery]);

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredReservations.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredReservations.map(r => r.id)));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleBulkAccept = async () => {
    if (!onBulkAction || selectedIds.size === 0) return;
    setBulkLoading(true);
    onBulkAction(Array.from(selectedIds), "accept");
    setSelectedIds(new Set());
    setBulkLoading(false);
  };

  const handleBulkReject = async () => {
    if (!onBulkAction || selectedIds.size === 0) return;
    setBulkLoading(true);
    onBulkAction(Array.from(selectedIds), "reject");
    setSelectedIds(new Set());
    setBulkLoading(false);
  };

  const handleExportCsv = () => {
    const data = filteredReservations.map(r => ({
      [t("reservations_col_reference")]: `VC-${r.id.toString().padStart(4, "0")}`,
      [t("reservations_col_vehicle")]: r.vehicle ? `${r.vehicle.brand} ${r.vehicle.model}` : "—",
      [t("reservations_col_client")]: r.client?.name ?? "—",
      [t("reservations_csv_start")]: r.start_date,
      [t("reservations_csv_end")]: r.end_date,
      [t("reservations_col_amount")]: r.total_price,
      [t("reservations_col_state")]: statusLabels[r.status] ?? r.status,
    }));
    exportToCsv(data, "reservations");
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="bg-white rounded-2xl border-2 border-border shadow-lg p-6 md:p-8 card-premium"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gold/20 border-2 border-gold/40 flex items-center justify-center">
            <Users size={20} className="text-gold" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-bold text-ink-1 tracking-tight font-serif">{t("reservations_flow_heading")}</h2>
          <span className="px-3 py-1.5 rounded-lg bg-gold/20 border border-gold/40 text-xs font-bold text-gold uppercase tracking-wider">
            {total ?? reservations.length} {t("reservations_total_label")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-border text-xs font-bold text-ink-2 hover:border-gold hover:text-gold transition-all"
          >
            <FileSpreadsheet size={14} /> CSV
          </motion.button>
          {lastPage > 1 && onPageChange && (
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="w-8 h-8 rounded-lg border-2 border-border flex items-center justify-center text-ink-2 hover:border-gold hover:text-gold transition-all disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </motion.button>
              <span className="text-xs font-bold text-ink-2 px-2">{currentPage} / {lastPage}</span>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= lastPage}
                className="w-8 h-8 rounded-lg border-2 border-border flex items-center justify-center text-ink-2 hover:border-gold hover:text-gold transition-all disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6 p-4 bg-primary/5 border-2 border-primary/20 rounded-xl"
        >
          <span className="text-sm font-bold text-primary">{selectedIds.size} {t("reservations_selected_count")}</span>
          <div className="flex gap-2 ml-auto">
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleBulkAccept}
              disabled={bulkLoading}
              className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-600 transition-all flex items-center gap-1"
            >
              <CheckCircle size={14} /> {t("reservations_bulk_accept")}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleBulkReject}
              disabled={bulkLoading}
              className="px-4 py-2 rounded-lg bg-red-500 text-white text-xs font-bold uppercase tracking-wider hover:bg-red-600 transition-all flex items-center gap-1"
            >
              <Trash2 size={14} /> {t("reservations_bulk_reject")}
            </motion.button>
            <button onClick={() => setSelectedIds(new Set())} className="px-3 py-2 text-xs font-bold text-ink-3 hover:text-ink-1 transition-colors">
              {t("reservations_bulk_cancel")}
            </button>
          </div>
        </motion.div>
      )}

      {/* Search Input */}
      <div className="relative mb-8 max-w-xl">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" strokeWidth={2} />
        <input
          type="text"
          placeholder={t("reservations_search_placeholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-premium w-full pl-12 pr-5 py-3.5"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        {filteredReservations.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 bg-surface-1 rounded-2xl border-2 border-dashed border-border">
            <Calendar size={64} className="mx-auto mb-6 text-gold/30" strokeWidth={1} />
            <p className="text-xl font-bold text-ink-1 font-serif">{t("reservations_empty_message")}</p>
          </motion.div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="pb-4 w-8">
                  <button onClick={toggleSelectAll} className="text-ink-3 hover:text-gold transition-colors">
                    {selectedIds.size === filteredReservations.length && filteredReservations.length > 0
                      ? <CheckSquare size={16} className="text-gold" />
                      : <Square size={16} />}
                  </button>
                </th>
                {[t("reservations_col_reference"), t("reservations_col_vehicle"), t("reservations_col_client"), t("reservations_col_period"), t("reservations_col_amount"), t("reservations_col_state"), t("reservations_col_contract"), t("reservations_col_actions")].map((h, i) => (
                  <th key={h} className={cn("text-xs font-bold uppercase tracking-wider text-ink-3 pb-4", i === 7 && "text-right")}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((r, idx) => (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  whileHover={{ y: -2 }}
                  onClick={() => onRowClick(r)}
                  className={cn(
                    "cursor-pointer border-b border-border/50 hover:bg-gold/5 transition-all",
                    selectedIds.has(r.id) && "bg-primary/5"
                  )}
                >
                  <td className="py-4 pr-4" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => toggleSelect(r.id)} className="text-ink-3 hover:text-gold transition-colors">
                      {selectedIds.has(r.id)
                        ? <CheckSquare size={16} className="text-gold" />
                        : <Square size={16} />}
                    </button>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="text-sm font-bold text-ink-1">VC-{r.id.toString().padStart(4, "0")}</span>
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-1 border-2 border-border flex items-center justify-center">
                        <Car size={16} className="text-ink-2" />
                      </div>
                      <span className="text-sm font-semibold text-ink-1">{r.vehicle ? `${r.vehicle.brand} ${r.vehicle.model}` : "—"}</span>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-sm text-ink-1 font-medium">{r.client?.name ?? "—"}</td>
                  <td className="py-4 pr-4 text-sm text-ink-2">
                    {formatDate(r.start_date)} <span className="text-ink-3 mx-1">→</span> {formatDate(r.end_date)}
                  </td>
                  <td className="py-4 pr-4 text-sm font-bold text-gold">{fmt(r.total_price)} DH</td>
                  <td className="py-4 pr-4">
                    <div className="flex flex-col gap-2">
                      <StatusBadge status={r.status} statusLabels={statusLabels} />
                      {r.client?.cin_image_url && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onPreviewDocs({ cin: r.client?.cin_image_url, license: r.client?.license_image_url, name: r.client?.name });
                          }}
                          className="text-xs font-bold uppercase text-gold hover:text-gold/80 transition-colors flex items-center gap-1"
                        >
                          <Eye size={12} strokeWidth={2} /> {t("reservations_documents_link")}
                        </motion.button>
                      )}
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    {r.contract ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1">
                           <CheckCircle size={12} strokeWidth={2} /> {t("reservations_contract_generated")}
                        </span>
                        <a
                          href={`${process.env.NEXT_PUBLIC_API_URL || "/api/v1"}/public/reservations/${r.id}/contract?lang=fr`}
                          target="_blank"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs font-bold text-gold hover:text-gold/80 transition-colors flex items-center gap-1"
                        >
                           <Download size={12} strokeWidth={2} /> {t("reservations_contract_download")}
                        </a>
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.stopPropagation(); onGenerateContract(r.id); }}
                        disabled={actionLoading === r.id}
                        className="text-xs font-bold text-ink-2 hover:text-gold uppercase tracking-wider border-2 border-border hover:border-gold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 disabled:opacity-60"
                      >
                         <RefreshCw size={12} className={actionLoading === r.id ? "animate-spin" : ""} strokeWidth={2} />
                         {t("reservations_contract_generate")}
                      </motion.button>
                    )}
                  </td>
                  <td className="py-4 text-right">
                    {r.status === "pending" || r.status === "pending_payment" || r.status === "pending_partner" ? (
                      <div className="flex gap-2 justify-end">
                        <motion.button
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-500/90 text-white text-xs font-bold uppercase tracking-wider hover:shadow-lg hover:shadow-emerald-500/40 transition-all"
                          onClick={(e) => { e.stopPropagation(); onConfirm ? onConfirm(r) : onAction(r.id, "accept"); }}
                          disabled={actionLoading === r.id}
                        >
                          {t("reservations_action_accept")}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-500/90 text-white text-xs font-bold uppercase tracking-wider hover:shadow-lg hover:shadow-red-500/40 transition-all"
                          onClick={(e) => { e.stopPropagation(); onCancel ? onCancel(r) : onAction(r.id, "reject"); }}
                          disabled={actionLoading === r.id}
                        >
                          {t("reservations_action_reject")}
                        </motion.button>
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-ink-3 uppercase tracking-wider">{t("reservations_action_processed")}</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {filteredReservations.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 bg-surface-1 rounded-2xl border-2 border-dashed border-border">
            <Calendar size={64} className="mx-auto mb-6 text-gold/30" strokeWidth={1} />
            <p className="text-xl font-bold text-ink-1 font-serif">{t("reservations_empty_message")}</p>
          </motion.div>
        ) : (
          filteredReservations.map((r, idx) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -2 }}
              onClick={() => onRowClick(r)}
              className={cn(
                "bg-white rounded-2xl border-2 border-border shadow-md p-6 cursor-pointer hover:shadow-lg hover:shadow-gold/20 transition-all card-premium",
                selectedIds.has(r.id) && "border-primary/40 bg-primary/5"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <button onClick={(e) => { e.stopPropagation(); toggleSelect(r.id); }} className="text-ink-3 hover:text-gold transition-colors">
                    {selectedIds.has(r.id) ? <CheckSquare size={16} className="text-gold" /> : <Square size={16} />}
                  </button>
                  <span className="text-sm font-bold text-ink-1">VC-{r.id.toString().padStart(4, "0")}</span>
                </div>
                <StatusBadge status={r.status} statusLabels={statusLabels} />
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <Car size={16} className="text-gold" />
                  <span className="text-sm font-semibold text-ink-1">
                    {r.vehicle ? `${r.vehicle.brand} ${r.vehicle.model}` : t("reservations_vehicle_unspecified")}
                  </span>
                </div>
                <p className="text-sm text-ink-2">{t("reservations_by_prefix")} <span className="font-semibold text-ink-1">{r.client?.name ?? t("reservations_client_unknown")}</span></p>
                <p className="text-sm text-ink-2">{formatDate(r.start_date)} → {formatDate(r.end_date)}</p>
              </div>

              <div className="flex flex-col gap-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-gold">{fmt(r.total_price)} DH</p>
                  {r.contract ? (
                    <a
                      href={`${process.env.NEXT_PUBLIC_API_URL || "/api/v1"}/public/reservations/${r.id}/contract?lang=fr`}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-bold text-emerald-500 hover:text-emerald-600 transition-colors flex items-center gap-1"
                    >
                       <Download size={14} strokeWidth={2} /> {t("reservations_contract_link")}
                    </a>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={(e) => { e.stopPropagation(); onGenerateContract(r.id); }}
                      disabled={actionLoading === r.id}
                      className="text-xs font-bold text-ink-2 hover:text-gold uppercase tracking-wider border-2 border-border hover:border-gold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 disabled:opacity-60"
                    >
                       <RefreshCw size={14} className={actionLoading === r.id ? "animate-spin" : ""} strokeWidth={2} />
                       {t("reservations_contract_generate")}
                    </motion.button>
                  )}
                </div>

                    {r.status === "pending" || r.status === "pending_payment" || r.status === "pending_partner" ? (
                      <div className="flex gap-2 justify-end">
                        <motion.button
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-500/90 text-white text-xs font-bold uppercase tracking-wider hover:shadow-lg hover:shadow-emerald-500/40 transition-all"
                          onClick={(e) => { e.stopPropagation(); onConfirm ? onConfirm(r) : onAction(r.id, "accept"); }}
                          disabled={actionLoading === r.id}
                        >
                          {t("reservations_action_accept")}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-500/90 text-white text-xs font-bold uppercase tracking-wider hover:shadow-lg hover:shadow-red-500/40 transition-all"
                          onClick={(e) => { e.stopPropagation(); onCancel ? onCancel(r) : onAction(r.id, "reject"); }}
                          disabled={actionLoading === r.id}
                        >
                          {t("reservations_action_reject")}
                        </motion.button>
                      </div>
                    ) : null}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.section>
  );
}
