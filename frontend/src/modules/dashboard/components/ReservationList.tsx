"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Car, MapPin, Calendar, Download, ChevronRight, CheckCircle, XCircle, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/shared/utils";
import { fmt } from "@/shared/utils/format";
import type { LucideIcon } from "lucide-react";

interface StatusConfig {
  label: string;
  icon: LucideIcon;
  bg: string;
  border: string;
  text: string;
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
  confirmed:       { label: "Confirmée",       icon: CheckCircle,  bg: "from-emerald-500/30 to-emerald-500/10", border: "border-emerald-400/40", text: "text-emerald-400" },
  active:          { label: "En cours",        icon: Car,          bg: "from-primary/30 to-primary/10", border: "border-primary/40", text: "text-primary" },
  completed:       { label: "Terminée",        icon: CheckCircle,  bg: "from-blue-500/30 to-blue-500/10", border: "border-blue-400/40", text: "text-blue-400" },
  cancelled:       { label: "Annulée",         icon: XCircle,      bg: "from-red-500/30 to-red-500/10", border: "border-red-400/40", text: "text-red-400" },
  pending_payment: { label: "En attente",      icon: AlertCircle,  bg: "from-amber-500/30 to-amber-500/10", border: "border-amber-400/40", text: "text-amber-400" },
};

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.confirmed;
  const { label, icon: Icon, bg, border, text } = config;
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className={cn(
        "flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border-2",
        `bg-gradient-to-br ${bg} ${border} ${text}`
      )}
    >
      <Icon size={14} strokeWidth={2} /> {label}
    </motion.div>
  );
}

type ReservationStatus = "confirmed" | "active" | "completed" | "cancelled" | "pending_payment";

interface ReservationListItem {
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

interface ReservationListProps {
  reservations: ReservationListItem[];
  loading: boolean;
  onSelect: (r: ReservationListItem) => void;
}

export default function ReservationList({ reservations, loading, onSelect }: ReservationListProps) {
  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-32"
      >
        <Loader2 size={52} className="animate-spin mx-auto text-gold opacity-60 mb-6" />
        <p className="text-xs font-bold uppercase tracking-widest text-ink-3">Synchronisation des données...</p>
      </motion.div>
    );
  }

  if (reservations.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-32 bg-surface-1 rounded-2xl border-2 border-border"
      >
        <Car size={72} className="mx-auto mb-8 text-gold/30" />
        <h3 className="text-2xl font-bold text-ink-1 mb-3 font-serif">Le garage est vide.</h3>
        <p className="text-ink-2 max-w-sm mx-auto mb-8 font-light">Votre prochaine aventure n&apos;attend que vous. Explorez notre collection exclusive.</p>
        <Link href="/fleet" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-gold/90 text-ink-1 px-8 py-4 rounded-lg text-xs font-bold uppercase tracking-wider hover:shadow-lg hover:shadow-gold/40 transition-all">
          Découvrir la flotte <ArrowRight size={16} strokeWidth={3} />
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-5"
    >
      {reservations.map((res, idx) => (
        <motion.div
          key={res.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.08, duration: 0.5 }}
          whileHover={{ y: -2 }}
          className="group rounded-2xl transition-all overflow-hidden flex flex-col lg:flex-row card-premium"
        >
          {/* Image */}
          <div className="w-full lg:w-80 h-56 lg:h-auto relative overflow-hidden shrink-0">
            <Image
              src={res.img || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000&auto=format&fit=crop"}
              alt={res.vehicle}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              width={1000}
              height={600}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface-0/90 to-transparent flex items-start p-6">
              <StatusBadge status={res.status} />
            </div>
          </div>

          {/* Content */}
          <div className="p-8 flex-1 flex flex-col justify-between">
            
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-8">
              <div className="flex-1">
                <p className="section-eyebrow mb-3">Expérience Active</p>
                <h3 className="text-3xl font-normal text-ink-1 tracking-tight mb-4 font-display italic">{res.vehicle}</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-ink-2">
                    <MapPin size={16} className="text-gold" />
                    <span className="text-sm font-semibold">Vectoria Center</span>
                  </div>
                  <div className="flex items-center gap-3 text-ink-2">
                    <Calendar size={16} className="text-gold" />
                    <span className="text-sm font-semibold">{res.startDate} — {res.endDate}</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="text-right w-full lg:w-auto lg:border-none border-t border-border pt-6 lg:pt-0">
                <p className="text-xs font-bold uppercase tracking-widest text-ink-3 mb-2">Montant Total</p>
                <p className="text-3xl font-bold text-gold tracking-tight">{fmt(res.totalPrice)} <span className="text-lg text-ink-3 ml-1">DH</span></p>
              </div>
            </div>

            {/* Custom Luxury Separator Line */}
            <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent w-full my-6" />

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelect(res)}
                className="px-6 py-2.5 bg-surface-1 border-2 border-border rounded-lg text-xs font-bold uppercase tracking-wider text-ink-1 hover:border-gold hover:bg-gold/5 transition-all"
              >
                Détails
              </motion.button>

              {res.hasContract && (
                <motion.a 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={`${process.env.NEXT_PUBLIC_API_URL || "/api/v1"}/reservations/${res.id}/contract/file?lang=fr`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-500/20 border border-emerald-400/30 rounded-lg text-xs font-bold uppercase tracking-wider text-emerald-400 hover:bg-emerald-500/30 transition-all cursor-pointer"
                >
                  <Download size={14} strokeWidth={2} /> Contrat
                </motion.a>
              )}

              <motion.button 
                whileHover={{ scale: 1.05 }}
                onClick={() => onSelect(res)} 
                className="ml-auto w-12 h-12 bg-surface-1 border-2 border-border rounded-lg flex items-center justify-center text-ink-2 hover:border-gold hover:text-gold hover:bg-gold/5 transition-all group"
              >
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
