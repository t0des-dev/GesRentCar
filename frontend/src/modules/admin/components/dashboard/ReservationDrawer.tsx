"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, FileText, CheckCircle, CreditCard, ShieldCheck, Download, AlertTriangle, MessageCircle, Mail, RefreshCw } from "lucide-react";
import { Reservation } from "@/types/admin";

interface ReservationDrawerProps {
  reservation: Reservation;
  onClose: () => void;
  onGenerateContract: (id: number) => void;
  actionLoading: number | null;
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

export default function ReservationDrawer({ reservation, onClose, onGenerateContract, actionLoading }: ReservationDrawerProps) {
  const steps = [
    { id: "pending_payment", label: "Réservé", icon: Calendar },
    { id: "pending", label: "Payé", icon: CreditCard },
    { id: "confirmed", label: "Contrat", icon: FileText },
    { id: "active", label: "En cours", icon: CheckCircle },
    { id: "completed", label: "Terminé", icon: ShieldCheck },
  ];

  const getCurrentStepIndex = () => {
    switch (reservation.status) {
      case "pending_payment":
      case "attente_paiement":
        return 0;
      case "pending":
      case "pending_partner":
        return 1;
      case "confirmed":
        return 2;
      case "active":
        return 3;
      case "completed":
        return 4;
      default:
        return 0;
    }
  };

  const currentStep = getCurrentStepIndex();

  const drawerVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { type: "spring" as const, damping: 30, stiffness: 300 }
    },
    exit: { 
      x: "100%", 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-surface-0/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          variants={drawerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          className="absolute top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl border-l-2 border-gold/30 overflow-y-auto"
        >
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="absolute top-6 right-6 z-20 w-12 h-12 bg-surface-1 border-2 border-border hover:border-gold hover:bg-gold/5 text-ink-2 hover:text-gold rounded-lg flex items-center justify-center transition-all"
          >
            <X size={22} strokeWidth={2} />
          </motion.button>

          {/* Header */}
          <div className="p-8 pb-6 border-b-2 border-border">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-3xl font-bold text-ink-1 tracking-tight font-serif mb-2">
                Détails de Réservation
              </h3>
              <p className="text-sm font-bold uppercase tracking-wider text-gold">
                REF: VC-{reservation.id.toString().padStart(4, "0")}
              </p>
            </motion.div>
          </div>

          <div className="p-8 space-y-8">
            {/* Timeline */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between gap-2 relative"
            >
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx < currentStep;
                const isActive = idx === currentStep;
                return (
                  <div key={step.id} className="flex flex-col items-center gap-2 relative z-10">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className={`
                        w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all
                        ${isActive ? "bg-gold/20 border-gold text-gold shadow-lg shadow-gold/30" : ""}
                        ${isCompleted ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-500" : ""}
                        ${!isActive && !isCompleted ? "bg-surface-1 border-border text-ink-3" : ""}
                      `}
                    >
                      {isCompleted ? <CheckCircle size={20} strokeWidth={2} /> : <Icon size={20} strokeWidth={2} />}
                    </motion.div>
                    <span className={`
                      text-[10px] font-bold uppercase tracking-wider text-center
                      ${isActive ? "text-gold" : ""}
                      ${isCompleted ? "text-emerald-500" : ""}
                      ${!isActive && !isCompleted ? "text-ink-3" : ""}
                    `}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </motion.div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Client & Vehicle Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Client Card */}
              <div className="bg-surface-1 p-6 rounded-xl border-2 border-border hover:border-gold/40 transition-all">
                <p className="text-xs font-bold uppercase tracking-widest text-ink-3 mb-3">Client</p>
                <p className="text-xl font-bold text-ink-1 leading-tight mb-4">{reservation.client?.name || "N/A"}</p>
                <div className="flex gap-3">
                  {reservation.client?.cin_image_url && (
                    <a href={`${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1").replace("/api/v1", "")}${reservation.client.cin_image_url}`} target="_blank" 
                       className="text-xs font-bold text-gold bg-gold/10 px-4 py-2 rounded-lg hover:bg-gold/20 transition-colors">
                      CIN
                    </a>
                  )}
                  {reservation.client?.license_image_url && (
                    <a href={`${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1").replace("/api/v1", "")}${reservation.client.license_image_url}`} target="_blank" 
                       className="text-xs font-bold text-gold bg-gold/10 px-4 py-2 rounded-lg hover:bg-gold/20 transition-colors">
                      Permis
                    </a>
                  )}
                </div>
              </div>

              {/* Vehicle Card */}
              <div className="bg-surface-1 p-6 rounded-xl border-2 border-border hover:border-gold/40 transition-all">
                <p className="text-xs font-bold uppercase tracking-widest text-ink-3 mb-3">Véhicule</p>
                <p className="text-xl font-bold text-ink-1 leading-tight mb-1">{reservation.vehicle?.brand}</p>
                <p className="text-sm font-semibold text-ink-2">{reservation.vehicle?.model} • {reservation.vehicle?.plate}</p>
              </div>
            </motion.div>

            {/* Price & Period */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-gradient-to-br from-gold/30 to-gold/10 border-2 border-gold/40 p-6 rounded-xl flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-ink-3 mb-2">Montant Total</p>
                <p className="text-3xl font-bold text-gold">{reservation.total_price.toLocaleString('fr-FR')} DH</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-widest text-ink-3 mb-2">Période</p>
                <p className="text-sm font-bold text-ink-1">{formatDate(reservation.start_date)}</p>
                <p className="text-sm font-bold text-ink-1">au {formatDate(reservation.end_date)}</p>
              </div>
            </motion.div>

            {/* Contract Section */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h4 className="text-sm font-bold text-ink-1 uppercase tracking-widest mb-4">Contrat & Documents</h4>
              {reservation.contract ? (
                <div className="flex items-center justify-between p-6 bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 rounded-xl border-2 border-emerald-400/40">
                  <div className="flex items-center gap-3">
                    <FileText className="text-emerald-500" size={20} strokeWidth={2} />
                    <div>
                      <p className="font-bold text-ink-1">Contrat de Location</p>
                      <p className="text-xs font-bold uppercase tracking-wider text-emerald-500">Généré et Signé</p>
                    </div>
                  </div>
                  <motion.a 
                    whileHover={{ scale: 1.05 }}
                    href={`${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1").replace("/api/v1", "")}/storage/${reservation.contract.file_path}`} 
                    target="_blank" 
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-500/90 text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:shadow-lg hover:shadow-emerald-500/40 transition-all"
                  >
                    <Download size={14} strokeWidth={2} /> Voir
                  </motion.a>
                </div>
              ) : (
                <div className="flex items-center justify-between p-6 bg-gradient-to-br from-amber-500/20 to-amber-500/10 rounded-xl border-2 border-amber-400/40">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="text-amber-500" size={20} strokeWidth={2} />
                    <div>
                      <p className="font-bold text-ink-1">Contrat Manquant</p>
                      <p className="text-xs font-bold uppercase tracking-wider text-amber-500">Action Requise</p>
                    </div>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onGenerateContract(reservation.id)}
                    disabled={actionLoading === reservation.id}
                    className="flex items-center gap-2 bg-gradient-to-r from-gold to-gold/90 text-ink-1 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:shadow-lg hover:shadow-gold/40 transition-all disabled:opacity-60"
                  >
                    {actionLoading === reservation.id ? <RefreshCw size={16} className="animate-spin" /> : <FileText size={16} />}
                    Générer PDF
                  </motion.button>
                </div>
              )}
            </motion.div>

            {/* Conciergerie Section */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <h4 className="text-sm font-bold text-ink-1 uppercase tracking-widest mb-4">Conciergerie Automatisée</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.a 
                  whileHover={{ scale: 1.03, y: -2 }}
                  href={reservation.client?.phone ? `https://wa.me/${reservation.client.phone}?text=Bonjour ${encodeURIComponent(reservation.client.name)}, concernant votre réservation VC-${reservation.id.toString().padStart(4, "0")} pour le ${reservation.vehicle?.brand}...` : "#"}
                  target="_blank"
                  className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 rounded-xl border-2 border-emerald-400/40 hover:shadow-lg hover:shadow-emerald-500/30 transition-all group"
                >
                  <MessageCircle size={28} className="text-emerald-500 mb-3 group-hover:scale-110 transition-transform" strokeWidth={2} />
                  <span className="text-sm font-bold text-emerald-600">Message WhatsApp</span>
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.03, y: -2 }}
                  href={reservation.client?.email ? `mailto:${reservation.client.email}?subject=Votre réservation Vectoria - Réf: VC-${reservation.id.toString().padStart(4, "0")}&body=Bonjour ${encodeURIComponent(reservation.client.name)},%0D%0A%0D%0AMerci pour votre réservation...` : "#"}
                  className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-xl border-2 border-blue-400/40 hover:shadow-lg hover:shadow-blue-500/30 transition-all group"
                >
                  <Mail size={28} className="text-blue-500 mb-3 group-hover:scale-110 transition-transform" strokeWidth={2} />
                  <span className="text-sm font-bold text-blue-500">Envoyer Email</span>
                </motion.a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}