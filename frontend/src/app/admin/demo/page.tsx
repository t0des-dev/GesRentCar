"use client";

import { useAuthGuard } from "@/modules/auth/hooks/useAuthGuard";
import DemoDataManager from "@/modules/admin/components/DemoDataManager";
import AdminPageHeader from "@/modules/admin/components/AdminPageHeader";
import { FlaskConical } from "lucide-react";
import { motion } from "framer-motion";

export default function DemoPage() {
  const { checking } = useAuthGuard("admin");

  if (checking) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Vérification des accès...</p>
    </div>
  );

  return (
    <>
      <AdminPageHeader
        icon={FlaskConical}
        title="Données de Démo"
        subtitle="Initialisez ou réinitialisez votre flotte avec des données de démonstration réalistes."
        backLabel="Retour Dashboard"
      />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <DemoDataManager />
      </motion.div>
    </>
  );
}
