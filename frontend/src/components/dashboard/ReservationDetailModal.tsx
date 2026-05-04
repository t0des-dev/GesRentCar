"use client";

import { motion } from "framer-motion";
import { XCircle, Car, ArrowRight } from "lucide-react";

interface ReservationDetailModalProps {
  reservation: any;
  onClose: () => void;
}

export default function ReservationDetailModal({ reservation, onClose }: ReservationDetailModalProps) {
  if (!reservation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} 
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-slate-900/50 border border-white/10 rounded-[48px] w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl flex flex-col"
      >
        <button onClick={onClose} className="absolute top-8 right-8 z-20 w-12 h-12 bg-white/5 hover:bg-white/10 text-white rounded-full flex items-center justify-center transition-all">
          <XCircle size={24} />
        </button>
        <div className="h-64 relative overflow-hidden">
          {reservation.img ? (
            <img src={reservation.img} alt={reservation.vehicle} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-800"><Car size={80} className="opacity-10"/></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-10">
            <div>
              <span className="bg-primary/20 text-primary px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-3 inline-block">Référence : #{reservation.id}00X</span>
              <h2 className="text-4xl font-black text-white tracking-tighter">{reservation.vehicle}</h2>
            </div>
          </div>
        </div>
        <div className="p-10 space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
              <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-2">Itinéraire Temporel</p>
              <p className="font-bold text-base text-white">{reservation.startDate} <ArrowRight size={14} className="inline mx-2 text-primary" /> {reservation.endDate}</p>
            </div>
            <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-right">
              <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-2">Investissement</p>
              <p className="font-black text-2xl text-white">{reservation.totalPrice.toLocaleString()} DH</p>
              <p className="text-[10px] text-emerald-400 font-bold mt-1 uppercase tracking-widest">Transaction Sécurisée</p>
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
            <button onClick={onClose} className="px-10 py-4 rounded-2xl bg-white/5 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Retour</button>
            {reservation.hasContract && (
              <button className="px-10 py-4 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">Télécharger l'Acte</button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
