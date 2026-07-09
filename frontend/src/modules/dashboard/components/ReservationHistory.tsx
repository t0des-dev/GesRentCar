"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ChevronRight, Download, CheckCircle, XCircle, AlertCircle, Car, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/shared/utils";
import { fmt } from "@/shared/utils/format";
import { useMyReservations } from "@/shared/hooks/useApi";
import ReservationDetailModal from "./ReservationDetailModal";
import type { Reservation } from "@/lib/api/reservations";
import type { LucideIcon } from "lucide-react";

interface StatusConfig {
  label: string;
  icon: LucideIcon;
  bg: string;
  border: string;
  text: string;
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
  confirmed:       { label: "Confirmée",  icon: CheckCircle, bg: "from-emerald-500/30 to-emerald-500/10", border: "border-emerald-400/40", text: "text-emerald-400" },
  active:          { label: "En cours",   icon: Car,         bg: "from-primary/30 to-primary/10", border: "border-primary/40", text: "text-primary" },
  completed:       { label: "Terminée",   icon: CheckCircle, bg: "from-blue-500/30 to-blue-500/10", border: "border-blue-400/40", text: "text-blue-400" },
  cancelled:       { label: "Annulée",    icon: XCircle,     bg: "from-red-500/30 to-red-500/10", border: "border-red-400/40", text: "text-red-400" },
  pending_payment: { label: "En attente", icon: AlertCircle, bg: "from-amber-500/30 to-amber-500/10", border: "border-amber-400/40", text: "text-amber-400" },
};

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.confirmed;
  const { label, icon: Icon, bg, border, text } = config;
  return (
    <div className={cn(
      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border",
      `bg-gradient-to-br ${bg} ${border} ${text}`
    )}>
      <Icon size={12} strokeWidth={2.5} /> {label}
    </div>
  );
}

export default function ReservationHistory() {
  const { data: reservations, isLoading, error } = useMyReservations();
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  if (isLoading) {
    return (
      <div className="text-center py-32">
        <Loader2 size={48} className="animate-spin mx-auto text-gold opacity-60 mb-6" />
        <p className="text-xs font-bold uppercase tracking-widest text-ink-3">Chargement des réservations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-32 bg-surface-1 rounded-2xl border-2 border-border">
        <XCircle size={48} className="mx-auto mb-6 text-red-400/50" />
        <h3 className="text-xl font-bold text-ink-1 mb-3 font-serif">Erreur de chargement</h3>
        <p className="text-ink-2 text-sm">Impossible de récupérer vos réservations.</p>
      </div>
    );
  }

  const list = Array.isArray(reservations) ? reservations : [];

  if (list.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-32 bg-surface-1 rounded-2xl border-2 border-border"
      >
        <Car size={64} className="mx-auto mb-8 text-gold/30" />
        <h3 className="text-2xl font-bold text-ink-1 mb-3 font-serif">Aucune réservation</h3>
        <p className="text-ink-2 max-w-sm mx-auto mb-8 text-sm">Votre prochaine aventure n&apos;attend que vous. Explorez notre collection exclusive.</p>
        <Link href="/fleet" className="inline-flex items-center gap-2 bg-gradient-to-r from-gold to-gold/90 text-ink-1 px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-gold/30 hover:shadow-xl hover:shadow-gold/40 transition-all">
          Découvrir la flotte <ArrowRight size={16} strokeWidth={3} />
        </Link>
      </motion.div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        {list.map((res: Reservation, idx: number) => (
          <motion.div
            key={res.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.5 }}
            whileHover={{ y: -2 }}
            className="group rounded-2xl transition-all overflow-hidden flex flex-col lg:flex-row bg-surface-1 border-2 border-border hover:border-gold/40 hover:shadow-xl hover:shadow-gold/5"
          >
            <div className="w-full lg:w-72 h-48 lg:h-auto relative overflow-hidden shrink-0">
              <Image
                src={(res.vehicle as any)?.image_url || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000&auto=format&fit=crop"}
                alt={res.vehicle ? `${res.vehicle.brand} ${res.vehicle.model}` : "Véhicule"}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                width={400}
                height={250}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-surface-0/80 to-transparent flex items-start p-4">
                <StatusBadge status={res.status} />
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-ink-3 mb-2">Réservation #{res.id}</p>
                <h3 className="text-xl font-bold text-ink-1 tracking-tight mb-3 font-serif">
                  {res.vehicle ? `${res.vehicle.brand} ${res.vehicle.model}` : `Véhicule #${res.vehicle_id}`}
                </h3>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                  <div className="flex items-center gap-2 text-ink-2">
                    <Calendar size={14} className="text-gold" />
                    <span className="text-sm font-semibold">{res.start_date} — {res.end_date}</span>
                  </div>
                  {res.vehicle?.plate && (
                    <div className="flex items-center gap-2 text-ink-2">
                      <MapPin size={14} className="text-gold" />
                      <span className="text-sm font-semibold">{res.vehicle.plate}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent w-full my-5" />

              <div className="flex flex-wrap items-center gap-3">
                <div className="text-right flex-1 sm:flex-none">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink-3 mb-1">Total</p>
                  <p className="text-xl font-bold text-gold tracking-tight">{fmt(res.total_price)} <span className="text-sm text-ink-3 ml-0.5">DH</span></p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedReservation(res)}
                  className="ml-auto px-5 py-2.5 bg-surface-1 border-2 border-border rounded-xl text-[10px] font-bold uppercase tracking-wider text-ink-1 hover:border-gold hover:bg-gold/5 transition-all"
                >
                  Détails
                </motion.button>

                {(res as any).has_contract && (
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL || "/api/v1"}/public/reservations/${res.id}/contract?lang=fr`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-500/15 border border-emerald-400/30 rounded-xl text-[10px] font-bold uppercase tracking-wider text-emerald-400 hover:bg-emerald-500/25 transition-all"
                  >
                    <Download size={12} strokeWidth={2.5} /> Contrat
                  </a>
                )}

                <button
                  onClick={() => setSelectedReservation(res)}
                  className="w-10 h-10 bg-surface-1 border-2 border-border rounded-xl flex items-center justify-center text-ink-2 hover:border-gold hover:text-gold hover:bg-gold/5 transition-all group/btn"
                >
                  <ChevronRight size={18} className="group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedReservation && (
        <ReservationDetailModal
          reservation={{
            id: selectedReservation.id,
            vehicle: selectedReservation.vehicle
              ? `${selectedReservation.vehicle.brand} ${selectedReservation.vehicle.model}`
              : `Véhicule #${selectedReservation.vehicle_id}`,
            startDate: selectedReservation.start_date,
            endDate: selectedReservation.end_date,
            totalPrice: selectedReservation.total_price,
            img: (selectedReservation.vehicle as any)?.image_url,
            hasContract: (selectedReservation as any).has_contract,
          }}
          onClose={() => setSelectedReservation(null)}
        />
      )}
    </>
  );
}
