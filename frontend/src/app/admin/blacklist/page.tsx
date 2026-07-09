"use client";

import { useAuthGuard } from "@/modules/auth/hooks/useAuthGuard";
import ClientBlacklistManager from "@/components/ClientBlacklistManager";
import AdminPageHeader from "@/modules/admin/components/AdminPageHeader";
import { Ban } from "lucide-react";
import { motion } from "framer-motion";

export default function BlacklistPage() {
  const { user, checking } = useAuthGuard("admin");

  if (checking) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Vérification de la session...</p>
    </div>
  );

  return (
    <>
      <AdminPageHeader
        icon={Ban}
        title="Liste Noire Clients"
        subtitle="Gérez les clients interdits de réservation."
        backLabel="Retour Dashboard"
      />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <ClientBlacklistManager />
      </motion.div>
    </>
  );
}
