"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, Car, CheckCircle, Download, RefreshCw, Eye, Users, Search } from "lucide-react";
import { Reservation } from "@/types/admin";
import { cn } from "@/shared/utils";

interface ReservationsTableProps {
  reservations: Reservation[];
  onAction: (id: number, action: "accept" | "reject") => void;
  onGenerateContract: (id: number) => void;
  onPreviewDocs: (docs: { cin?: string; license?: string; name?: string }) => void;
  actionLoading: number | null;
  onRowClick: (reservation: Reservation) => void;
}

const STATUS_STYLES: Record<string, { bg: string; border: string; text: string }> = {
  confirmed:       { bg: "from-emerald-500/20 to-emerald-500/10", border: "border-emerald-400/40", text: "text-emerald-500" },
  active:          { bg: "from-primary/20 to-primary/10", border: "border-primary/40", text: "text-primary" },
  completed:       { bg: "from-blue-500/20 to-blue-500/10", border: "border-blue-400/40", text: "text-blue-500" },
  pending_payment: { bg: "from-amber-500/20 to-amber-500/10", border: "border-amber-400/40", text: "text-amber-500" },
  pending:         { bg: "from-amber-500/20 to-amber-500/10", border: "border-amber-400/40", text: "text-amber-500" },
  rejected:        { bg: "from-red-500/20 to-red-500/10", border: "border-red-400/40", text: "text-red-500" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-gradient-to-br border-2", s.bg, s.border, s.text)}>
      {status === "confirmed" && <CheckCircle size={12} />}
      {status === "active" && <Car size={12} />}
      {status}
    </span>
  );
}

export default function ReservationsTable({ 
  reservations, 
  onAction, 
  onGenerateContract, 
  onPreviewDocs, 
  actionLoading,
  onRowClick
}: ReservationsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReservations = useMemo(() => {
    return reservations.filter(r => 
      r.client?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.vehicle?.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.vehicle?.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toString().includes(searchQuery)
    );
  }, [reservations, searchQuery]);

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
          <h2 className="text-2xl font-bold text-ink-1 tracking-tight font-serif">Flux des Réservations</h2>
          <span className="px-3 py-1.5 rounded-lg bg-gold/20 border border-gold/40 text-xs font-bold text-gold uppercase tracking-wider">
            {reservations.length} total
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-8 max-w-xl">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" strokeWidth={2} />
        <input 
          type="text" 
          placeholder="Rechercher par client, véhicule ou référence..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-premium w-full pl-12 pr-5 py-3.5"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        {filteredReservations.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-surface-1 rounded-2xl border-2 border-dashed border-border"
          >
            <Calendar size={64} className="mx-auto mb-6 text-gold/30" strokeWidth={1} />
            <p className="text-xl font-bold text-ink-1 font-serif">Aucune réservation enregistrée.</p>
          </motion.div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-border">
                {["Référence", "Véhicule", "Client", "Période", "Montant", "État", "Contrat", "Gestion"].map((h, i) => (
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
                  className="cursor-pointer border-b border-border/50 hover:bg-gold/5 transition-all"
                >
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
                    {r.start_date} <span className="text-ink-3 mx-1">→</span> {r.end_date}
                  </td>
                  <td className="py-4 pr-4 text-sm font-bold text-gold">{r.total_price.toLocaleString('fr-FR')} DH</td>
                  <td className="py-4 pr-4">
                    <div className="flex flex-col gap-2">
                      <StatusBadge status={r.status} />
                      {r.client?.cin_image_url && (
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onPreviewDocs({
                              cin: r.client?.cin_image_url,
                              license: r.client?.license_image_url,
                              name: r.client?.name
                            });
                          }}
                          className="text-xs font-bold uppercase text-gold hover:text-gold/80 transition-colors flex items-center gap-1"
                        >
                          <Eye size={12} strokeWidth={2} /> Documents
                        </motion.button>
                      )}
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    {r.contract ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle size={12} strokeWidth={2} /> Généré
                        </span>
                        <a 
                          href={`${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api").replace("/api", "")}/storage/${r.contract.file_path}`} 
                          target="_blank" 
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs font-bold text-gold hover:text-gold/80 transition-colors flex items-center gap-1"
                        >
                          <Download size={12} strokeWidth={2} /> Télécharger
                        </a>
                      </div>
                    ) : (
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.stopPropagation(); onGenerateContract(r.id); }}
                        disabled={actionLoading === r.id}
                        className="text-xs font-bold text-ink-2 hover:text-gold uppercase tracking-wider border-2 border-border hover:border-gold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 disabled:opacity-60"
                      >
                        <RefreshCw size={12} className={actionLoading === r.id ? "animate-spin" : ""} strokeWidth={2} />
                        Générer
                      </motion.button>
                    )}
                  </td>
                  <td className="py-4 text-right">
                    {r.status === "pending" ? (
                      <div className="flex gap-2 justify-end">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-500/90 text-white text-xs font-bold uppercase tracking-wider hover:shadow-lg hover:shadow-emerald-500/40 transition-all"
                          onClick={(e) => { e.stopPropagation(); onAction(r.id, "accept"); }}
                          disabled={actionLoading === r.id}
                        >
                          Accepter
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-500/90 text-white text-xs font-bold uppercase tracking-wider hover:shadow-lg hover:shadow-red-500/40 transition-all"
                          onClick={(e) => { e.stopPropagation(); onAction(r.id, "reject"); }}
                          disabled={actionLoading === r.id}
                        >
                          Rejeter
                        </motion.button>
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-ink-3 uppercase tracking-wider">Traitée</span>
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
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-surface-1 rounded-2xl border-2 border-dashed border-border"
          >
            <Calendar size={64} className="mx-auto mb-6 text-gold/30" strokeWidth={1} />
            <p className="text-xl font-bold text-ink-1 font-serif">Aucune réservation enregistrée.</p>
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
              className="bg-white rounded-2xl border-2 border-border shadow-md p-6 cursor-pointer hover:shadow-lg hover:shadow-gold/20 transition-all card-premium"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-ink-1">VC-{r.id.toString().padStart(4, "0")}</span>
                <StatusBadge status={r.status} />
              </div>

              {/* Card Body */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <Car size={16} className="text-gold" />
                  <span className="text-sm font-semibold text-ink-1">
                    {r.vehicle ? `${r.vehicle.brand} ${r.vehicle.model}` : "Véhicule non spécifié"}
                  </span>
                </div>
                <p className="text-sm text-ink-2">Par <span className="font-semibold text-ink-1">{r.client?.name ?? "Client inconnu"}</span></p>
                <p className="text-sm text-ink-2">{r.start_date} → {r.end_date}</p>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <p className="text-xl font-bold text-gold">{r.total_price.toLocaleString()} DH</p>
                {r.status === "pending" && (
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-500/90 text-white text-xs font-bold uppercase tracking-wider"
                      onClick={(e) => { e.stopPropagation(); onAction(r.id, "accept"); }}
                      disabled={actionLoading === r.id}
                    >
                      Accepter
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-500/90 text-white text-xs font-bold uppercase tracking-wider"
                      onClick={(e) => { e.stopPropagation(); onAction(r.id, "reject"); }}
                      disabled={actionLoading === r.id}
                    >
                      Rejeter
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.section>
  );
}