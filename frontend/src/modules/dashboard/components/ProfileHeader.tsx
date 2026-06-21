"use client";

import { Crown, User, Shield, LogOut, Settings, CreditCard } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/modules/auth/context/context";
import { motion } from "framer-motion";

interface ProfileHeaderProps {
  session: any;
}

export default function ProfileHeader({ session }: ProfileHeaderProps) {
  const { logout } = useAuth();
  
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col md:flex-row items-center justify-between mb-16 p-8 bg-gradient-to-br from-surface-1 to-surface-2 border border-border/80 rounded-2xl shadow-lg shadow-gold/5 dark:shadow-gold/2"
    >
      <div className="flex flex-col md:flex-row items-center gap-8 flex-1">
        
        {/* Avatar */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 p-1">
            <div className="w-full h-full rounded-full bg-surface-0 flex items-center justify-center overflow-hidden border-3 border-gold/40 shadow-lg shadow-gold/20">
              <User size={40} className="text-gold" />
            </div>
          </div>
          {/* Status Badge */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full border-3 border-surface-0 flex items-center justify-center shadow-lg shadow-emerald-500/40"
          >
            <div className="w-2 h-2 bg-white rounded-full" />
          </motion.div>
        </motion.div>

        {/* User Info */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center md:text-left space-y-2"
        >
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <div className="flex items-center gap-2">
              <Crown size={16} className="text-gold" />
              <p className="text-gold font-bold text-xs uppercase tracking-widest">Membre Élite Vectoria</p>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-ink-1 tracking-tight font-serif">
            {session?.user?.name || "L'Excellence"}
          </h1>
          <p className="text-ink-3 text-sm font-medium">Votre voyage sur mesure continue ici.</p>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="flex flex-col sm:flex-row items-center gap-3 mt-8 md:mt-0"
      >
        <Link
          href="/dashboard/profile"
          className="flex items-center justify-center gap-2 px-5 py-3 bg-surface-1 border-2 border-border rounded-lg text-xs font-bold uppercase tracking-wider text-ink-2 hover:border-gold hover:bg-gold/5 hover:text-gold transition-all group"
        >
          <Settings size={16} className="group-hover:rotate-90 transition-transform" />
          Profil
        </Link>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => logout()}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-red-500/20 border-2 border-red-400/30 rounded-lg text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/30 hover:border-red-400/60 transition-all group"
        >
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
          Déconnexion
        </motion.button>
      </motion.div>
    </motion.header>
  );
}
