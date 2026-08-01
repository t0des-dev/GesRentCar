"use client";

import { useAuthGuard } from "@/modules/auth/hooks/useAuthGuard";
import FleetCmsEditor from "@/modules/admin/components/fleet/FleetCmsEditor";
import AdminPageHeader from "@/modules/admin/components/AdminPageHeader";
import { Car } from "lucide-react";

export default function FleetCmsPage() {
  const { checking } = useAuthGuard("admin");

  if (checking) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Chargement...</p>
    </div>
  );

  return (
    <>
      <AdminPageHeader icon={Car} title="Page Fleet" subtitle="Configurez le contenu de la page flotte : hero, filtres, emplacements et更多." />
      <FleetCmsEditor />
    </>
  );
}
