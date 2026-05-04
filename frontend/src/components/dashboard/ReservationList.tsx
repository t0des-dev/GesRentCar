"use client";

import { motion } from "framer-motion";
import { Car, MapPin, Calendar, Download, ChevronRight, CheckCircle, XCircle, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: any = {
  confirmed:       { label: "Confirmée",       icon: CheckCircle,  className: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800" },
  active:          { label: "En cours",        icon: Car,          className: "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800 shadow-[0_0_15px_rgba(37,99,235,0.2)]" },
  completed:       { label: "Terminée",        icon: CheckCircle,  className: "text-slate-600 bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700" },
  cancelled:       { label: "Annulée",         icon: XCircle,      className: "text-red-600 bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800" },
  pending_payment: { label: "En attente",      icon: AlertCircle,  className: "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800 animate-pulse" },
};

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.confirmed;
  const { label, icon: Icon, className } = config;
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border", className)}>
      <Icon size={13} strokeWidth={3} /> {label}
    </span>
  );
}

interface ReservationListProps {
  reservations: any[];
  loading: boolean;
  onSelect: (r: any) => void;
}

export default function ReservationList({ reservations, loading, onSelect }: ReservationListProps) {
  if (loading) {
    return (
      <div className="text-center py-32">
        <Loader2 size={64} className="animate-spin mx-auto text-primary opacity-20" />
        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Synchronisation des données...</p>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="text-center py-32 bg-white/5 rounded-[48px] border border-dashed border-white/10">
        <Car size={80} className="mx-auto mb-8 opacity-5" />
        <h3 className="text-2xl font-black text-white mb-4 tracking-tight">Le garage est vide.</h3>
        <p className="text-slate-500 max-w-sm mx-auto mb-10">Votre prochaine aventure n'attend que vous. Explorez notre collection exclusive.</p>
        <Link href="/fleet" className="inline-flex items-center gap-4 bg-primary text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">
          DÉCOUVRIR LA FLOTTE <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {reservations.map((res, idx) => (
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
                <p className="text-4xl font-black text-white tracking-tighter">{res.totalPrice.toLocaleString()} <span className="text-sm font-medium text-slate-500">DH</span></p>
                <p className="text-[10px] text-emerald-400 font-bold mt-2 uppercase tracking-widest">Virement Confirmé</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-8 border-t border-white/5">
              <button 
                onClick={() => onSelect(res)}
                className="px-8 py-3.5 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white transition-all"
              >
                Détails de l'expérience
              </button>
              {res.hasContract && (
                <button className="flex items-center gap-3 px-8 py-3.5 bg-secondary/20 text-secondary rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-secondary hover:text-secondary-foreground transition-all">
                  <Download size={14} /> Télécharger l'Acte
                </button>
              )}
              <button onClick={() => onSelect(res)} className="ml-auto w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-slate-500 hover:text-primary hover:bg-primary/10 transition-all">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
