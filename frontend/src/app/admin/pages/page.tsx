"use client";

import { useAuthGuard } from "@/modules/auth/hooks/useAuthGuard";
import PageManager from "@/modules/admin/components/pages/PageManager";
import AdminPageHeader from "@/modules/admin/components/AdminPageHeader";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminPagesPage() {
  const { checking } = useAuthGuard("admin");

  if (checking) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Chargement...</p>
    </div>
  );

  return (
    <>
      <AdminPageHeader icon={FileText} title="Pages CMS" subtitle="Créez et gérez vos pages marketing et landing pages." />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <PageManager />
      </motion.div>
    </>
  );
}
