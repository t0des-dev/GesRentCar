"use client";

import { useAuthGuard } from "@/modules/auth/hooks/useAuthGuard";
import UserManager from "@/modules/admin/components/UserManager";
import AdminPageHeader from "@/modules/admin/components/AdminPageHeader";
import { Users } from "lucide-react";
import { motion } from "framer-motion";

export default function UsersPage() {
  const { user, checking } = useAuthGuard("admin");

  if (checking) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Chargement de l'équipe...</p>
    </div>
  );

  return (
    <>
      <AdminPageHeader icon={Users} title="Utilisateurs" subtitle="Gérez les accès et les rôles de votre équipe administrative." />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <UserManager />
      </motion.div>
    </>
  );
}
