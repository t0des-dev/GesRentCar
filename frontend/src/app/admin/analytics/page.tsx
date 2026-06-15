"use client";

import { useAuthGuard } from "@/modules/auth/hooks/useAuthGuard";
import AnalyticsDashboard from "@/modules/admin/components/AnalyticsDashboard";
import AdminPageHeader from "@/modules/admin/components/AdminPageHeader";
import { BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
  const { user, checking } = useAuthGuard("admin");

  if (checking) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Analyse des flux de données...</p>
    </div>
  );

  return (
    <>
      <AdminPageHeader icon={BarChart3} title="Analytiques" subtitle="Surveillez la santé financière et opérationnelle de votre parc automobile." />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <AnalyticsDashboard />
      </motion.div>
    </>
  );
}
