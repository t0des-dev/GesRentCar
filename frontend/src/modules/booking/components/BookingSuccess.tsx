"use client";

import { CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function BookingSuccess() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }}
      className="text-center p-10 flex flex-col items-center"
    >
      <div className="w-24 h-24 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-8 shadow-inner">
        <CheckCircle2 size={48} strokeWidth={2.5} />
      </div>
      <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Réservation Envoyée !</h3>
      <p className="text-slate-500 font-medium italic mb-10 max-w-xs mx-auto leading-relaxed">
        Votre demande est en cours de traitement. Notre équipe vous contactera par SMS dans les plus brefs délais pour confirmer les détails.
      </p>
      <Link href="/" className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
        Retour à l&apos;accueil <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  );
}
