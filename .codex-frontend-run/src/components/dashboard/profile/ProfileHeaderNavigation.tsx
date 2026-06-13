"use client";

import { ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProfileHeaderNavigation() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-16"
    >
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-ink-2 hover:text-gold transition-all font-bold text-xs uppercase tracking-wider mb-6 group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Retour au Salon VIP
      </Link>

      <div className="flex items-end gap-6">
        {/* Avatar */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="w-20 h-20 rounded-xl bg-gradient-to-br from-gold/30 to-gold/10 border-2 border-gold/40 flex items-center justify-center shadow-lg shadow-gold/20"
        >
          <User size={32} className="text-gold" />
        </motion.div>

        {/* Title */}
        <div>
          <p className="section-eyebrow mb-2">Paramètres de Sécurité</p>
          <h1 className="text-4xl md:text-5xl font-bold text-ink-1 tracking-tight font-serif">Votre Profil Élite</h1>
        </div>
      </div>
    </motion.div>
  );
}
