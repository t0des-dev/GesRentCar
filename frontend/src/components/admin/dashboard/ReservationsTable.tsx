"use client";

import { useState, useMemo } from "react";
import { Calendar, Car, CheckCircle, Download, RefreshCw, Eye, Users, Search } from "lucide-react";
import { Reservation } from "@/types/admin";
import styles from "@/app/admin/page.module.css";

interface ReservationsTableProps {
  reservations: Reservation[];
  onAction: (id: number, action: "accept" | "reject") => void;
  onGenerateContract: (id: number) => void;
  onPreviewDocs: (docs: { cin?: string; license?: string; name?: string }) => void;
  actionLoading: number | null;
  onRowClick: (reservation: Reservation) => void;
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
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className="flex items-center gap-3">
          <Users size={20} className="text-primary" />
          <h2>Flux des Réservations</h2>
          <span className={styles.badge}>{reservations.length} total</span>
        </div>
      </div>

      <div className="relative mb-8 flex items-center">
        <Search size={20} className="text-slate-400 absolute ml-5" />
        <input 
          type="text" 
          placeholder="Rechercher par client, véhicule ou référence..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
          style={{ paddingLeft: '3.5rem', width: '100%', maxWidth: '600px' }}
        />
      </div>
      <div className={styles.tableWrapper}>
        {filteredReservations.length === 0 ? (
          <div className={styles.empty}>
            <Calendar size={60} strokeWidth={1} />
            <p className="font-medium">Aucune réservation enregistrée.</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Référence</th>
                <th>Véhicule</th>
                <th>Client</th>
                <th>Période de Location</th>
                <th>Montant Net</th>
                <th>État</th>
                <th>Contrat</th>
                <th className="text-right">Gestion</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((r) => (
                <tr key={r.id} onClick={() => onRowClick(r)} className="cursor-pointer">
                  <td className={styles.resId}>VC-{r.id.toString().padStart(4, "0")}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Car size={14} className="text-slate-400" />
                      </div>
                      <span>{r.vehicle ? `${r.vehicle.brand} ${r.vehicle.model}` : "—"}</span>
                    </div>
                  </td>
                  <td>{r.client?.name ?? "—"}</td>
                  <td className={styles.period}>
                    {r.start_date} au {r.end_date}
                  </td>
                  <td className={styles.price}>{r.total_price.toLocaleString('fr-FR')} DH</td>
                  <td>
                    <div className="flex flex-col gap-1">
                      <span className={`${styles.statusBadge} ${styles[`status_${r.status}`]}`}>
                        {r.status}
                      </span>
                      {r.client?.cin_image_url && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onPreviewDocs({
                              cin: r.client?.cin_image_url,
                              license: r.client?.license_image_url,
                              name: r.client?.name
                            });
                          }}
                          className="text-[9px] font-black uppercase text-primary hover:underline flex items-center gap-1"
                        >
                          <Eye size={10} /> Docs
                        </button>
                      )}
                    </div>
                  </td>
                  <td>
                    {r.contract ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                          <CheckCircle size={10} /> Généré
                        </span>
                        <a 
                          href={`http://localhost:8000/storage/${r.contract.file_path}`} 
                          target="_blank" 
                          onClick={(e) => e.stopPropagation()}
                          className="text-[9px] font-black text-primary hover:underline flex items-center gap-1"
                        >
                          <Download size={10} /> Télécharger
                        </a>
                      </div>
                    ) : (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onGenerateContract(r.id); }}
                        disabled={actionLoading === r.id}
                        className="text-[9px] font-black text-slate-400 hover:text-primary uppercase tracking-widest border border-slate-200 px-2 py-1 rounded-lg hover:border-primary transition-all flex items-center gap-1"
                      >
                        <RefreshCw size={10} className={actionLoading === r.id ? styles.spinning : ""} />
                        Générer
                      </button>
                    )}
                  </td>
                  <td className="text-right">
                    {r.status === "pending" ? (
                      <div className={styles.actions}>
                        <button
                          className={styles.btnAccept}
                          onClick={(e) => { e.stopPropagation(); onAction(r.id, "accept"); }}
                          disabled={actionLoading === r.id}
                        >
                          Accepter
                        </button>
                        <button
                          className={styles.btnReject}
                          onClick={(e) => { e.stopPropagation(); onAction(r.id, "reject"); }}
                          disabled={actionLoading === r.id}
                        >
                          Rejeter
                        </button>
                      </div>
                    ) : (
                      <div className="w-full text-right pr-4">
                         <span className="text-slate-300 font-bold uppercase text-[10px] tracking-widest">Traitée</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Mobile View */}
      <div className={styles.mobileResGrid}>
        {filteredReservations.map((r) => (
          <div key={r.id} className={styles.mobileResCard} onClick={() => onRowClick(r)}>
            <div className={styles.cardHeader}>
              <span className={styles.resId}>VC-{r.id.toString().padStart(4, "0")}</span>
              <span className={`${styles.statusBadge} ${styles[`status_${r.status}`]}`} style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem' }}>
                {r.status}
              </span>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardVehicle}>
                <Car size={16} className="text-primary" />
                {r.vehicle ? `${r.vehicle.brand} ${r.vehicle.model}` : "Véhicule non spécifié"}
              </div>
              <div className={styles.cardClient}>Par {r.client?.name ?? "Client inconnu"}</div>
              <div className={styles.period} style={{ marginTop: '0.5rem' }}>{r.start_date} au {r.end_date}</div>
            </div>
            <div className={styles.cardFooter}>
              <div className={styles.price}>{r.total_price.toLocaleString()} DH</div>
              {r.status === "pending" && (
                <div className={styles.mobileActions}>
                  <button className={styles.btnAccept} onClick={(e) => { e.stopPropagation(); onAction(r.id, "accept"); }} disabled={actionLoading === r.id}>Accepter</button>
                  <button className={styles.btnReject} onClick={(e) => { e.stopPropagation(); onAction(r.id, "reject"); }} disabled={actionLoading === r.id}>Rejeter</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
