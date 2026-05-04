"use client";

import { X, Calendar, FileText, CheckCircle, CreditCard, ShieldCheck, Download, AlertTriangle, MessageCircle, Mail } from "lucide-react";
import styles from "@/app/admin/page.module.css";
import { Reservation } from "@/types/admin";

interface ReservationDrawerProps {
  reservation: Reservation;
  onClose: () => void;
  onGenerateContract: (id: number) => void;
  actionLoading: number | null;
}

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
        return 0; // or maybe a rejected state
    }
  };

  const currentStep = getCurrentStepIndex();

  return (
    <div className={styles.drawerOverlay} onClick={onClose}>
      <div className={styles.drawerContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.drawerClose} onClick={onClose}>
          <X size={20} />
        </button>

        <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
          Détails de Réservation
        </h3>
        <p className="text-primary font-bold uppercase tracking-widest text-sm mb-8">
          REF: VC-{reservation.id.toString().padStart(4, "0")}
        </p>

        {/* Timeline */}
        <div className={styles.timeline}>
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentStep;
            const isActive = idx === currentStep;
            return (
              <div 
                key={step.id} 
                className={`${styles.timelineStep} ${isActive ? styles.activeStep : ''} ${isCompleted ? styles.completedStep : ''}`}
              >
                <div className={styles.stepDot}>
                  {isCompleted ? <CheckCircle size={14} /> : <Icon size={14} />}
                </div>
                <span className={styles.stepLabel}>{step.label}</span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Client</p>
            <p className="text-lg font-black text-slate-900 leading-tight mb-2">{reservation.client?.name || "N/A"}</p>
            {/* Quick Document Links */}
            <div className="flex gap-3 mt-4">
              {reservation.client?.cin_image_url && (
                <a href={`http://localhost:8000${reservation.client.cin_image_url}`} target="_blank" className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors">
                   CIN
                </a>
              )}
              {reservation.client?.license_image_url && (
                <a href={`http://localhost:8000${reservation.client.license_image_url}`} target="_blank" className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors">
                   Permis
                </a>
              )}
            </div>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Véhicule</p>
            <p className="text-lg font-black text-slate-900 leading-tight mb-1">{reservation.vehicle?.brand}</p>
            <p className="text-sm font-bold text-slate-500">{reservation.vehicle?.model} • {reservation.vehicle?.plate}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-3xl mb-8 flex items-center justify-between shadow-sm">
           <div>
             <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Montant Total</p>
             <p className="text-3xl font-black text-slate-900">{reservation.total_price.toLocaleString('fr-FR')} DH</p>
           </div>
           <div className="text-right">
             <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Période</p>
             <p className="text-sm font-bold text-slate-700">{reservation.start_date}</p>
             <p className="text-sm font-bold text-slate-700">au {reservation.end_date}</p>
           </div>
        </div>

        {/* Contract Section */}
        <div className="mb-8">
           <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Contrat & Documents</h4>
           {reservation.contract ? (
             <div className="flex items-center justify-between p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
               <div className="flex items-center gap-3">
                 <FileText className="text-emerald-600" size={20} />
                 <div>
                   <p className="font-bold text-emerald-900 text-sm">Contrat de Location</p>
                   <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Généré et Signé</p>
                 </div>
               </div>
               <a 
                 href={`http://localhost:8000/storage/${reservation.contract.file_path}`} 
                 target="_blank" 
                 className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors"
               >
                 <Download size={14} /> Voir
               </a>
             </div>
           ) : (
             <div className="flex items-center justify-between p-5 bg-amber-50 rounded-2xl border border-amber-100">
               <div className="flex items-center gap-3">
                 <AlertTriangle className="text-amber-600" size={20} />
                 <div>
                   <p className="font-bold text-amber-900 text-sm">Contrat Manquant</p>
                   <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest">Action Requise</p>
                 </div>
               </div>
               <button 
                 onClick={() => onGenerateContract(reservation.id)}
                 disabled={actionLoading === reservation.id}
                 className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary transition-colors disabled:opacity-50"
               >
                 Générer PDF
               </button>
             </div>
           )}
        </div>

        {/* Automated Concierge Section */}
        <div className="mb-8">
           <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Conciergerie Automatisée</h4>
           <div className="grid grid-cols-2 gap-4">
             <a 
               href={reservation.client?.phone ? `https://wa.me/${reservation.client.phone}?text=Bonjour ${encodeURIComponent(reservation.client.name)}, concernant votre réservation VC-${reservation.id.toString().padStart(4, "0")} pour le ${reservation.vehicle?.brand}...` : "#"}
               target="_blank"
               className="flex flex-col items-center justify-center p-6 bg-green-50 rounded-2xl border border-green-100 hover:bg-green-100 transition-colors group"
             >
               <MessageCircle size={24} className="text-green-600 mb-2 group-hover:scale-110 transition-transform" />
               <span className="text-xs font-bold text-green-900">Message WhatsApp</span>
             </a>
             <a 
               href={reservation.client?.email ? `mailto:${reservation.client.email}?subject=Votre réservation Vectoria - Réf: VC-${reservation.id.toString().padStart(4, "0")}&body=Bonjour ${encodeURIComponent(reservation.client.name)},%0D%0A%0D%0AMerci pour votre réservation...` : "#"}
               className="flex flex-col items-center justify-center p-6 bg-blue-50 rounded-2xl border border-blue-100 hover:bg-blue-100 transition-colors group"
             >
               <Mail size={24} className="text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
               <span className="text-xs font-bold text-blue-900">Envoyer Email</span>
             </a>
           </div>
        </div>
      </div>
    </div>
  );
}
