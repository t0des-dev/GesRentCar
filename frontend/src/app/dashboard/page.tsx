"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Car, Calendar, FileText, CreditCard,
  Download, Clock, CheckCircle, XCircle, AlertCircle,
  User, LogOut, ChevronRight, Loader2, ArrowRight
} from "lucide-react";
import { useMyReservations, useCancelReservation } from "@/hooks/useApi";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

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
  {
    id: 1,
    vehicle: "Mercedes Class C 220d",
    plate: "12345-A-1",
    startDate: "2026-06-01",
    endDate: "2026-06-10",
    totalPrice: 7650,
    depositAmount: 765,
    status: "confirmed",
    paidAmount: 765,
    hasContract: true,
    img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 2,
    vehicle: "BMW X5 xDrive40i",
    plate: "67890-B-2",
    startDate: "2026-05-10",
    endDate: "2026-05-15",
    totalPrice: 6000,
    depositAmount: 600,
    status: "active",
    paidAmount: 6000,
    hasContract: true,
    img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 3,
    vehicle: "Audi RS5 Coupé",
    plate: "11111-C-3",
    startDate: "2026-07-15",
    endDate: "2026-07-20",
    totalPrice: 9000,
    depositAmount: 900,
    status: "pending_payment",
    paidAmount: 0,
    hasContract: false,
    img: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 4,
    vehicle: "Volkswagen Golf GTI",
    plate: "22222-D-4",
    startDate: "2026-04-01",
    endDate: "2026-04-05",
    totalPrice: 2000,
    depositAmount: 200,
    status: "cancelled",
    paidAmount: 0,
    hasContract: false,
    img: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=400",
  },
];

// ─── Status Badge ──────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<ReservationStatus, { label: string; icon: React.ElementType; className: string }> = {
  confirmed:       { label: "Confirmée",       icon: CheckCircle,  className: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800" },
  active:          { label: "En cours",        icon: Car,          className: "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800 shadow-[0_0_15px_rgba(37,99,235,0.2)]" },
  completed:       { label: "Terminée",        icon: CheckCircle,  className: "text-slate-600 bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700" },
  cancelled:       { label: "Annulée",         icon: XCircle,      className: "text-red-600 bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800" },
  pending_payment: { label: "En attente",      icon: AlertCircle,  className: "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800 animate-pulse" },
};

function StatusBadge({ status }: { status: ReservationStatus }) {
  const { label, icon: Icon, className } = STATUS_CONFIG[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border", className)}>
      <Icon size={13} strokeWidth={3} /> {label}
    </span>
  );
}

// ─── KPI Card ───────────────────────────────────────────────────────────────
function KpiCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <div className="bg-card/50 backdrop-blur-md border border-border rounded-3xl p-6 flex items-center gap-5 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 transition-all duration-300">
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner", color)}>
        <Icon size={26} className="text-white" />
      </div>
      <div>
        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{label}</p>
        <p className="text-3xl font-black text-foreground tracking-tight">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1 font-semibold">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"all" | ReservationStatus>("all");
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
  const { data: apiReservations, isLoading: reservationsLoading } = useMyReservations();
  const cancelReservation = useCancelReservation();

  // Use API data if available, otherwise fall back to mocks for demo
  const RESERVATIONS: Reservation[] = (apiReservations as unknown as Reservation[] | undefined) ?? MOCK_RESERVATIONS;

  const filtered = activeTab === "all"
    ? RESERVATIONS
    : RESERVATIONS.filter((r) => r.status === activeTab);

  const totalSpent = RESERVATIONS
    .filter(r => r.status === "completed" || r.status === "active")
    .reduce((acc, r) => acc + r.paidAmount, 0);

  const upcoming = RESERVATIONS.filter(r => r.status === "confirmed").length;
  const pending  = RESERVATIONS.filter(r => r.status === "pending_payment").length;

  const TABS: { key: "all" | ReservationStatus; label: string }[] = [
    { key: "all",             label: "Toutes" },
    { key: "active",          label: "En cours" },
    { key: "confirmed",       label: "Confirmées" },
    { key: "pending_payment", label: "En attente" },
    { key: "completed",       label: "Historique" },
  ];

  return (
    <main className="min-h-screen pt-32 pb-24 bg-background relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-1/2 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-1/2 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/4" />

      {/* Details Modal */}
      {selectedRes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedRes(null)} />
          <div className="bg-card rounded-[36px] w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-500 border border-border">
            <button onClick={() => setSelectedRes(null)} className="absolute top-6 right-6 z-20 w-10 h-10 bg-muted hover:bg-muted/80 text-foreground rounded-full flex items-center justify-center transition-all">
              <XCircle size={24} />
            </button>
            <div className="h-48 relative overflow-hidden bg-muted">
              {selectedRes.img ? (
                <img src={selectedRes.img} alt={selectedRes.vehicle} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><Car size={64} className="opacity-20"/></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                <div>
                  <p className="text-primary font-black text-[10px] uppercase tracking-widest mb-1">Réf: VRC-{selectedRes.id}</p>
                  <h2 className="text-3xl font-black text-white">{selectedRes.vehicle}</h2>
                </div>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 p-4 rounded-2xl border border-border">
                  <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Période</p>
                  <p className="font-bold text-sm text-foreground">{selectedRes.startDate} <br/><span className="text-muted-foreground">au</span> {selectedRes.endDate}</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-2xl border border-border">
                  <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Financier</p>
                  <p className="font-black text-xl text-foreground">{selectedRes.totalPrice} DH</p>
                  <p className="text-xs text-emerald-600 font-bold mt-1">Payé: {selectedRes.paidAmount} DH</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                {selectedRes.hasContract && (
                  <a href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/public/reservations/${selectedRes.id}/contract`} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-xl bg-secondary/10 text-secondary font-bold text-sm hover:bg-secondary hover:text-secondary-foreground transition-all glow-gold">Télécharger Contrat</a>
                )}
                <button onClick={() => setSelectedRes(null)} className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:shadow-lg transition-all">Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 max-w-6xl relative z-10">

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6 bg-card/40 backdrop-blur-xl border border-border p-6 md:p-8 rounded-[36px] shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-blue-600 p-1 shadow-lg shadow-primary/20">
              <div className="w-full h-full rounded-full bg-card flex items-center justify-center border-4 border-background">
                <User size={32} className="text-primary" />
              </div>
            </div>
            <div>
              <p className="text-primary font-black text-[10px] uppercase tracking-[0.2em]">Espace Client VIP</p>
              <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">Bonjour, {session?.user?.name || "Client"}</h1>
            </div>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-destructive border-2 border-border hover:border-destructive/30 bg-background rounded-xl px-5 py-3 transition-all hover:shadow-md group">
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Déconnexion
          </button>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <KpiCard icon={Car}         label="Locations"      value={RESERVATIONS.length}   color="bg-primary" />
          <KpiCard icon={CheckCircle} label="À Venir"        value={upcoming}              color="bg-emerald-500" />
          <KpiCard icon={AlertCircle} label="En Attente"     value={pending}               color="bg-amber-500" />
          <KpiCard icon={CreditCard}  label="Dépenses"       value={`${totalSpent.toLocaleString('fr-FR')} DH`} sub="Montant total investi" color="bg-gradient-to-r from-yellow-500 to-amber-600" />
        </div>

        {/* Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8 no-scrollbar border-b border-border">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300",
                activeTab === tab.key
                  ? "bg-primary text-white shadow-lg shadow-primary/30 -translate-y-1"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {tab.label}
              {tab.key !== "all" && (
                <span className={cn("ml-2 px-2 py-0.5 rounded-md text-[10px]", activeTab === tab.key ? "bg-white/20" : "bg-border")}>
                  {RESERVATIONS.filter(r => r.status === tab.key).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Reservation List */}
        <div className="flex flex-col gap-6">
          {reservationsLoading && (
            <div className="text-center py-20 text-muted-foreground">
              <Loader2 size={48} className="animate-spin mx-auto mb-4 text-primary" />
              <p className="font-bold tracking-widest uppercase text-sm">Chargement des données...</p>
            </div>
          )}
          {!reservationsLoading && filtered.length === 0 && (
            <div className="text-center py-24 text-muted-foreground bg-card/30 rounded-[36px] border border-dashed border-border">
              <Car size={64} className="mx-auto mb-6 opacity-20" />
              <p className="font-black text-xl mb-2">Aucune réservation trouvée.</p>
              <p className="text-sm">Vous n'avez pas de véhicules dans cette catégorie.</p>
              <Link href="/fleet" className="inline-flex items-center gap-2 mt-6 text-primary font-bold hover:underline">
                Découvrir la flotte <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {filtered.map((res) => {
            const remaining = res.totalPrice - res.paidAmount;
            
            // Progress Bar Logic for Active Reservations
            let progress = 0;
            if (res.status === 'active') {
              const start = new Date(res.startDate).getTime();
              const end = new Date(res.endDate).getTime();
              const now = new Date().getTime();
              progress = Math.max(0, Math.min(100, ((now - start) / (end - start)) * 100));
            }

            return (
              <div key={res.id} className="bg-card/80 backdrop-blur-sm border border-border rounded-[32px] overflow-hidden hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group flex flex-col md:flex-row">
                
                {/* Left: Vehicle Image */}
                <div className="w-full md:w-64 h-48 md:h-auto relative shrink-0 overflow-hidden bg-muted">
                  {res.img ? (
                    <img src={res.img} alt={res.vehicle} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Car size={40} className="opacity-20"/></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-start p-4">
                    <StatusBadge status={res.status} />
                  </div>
                </div>

                {/* Right: Content */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between gap-6">
                  
                  {/* Top Header */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Réf: VRC-{res.id}</p>
                      <h3 className="text-2xl font-black text-foreground">{res.vehicle}</h3>
                      <p className="text-sm font-bold text-muted-foreground mt-1">Placque: {res.plate}</p>
                    </div>
                    
                    <div className="text-left md:text-right">
                      <p className="text-3xl font-black text-foreground">{res.totalPrice.toLocaleString('fr-FR')} <span className="text-sm text-muted-foreground">DH</span></p>
                      {remaining > 0 && res.status !== "cancelled" && (
                        <p className="text-xs text-amber-600 font-bold flex items-center md:justify-end gap-1 mt-1">
                          Reste à payer : {remaining.toLocaleString('fr-FR')} DH
                        </p>
                      )}
                      {remaining === 0 && res.status !== "cancelled" && (
                        <p className="text-xs text-emerald-600 font-bold flex items-center md:justify-end gap-1 mt-1">
                          <CheckCircle size={12} strokeWidth={3} /> Entièrement payé
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Middle: Progress Bar (If Active) */}
                  {res.status === 'active' && (
                    <div className="w-full bg-muted/50 p-4 rounded-2xl border border-border">
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span className="text-primary">Départ : {res.startDate}</span>
                        <span className="text-muted-foreground">Retour : {res.endDate}</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden relative">
                        <div className="bg-gradient-to-r from-primary to-blue-400 h-2 rounded-full absolute left-0 top-0 transition-all duration-1000" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )}
                  {res.status !== 'active' && (
                    <div className="flex items-center gap-2 bg-muted/50 w-fit px-4 py-2 rounded-xl border border-border">
                      <Calendar size={16} className="text-primary" />
                      <span className="text-sm font-bold text-foreground">
                        Du {res.startDate} au {res.endDate}
                      </span>
                    </div>
                  )}

                  {/* Bottom: Actions */}
                  <div className="flex flex-wrap gap-3 mt-auto pt-4 border-t border-border">
                    {res.hasContract && (
                      <a 
                        href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/public/reservations/${res.id}/contract`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-bold bg-secondary/10 text-secondary border border-secondary/30 rounded-xl px-5 py-2.5 hover:bg-secondary hover:text-secondary-foreground transition-all glow-gold"
                      >
                        <Download size={16} /> Contrat PDF
                      </a>
                    )}
                    
                    {res.status === "active" && (
                      <button className="flex items-center gap-2 text-sm font-bold bg-primary text-white rounded-xl px-5 py-2.5 hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
                        <Clock size={16} /> Prolonger
                      </button>
                    )}

                    {res.status === "pending_payment" && (
                      <button className="flex items-center gap-2 text-sm font-bold bg-emerald-500 text-white rounded-xl px-5 py-2.5 hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/20">
                        <CreditCard size={16} /> Payer l'acompte
                      </button>
                    )}

                    <button 
                      onClick={() => setSelectedRes(res)}
                      className="flex items-center gap-2 text-sm font-bold border-2 border-border text-muted-foreground rounded-xl px-5 py-2.5 hover:border-primary/50 hover:text-foreground transition-colors ml-auto"
                    >
                      Détails
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
