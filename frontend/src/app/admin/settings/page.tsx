"use client";

import { useAuthGuard } from "@/modules/auth/hooks/useAuthGuard";
import AdminSettings from "@/modules/admin/components/AdminSettings";
import AdminPageHeader from "@/modules/admin/components/AdminPageHeader";
import { ShieldCheck } from "lucide-react";
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
    <>
      <AdminPageHeader
        icon={ShieldCheck}
        title="Paramètres Système"
        subtitle="Configurez votre instance ERP Vectoria et gérez vos accès."
        backLabel="Retour Dashboard"
      >
        <div className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Système Opérationnel</span>
        </div>
      </AdminPageHeader>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <AdminSettings />
      </motion.div>
    </>
  );
}
