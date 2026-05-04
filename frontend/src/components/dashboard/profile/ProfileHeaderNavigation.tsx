"use client";

import { ArrowLeft, User } from "lucide-react";
import Link from "next/link";

export default function ProfileHeaderNavigation() {
  return (
    <div className="mb-12">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-black text-[10px] uppercase tracking-[0.2em] mb-6">
        <ArrowLeft size={14} /> Retour au Salon VIP
      </Link>
      <div className="flex items-end gap-6">
        <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <User size={32} className="text-primary" />
        </div>
        <div>
          <p className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-2">Paramètres de sécurité</p>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Votre Profil Élite</h1>
        </div>
      </div>
    </div>
  );
}
