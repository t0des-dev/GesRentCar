"use client";

import { Calendar, Car, CheckCircle, Download, RefreshCw, Eye, Users } from "lucide-react";
import { Reservation } from "@/types/admin";
import styles from "@/app/admin/page.module.css";

interface ReservationsTableProps {
  reservations: Reservation[];
  onAction: (id: number, action: "accept" | "reject") => void;
  onGenerateContract: (id: number) => void;
  onPreviewDocs: (docs: { cin?: string; license?: string; name?: string }) => void;
  actionLoading: number | null;
}

export default function ReservationsTable({ 
  reservations, 
  onAction, 
  onGenerateContract, 
  onPreviewDocs, 
  actionLoading 
}: ReservationsTableProps) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <Users size={20} className="text-primary" />
        <h2>Flux des Réservations</h2>
        <span className={styles.badge}>{reservations.length} total</span>
      </div>
      <div className={styles.tableWrapper}>
        {reservations.length === 0 ? (
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
              {reservations.map((r) => (
                <tr key={r.id}>
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
                          onClick={() => onPreviewDocs({
                            cin: r.client?.cin_image_url,
                            license: r.client?.license_image_url,
                            name: r.client?.name
                          })}
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
                          className="text-[9px] font-black text-primary hover:underline flex items-center gap-1"
                        >
                          <Download size={10} /> Télécharger
                        </a>
                      </div>
                    ) : (
                      <button 
                        onClick={() => onGenerateContract(r.id)}
                        disabled={actionLoading === r.id}
                        className="text-[9px] font-black text-slate-400 hover:text-primary uppercase tracking-widest border border-slate-200 px-2 py-1 rounded-lg hover:border-primary transition-all flex items-center gap-1"
                      >
                        <RefreshCw size={10} className={actionLoading === r.id ? styles.spinning : ""} />
                        Générer
                      </button>
                    )}
                  </td>
                  <td className={styles.actions}>
                    {r.status === "pending" ? (
                      <>
                        <button
                          className={styles.btnAccept}
                          onClick={() => onAction(r.id, "accept")}
                          disabled={actionLoading === r.id}
                        >
                          Accepter
                        </button>
                        <button
                          className={styles.btnReject}
                          onClick={() => onAction(r.id, "reject")}
                          disabled={actionLoading === r.id}
                        >
                          Rejeter
                        </button>
                      </>
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
        {reservations.map((r) => (
          <div key={r.id} className={styles.mobileResCard}>
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
                  <button className={styles.btnAccept} onClick={() => onAction(r.id, "accept")} disabled={actionLoading === r.id}>Accepter</button>
                  <button className={styles.btnReject} onClick={() => onAction(r.id, "reject")} disabled={actionLoading === r.id}>Rejeter</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
