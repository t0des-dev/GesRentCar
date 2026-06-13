"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import StorefrontManager from "@/components/StorefrontManager";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Palette } from "lucide-react";

export default function StorefrontPage() {
  const { user, checking } = useAuthGuard("admin");

  if (checking) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Initialisation de l'atelier design...</p>
    </div>
  );

  return (
    <>
      <AdminPageHeader icon={Palette} title="Storefront" subtitle="Gérez l'identité visuelle et le contenu de votre plateforme publique." />
      <StorefrontManager />
    </>
  );
}
