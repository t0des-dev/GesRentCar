"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import {
  TrendingUp, Calendar, Car, Percent,
  CheckCircle, XCircle, Download,
  AlertTriangle, RefreshCw, Users,
  Trophy, Wallet, Eye,
} from "lucide-react";
import RevenueChart from "@/components/RevenueChart";
import FleetPieChart from "@/components/FleetPieChart";
import PricingSimulator from "@/components/PricingSimulator";
import ProfitabilityTable from "@/components/ProfitabilityTable";
// StorefrontManager is available at /admin/storefront route
import styles from "./page.module.css";
import { Palette } from "lucide-react";

import api from "@/lib/api/client";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

function getToken() {
  return localStorage.getItem("auth_token") || "";
}

type Reservation = {
  id: number;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  client?: { 
    name: string; 
    cin_image_url?: string; 
    license_image_url?: string; 
  };
  vehicle?: { brand: string; model: string; plate: string };
};

type Stats = {
  revenue: number;
  reservations_count: number;
  active_bookings: number;
  occupancy_rate: number;
  maintenance_alerts?: { vehicle: string; plate: string; days: number }[];
  partner_due?: number;
  revenue_history?: { month: string; revenue: number }[];
  fleet_distribution?: { name: string; value: number }[];
  top_vehicles?: { brand: string; model: string; count: number; revenue: number }[];
  payment_status?: { name: string; value: number }[];
};

export default function AdminDashboard() {
  const { user, checking } = useAuthGuard("admin");
  const [stats, setStats] = useState<Stats | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [previewDocs, setPreviewDocs] = useState<{cin?: string, license?: string, name?: string} | null>(null);


  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, resRes] = await Promise.all([
        api.get("/stats"),
        api.get("/reservations"),
      ]);

      setStats(statsRes.data);
      setReservations(Array.isArray(resRes.data) ? resRes.data : resRes.data.data ?? []);
    } catch {
      // Données de démonstration si le backend est inaccessible
      setStats({
        revenue: 6000,
        reservations_count: 1,
        active_bookings: 1,
        occupancy_rate: 25,
        maintenance_alerts: [],
        partner_due: 900,
        revenue_history: [
          { month: "Jan", revenue: 2000 },
          { month: "Feb", revenue: 4000 },
          { month: "Mar", revenue: 6000 },
        ],
        fleet_distribution: [
          { name: "Interne", value: 4 },
          { name: "Partenaires", value: 2 },
        ],
        top_vehicles: [
          { brand: "Mercedes", model: "Class C", count: 12, revenue: 10200 },
          { brand: "VW", model: "Polo", count: 10, revenue: 4500 },
          { brand: "BMW", model: "X5", count: 8, revenue: 12000 },
        ],
        payment_status: [
          { name: "Payé", value: 45 },
          { name: "En attente", value: 12 },
          { name: "En retard", value: 3 },
        ]
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (!checking && user) fetchData(); }, [fetchData, checking, user]);

  if (checking) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'60vh',color:'#94a3b8'}}>Vérification de la session...</div>;

  const handleAction = async (id: number, action: "accept" | "reject") => {
    setActionLoading(id);
    try {
      await api.post(`/reservations/${id}/${action}`);
      await fetchData(); // Rafraîchir après action
    } catch (_err) { /* ignore */ } finally {
      setActionLoading(null);
    }
  };

  const handleExport = () => {
    const token = getToken();
    window.open(`${API}/exports/reservations?token=${token}`, "_blank");
  };

  const kpiCards = stats ? [
    {
      label: "Revenus Totaux",
      value: `${stats.revenue.toLocaleString('fr-FR')} DH`,
      icon: TrendingUp,
      color: "#10b981",
      bg: "rgba(16, 185, 129, 0.08)",
    },
    {
      label: "Réservations",
      value: stats.reservations_count,
      icon: Calendar,
      color: "#6366f1",
      bg: "rgba(99, 102, 241, 0.08)",
    },
    {
      label: "Locations Actives",
      value: stats.active_bookings,
      icon: Car,
      color: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.08)",
    },
    {
      label: "Taux d'Occupation",
      value: `${stats.occupancy_rate}%`,
      icon: Percent,
      color: "#8b5cf6",
      bg: "rgba(139, 92, 246, 0.08)",
    },
  ] : [];

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Vue d'Ensemble</h1>
          <p className={styles.subtitle}>Analysez vos performances et gérez vos réservations en temps réel.</p>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.refreshBtn}
            onClick={fetchData}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? styles.spinning : ""} />
            Actualiser
          </button>
          <button className={styles.exportBtn} onClick={handleExport}>
            <Download size={16} />
            Exporter les Données
          </button>
        </div>
      </header>

      {/* KPI Cards (Bento Style) */}
      {loading ? (
        <div className={styles.skeletonGrid}>
          {[1, 2, 3, 4].map((i) => <div key={i} className={styles.skeleton} />)}
        </div>
      ) : (
        <div className={styles.statsGrid}>
          {kpiCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className={styles.statCard}>
                <div
                  className={styles.statIcon}
                  style={{ background: card.bg, color: card.color }}
                >
                  <Icon size={24} />
                </div>
                <div>
                  <span className={styles.statLabel}>{card.label}</span>
                  <span className={styles.statValue}>
                    {card.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Performance Row */}
      {!loading && stats && (
        <div className={styles.chartsGrid}>
          <div className={styles.chartCard}>
            <div className={styles.sectionHeader}>
               <div className="bg-primary/10 p-3 rounded-2xl">
                <TrendingUp size={20} className="text-primary" />
               </div>
               <h2>Croissance des Revenus</h2>
            </div>
            <RevenueChart data={stats.revenue_history || []} />
          </div>
          <div className={styles.chartCard}>
            <div className={styles.sectionHeader}>
               <div className="bg-slate-100 p-3 rounded-2xl">
                <Car size={20} className="text-slate-600" />
               </div>
               <h2>État de la Flotte</h2>
            </div>
            <FleetPieChart data={stats.fleet_distribution || []} />
          </div>
        </div>
      )}

      {/* Strategic Pricing Row */}
      {!loading && (
        <div className="mb-12">
          <PricingSimulator />
        </div>
      )}

      {/* Analysis Row 2 */}
      {!loading && stats && (
        <div className={styles.chartsGrid}>
          {/* Top Vehicles */}
          <div className={styles.chartCard}>
            <div className={styles.sectionHeader}>
               <div className="bg-yellow-50 p-3 rounded-2xl">
                <Trophy size={20} className="text-yellow-500" />
               </div>
               <h2>Modèles les plus Demandés</h2>
            </div>
            <div className="space-y-3">
              {stats.top_vehicles?.map((v, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/20 transition-all hover:bg-white hover:shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm text-primary flex items-center justify-center font-black text-sm border border-slate-100">
                      #{i + 1}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 leading-none mb-1">{v.brand} {v.model}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{v.count} réservations</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900">{v.revenue.toLocaleString()} DH</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Distribution */}
          <div className={styles.chartCard}>
            <div className={styles.sectionHeader}>
               <div className="bg-indigo-50 p-3 rounded-2xl">
                <Wallet size={20} className="text-primary" />
               </div>
               <h2>Encaissements</h2>
            </div>
            <FleetPieChart data={stats.payment_status || []} />
          </div>
        </div>
      )}

      {/* Reservations Table */}
      {/* ── Profitability Section ── */}
      {!loading && (
        <div className="mb-12">
          <ProfitabilityTable />
        </div>
      )}

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
                            onClick={() => setPreviewDocs({
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
                      {(r as any).contract ? (
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                            <CheckCircle size={10} /> Généré
                          </span>
                          <a 
                            href={`http://localhost:8000/storage/${(r as any).contract.file_path}`} 
                            target="_blank" 
                            className="text-[9px] font-black text-primary hover:underline flex items-center gap-1"
                          >
                            <Download size={10} /> Télécharger
                          </a>
                        </div>
                      ) : (
                        <button 
                          onClick={async () => {
                            setActionLoading(r.id);
                            try {
                              await api.post(`/reservations/${r.id}/contract`);
                              await fetchData();
                            } catch { alert("Erreur génération"); } finally { setActionLoading(null); }
                          }}
                          className="text-[9px] font-black text-slate-400 hover:text-primary uppercase tracking-widest border border-slate-200 px-2 py-1 rounded-lg hover:border-primary transition-all flex items-center gap-1"
                        >
                          <RefreshCw size={10} /> Générer
                        </button>
                      )}
                    </td>
                    <td className={styles.actions}>
                      {r.status === "pending" ? (
                        <>
                          <button
                            className={styles.btnAccept}
                            onClick={() => handleAction(r.id, "accept")}
                            disabled={actionLoading === r.id}
                          >
                            Accepter
                          </button>
                          <button
                            className={styles.btnReject}
                            onClick={() => handleAction(r.id, "reject")}
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

        {/* ── Mobile View (Cards) ── */}
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
                <div className={styles.cardClient}>
                  Par {r.client?.name ?? "Client inconnu"}
                </div>
                <div className={styles.period} style={{ marginTop: '0.5rem' }}>
                   {r.start_date} au {r.end_date}
                </div>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.price}>{r.total_price.toLocaleString()} DH</div>
                
                {r.status === "pending" && (
                  <div className={styles.mobileActions}>
                    <button 
                      className={styles.btnAccept} 
                      style={{ padding: '0.6rem 1rem', fontSize: '0.75rem' }}
                      onClick={() => handleAction(r.id, "accept")}
                      disabled={actionLoading === r.id}
                    >
                      Accepter
                    </button>
                    <button 
                      className={styles.btnReject} 
                      style={{ padding: '0.6rem 1rem', fontSize: '0.75rem' }}
                      onClick={() => handleAction(r.id, "reject")}
                      disabled={actionLoading === r.id}
                    >
                      Rejeter
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {reservations.length === 0 && (
             <p className="text-center text-slate-400 font-bold py-10">Aucune réservation</p>
          )}
        </div>
      </section>

      {/* Maintenance Alerts */}
      {stats?.maintenance_alerts && stats.maintenance_alerts.length > 0 && (
        <section className={styles.section} style={{ marginTop: '2.5rem', border: '1px solid #fee2e2' }}>
          <div className={styles.sectionHeader}>
            <AlertTriangle size={20} className="text-red-500" />
            <h2 className="text-red-900">Alertes de Maintenance Critique</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.maintenance_alerts.map((alert, i) => (
              <div key={i} className="flex items-center gap-4 bg-red-50 p-4 rounded-2xl border border-red-100">
                <div className="w-10 h-10 rounded-xl bg-white text-red-500 flex items-center justify-center shadow-sm">
                  <Car size={20} />
                </div>
                <div>
                  <p className="font-bold text-red-900 text-sm">{alert.vehicle}</p>
                  <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest">{alert.plate}</p>
                </div>
                <div className="ml-auto bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">
                  {alert.days}j
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      {/* Document Preview Modal */}
      {previewDocs && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={() => setPreviewDocs(null)} />
          <div className="bg-white rounded-[40px] w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl flex flex-col animate-in zoom-in-95 duration-500 border border-white/20">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Documents : {previewDocs.name}</h3>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Justificatifs d'identité et de conduite</p>
              </div>
              <button onClick={() => setPreviewDocs(null)} className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all">
                <XCircle size={24} className="text-slate-400" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8 bg-white">
              {previewDocs.cin && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Carte d'Identité (CIN)</span>
                    <a href={`http://localhost:8000${previewDocs.cin}`} target="_blank" rel="noopener noreferrer" className="text-primary font-black text-[10px] uppercase hover:underline">Ouvrir l'original</a>
                  </div>
                  <div className="aspect-video rounded-3xl overflow-hidden border-4 border-slate-100 shadow-inner group relative">
                    <img src={`http://localhost:8000${previewDocs.cin}`} alt="CIN" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-all pointer-events-none" />
                  </div>
                </div>
              )}
              {previewDocs.license && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Permis de Conduire</span>
                    <a href={`http://localhost:8000${previewDocs.license}`} target="_blank" rel="noopener noreferrer" className="text-primary font-black text-[10px] uppercase hover:underline">Ouvrir l'original</a>
                  </div>
                  <div className="aspect-video rounded-3xl overflow-hidden border-4 border-slate-100 shadow-inner group relative">
                    <img src={`http://localhost:8000${previewDocs.license}`} alt="Permis" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-all pointer-events-none" />
                  </div>
                </div>
              )}
              {!previewDocs.cin && !previewDocs.license && (
                <div className="col-span-2 py-20 text-center text-slate-400">
                  <AlertTriangle size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="font-bold">Aucun document numérisé pour ce client.</p>
                </div>
              )}
            </div>
            
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => setPreviewDocs(null)} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary transition-all">
                Fermer l'Aperçu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
