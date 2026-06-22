"use client";

import { Shield, Lock, KeyRound, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface SecurityData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

interface SecuritySettingsFormProps {
  data: SecurityData;
  setData: (data: SecurityData) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export default function SecuritySettingsForm({ data, setData, onSubmit, loading }: SecuritySettingsFormProps) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="bg-white rounded-2xl border-2 border-border shadow-lg p-8 card-premium"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <motion.div 
          whileHover={{ scale: 1.1 }}
          className="w-12 h-12 rounded-lg bg-emerald-500/20 border-2 border-emerald-400/40 flex items-center justify-center text-emerald-400"
        >
          <Shield size={20} strokeWidth={2} />
        </motion.div>
        <h3 className="text-2xl font-bold text-ink-1 tracking-tight font-serif">Sécurité</h3>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Current Password */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <label className="text-xs font-bold uppercase tracking-widest text-ink-3 ml-1">Ancien Mot de Passe</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" size={18} />
            <input
              type="password"
              value={data.current_password}
              onChange={(e) => setData({...data, current_password: e.target.value})}
              className="input-premium w-full pl-12 pr-5 py-3.5"
              required
            />
          </div>
        </motion.div>

        {/* New Password */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="space-y-2"
        >
          <label className="text-xs font-bold uppercase tracking-widest text-ink-3 ml-1">Nouveau Mot de Passe</label>
          <div className="relative">
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" size={18} />
            <input
              type="password"
              value={data.password}
              onChange={(e) => setData({...data, password: e.target.value})}
              className="input-premium w-full pl-12 pr-5 py-3.5"
              required
            />
          </div>
        </motion.div>

        {/* Confirm Password */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-2"
        >
          <label className="text-xs font-bold uppercase tracking-widest text-ink-3 ml-1">Confirmation</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" size={18} />
            <input
              type="password"
              value={data.password_confirmation}
              onChange={(e) => setData({...data, password_confirmation: e.target.value})}
              className="input-premium w-full pl-12 pr-5 py-3.5"
              required
            />
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-500/90 text-white px-8 py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider flex justify-center items-center gap-2 hover:shadow-lg hover:shadow-emerald-500/40 transition-all disabled:opacity-60"
        >
          {loading ? <Loader2 size={18} className="animate-spin" strokeWidth={2} /> : <Lock size={18} strokeWidth={2} />}
          Changer le mot de passe
        </motion.button>
      </form>
    </motion.section>
  );
}
