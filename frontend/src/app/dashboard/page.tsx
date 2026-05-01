"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Car, Calendar, FileText, CreditCard,
  Download, Clock, CheckCircle, XCircle, AlertCircle,
  User, LogOut, ChevronRight, Loader2, ArrowRight, Crown, MapPin, Shield
} from "lucide-react";
import { useMyReservations, useCancelReservation } from "@/hooks/useApi";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
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


// ─── Main Dashboard ────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"all" | ReservationStatus>("all");
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
  const { data: apiReservations, isLoading: reservationsLoading } = useMyReservations();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Use API data if available, otherwise fall back to mocks for demo
  const RESERVATIONS: Reservation[] = (apiReservations as any)?.data ?? MOCK_RESERVATIONS;

  const filtered = activeTab === "all"
    ? RESERVATIONS
    : RESERVATIONS.filter((r) => r.status === activeTab);

  const totalSpent = RESERVATIONS
    .filter(r => r.status === "completed" || r.status === "active")
    .reduce((acc, r) => acc + (r.paidAmount || 0), 0);

  const upcoming = RESERVATIONS.filter(r => r.status === "confirmed").length;
  const pending  = RESERVATIONS.filter(r => r.status === "pending_payment").length;

  const TABS: { key: "all" | ReservationStatus; label: string }[] = [
    { key: "all",             label: "Vue d'ensemble" },
    { key: "active",          label: "En mission" },
    { key: "confirmed",       label: "Réservations" },
    { key: "pending_payment", label: "Paiements" },
    { key: "completed",       label: "Historique" },
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 pb-24 relative overflow-hidden">
      {/* Arctic Ambient Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      {/* Details Modal (Glassmorphic) */}
      <AnimatePresence>
        {selectedRes && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setSelectedRes(null)} 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-slate-900/50 border border-white/10 rounded-[48px] w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl flex flex-col"
            >
              <button onClick={() => setSelectedRes(null)} className="absolute top-8 right-8 z-20 w-12 h-12 bg-white/5 hover:bg-white/10 text-white rounded-full flex items-center justify-center transition-all">
                <XCircle size={24} />
              </button>
              <div className="h-64 relative overflow-hidden">
                {selectedRes.img ? (
                  <img src={selectedRes.img} alt={selectedRes.vehicle} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800"><Car size={80} className="opacity-10"/></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-10">
                  <div>
                    <span className="bg-primary/20 text-primary px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-3 inline-block">Référence : #{selectedRes.id}00X</span>
                    <h2 className="text-4xl font-black text-white tracking-tighter">{selectedRes.vehicle}</h2>
                  </div>
                </div>
              </div>
              <div className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                    <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-2">Itinéraire Temporel</p>
                    <p className="font-bold text-base text-white">{selectedRes.startDate} <ArrowRight size={14} className="inline mx-2 text-primary" /> {selectedRes.endDate}</p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-right">
                    <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-2">Investissement</p>
                    <p className="font-black text-2xl text-white">{mounted ? selectedRes.totalPrice.toLocaleString() : selectedRes.totalPrice} DH</p>
                    <p className="text-[10px] text-emerald-400 font-bold mt-1 uppercase tracking-widest">Transaction Sécurisée</p>
                  </div>
                </div>
                <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
                  <button onClick={() => setSelectedRes(null)} className="px-10 py-4 rounded-2xl bg-white/5 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Retour</button>
                  {selectedRes.hasContract && (
                    <button className="px-10 py-4 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">Télécharger l'Acte</button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">

        {/* ── VIP PROFILE HEADER ─────────────────────────────────────────── */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-16 p-10 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[48px] shadow-2xl relative group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Crown size={120} />
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-blue-500 p-1">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden border-2 border-slate-900">
                  <User size={40} className="text-primary" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full border-4 border-slate-950 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            </div>
            <div className="text-center md:text-left">
              <p className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-2">Membre Élite Vectoria</p>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
                {session?.user?.name || "L'Excellence"}
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-2">Votre voyage sur mesure continue ici.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6 mt-8 md:mt-0">
            <Link 
              href="/dashboard/profile"
              className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all group"
            >
              <Shield size={16} className="text-primary group-hover:scale-110 transition-transform" /> 
              Sécurité & Profil
            </Link>
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all group"
            >
              <LogOut size={16} className="group-hover:-translate-x-1 transition-transform text-red-500" /> 
              Quitter le Salon
            </button>
          </div>
        </header>

        {/* ── KPI GRID ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <KpiCard icon={Car} label="Expériences" value={RESERVATIONS.length} color="bg-primary/20 text-primary border-primary/20" />
          <KpiCard icon={CheckCircle} label="Confirmées" value={upcoming} color="bg-emerald-500/20 text-emerald-400 border-emerald-500/20" />
          <KpiCard icon={Clock} label="En Attente" value={pending} color="bg-amber-500/20 text-amber-400 border-amber-500/20" />
          <KpiCard 
            icon={CreditCard} 
            label="Total Investi" 
            value={mounted ? `${totalSpent.toLocaleString()} DH` : `${totalSpent} DH`} 
            color="bg-white/5 text-white border-white/10"
          />
        </div>

        {/* ── TABS NAVIGATION ────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-4 mb-12 justify-center lg:justify-start border-b border-white/5 pb-8">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500",
                activeTab === tab.key
                  ? "bg-primary text-white shadow-[0_10px_30px_rgba(37,99,235,0.3)] scale-105"
                  : "text-slate-500 hover:text-white hover:bg-white/5"
              )}
            >
              {tab.label}
              {tab.key !== "all" && (
                <span className={cn("ml-3 px-2 py-0.5 rounded-md text-[8px]", activeTab === tab.key ? "bg-white/20" : "bg-white/5")}>
                  {RESERVATIONS.filter(r => r.status === tab.key).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── RESERVATION FEED ───────────────────────────────────────────── */}
        <div className="space-y-8">
          {reservationsLoading ? (
            <div className="text-center py-32">
              <Loader2 size={64} className="animate-spin mx-auto text-primary opacity-20" />
              <p className="mt-6 text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Synchronisation des données...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-32 bg-white/5 rounded-[48px] border border-dashed border-white/10">
              <Car size={80} className="mx-auto mb-8 opacity-5" />
              <h3 className="text-2xl font-black text-white mb-4 tracking-tight">Le garage est vide.</h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-10">Votre prochaine aventure n'attend que vous. Explorez notre collection exclusive.</p>
              <Link href="/fleet" className="inline-flex items-center gap-4 bg-primary text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                DÉCOUVRIR LA FLOTTE <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            filtered.map((res, idx) => (
              <motion.div
                key={res.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-[40px] overflow-hidden hover:bg-white/[0.08] hover:border-primary/40 transition-all duration-700 flex flex-col lg:flex-row"
              >
                {/* Visual Section */}
                <div className="w-full lg:w-80 h-64 lg:h-auto relative overflow-hidden">
                  <img 
                    src={res.img || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000&auto=format&fit=crop"} 
                    alt={res.vehicle}
                    className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-transparent flex items-start p-6">
                    <StatusBadge status={res.status} />
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-10 flex-1 flex flex-col justify-between gap-10">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                    <div>
                      <p className="text-primary font-black text-[9px] uppercase tracking-[0.3em] mb-2">Expérience Active</p>
                      <h3 className="text-3xl font-black text-white tracking-tighter mb-4 group-hover:text-primary transition-colors">{res.vehicle}</h3>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-slate-500">
                          <MapPin size={14} className="text-primary" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Vectoria Center</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                          <Calendar size={14} className="text-primary" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{res.startDate} — {res.endDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right lg:text-right w-full lg:w-auto border-t lg:border-none pt-6 lg:pt-0 border-white/5">
                      <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-2">Montant Total</p>
                      <p className="text-4xl font-black text-white tracking-tighter">{mounted ? res.totalPrice.toLocaleString() : res.totalPrice} <span className="text-sm font-medium text-slate-500">DH</span></p>
                      <p className="text-[10px] text-emerald-400 font-bold mt-2 uppercase tracking-widest">Virement Confirmé</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 pt-8 border-t border-white/5">
                    <button 
                      onClick={() => setSelectedRes(res)}
                      className="px-8 py-3.5 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white transition-all"
                    >
                      Détails de l'expérience
                    </button>
                    {res.hasContract && (
                      <button className="flex items-center gap-3 px-8 py-3.5 bg-secondary/20 text-secondary rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-secondary hover:text-secondary-foreground transition-all">
                        <Download size={14} /> Télécharger l'Acte
                      </button>
                    )}
                    <button className="ml-auto w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-slate-500 hover:text-primary hover:bg-primary/10 transition-all">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

// ─── Sub-Components ──────────────────────────────────────────────────────

function KpiCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType; label: string; value: string | number; color: string;
}) {
  return (
    <div className={cn("bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex items-center gap-6 group hover:border-primary/40 transition-all duration-500", color.split(' ')[2])}>
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-lg", color.split(' ')[0])}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-black text-white tracking-tighter">{value}</p>
      </div>
    </div>
  );
}
