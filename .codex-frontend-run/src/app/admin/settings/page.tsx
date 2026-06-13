"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import AdminSettings from "@/components/AdminSettings";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { user, checking } = useAuthGuard("admin");

  if (checking) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Initialisation sécurisée...</p>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Link href="/admin" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1 text-xs font-black uppercase tracking-widest">
               <ChevronLeft size={14} /> Retour Dashboard
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-primary">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Paramètres Système</h1>
              <p className="text-slate-500 font-medium italic mt-1">Configurez votre instance ERP Vectoria et gérez vos accès.</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Système Opérationnel</span>
        </div>
      </motion.header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <AdminSettings />
      </motion.div>
    </div>
  );
}
