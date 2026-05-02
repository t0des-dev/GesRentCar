"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import StorefrontManager from "@/components/StorefrontManager";
import { ChevronLeft, Palette } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function StorefrontPage() {
  const { user, checking } = useAuthGuard("admin");

  if (checking) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Initialisation de l'atelier design...</p>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center gap-2 mb-4">
          <Link href="/admin" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1 text-xs font-black uppercase tracking-widest">
             <ChevronLeft size={14} /> Dashboard
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-primary">
            <Palette size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Storefront</h1>
            <p className="text-slate-500 font-medium italic mt-1">Gérez l'identité visuelle et le contenu de votre plateforme publique.</p>
          </div>
        </div>
      </motion.header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <StorefrontManager />
      </motion.div>
    </div>
  );
}
