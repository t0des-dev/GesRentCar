"use client";

import { User, Mail, Save, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface PersonalInfoFormProps {
  data: { name: string; email: string };
  setData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export default function PersonalInfoForm({ data, setData, onSubmit, loading }: PersonalInfoFormProps) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.6 }}
      className="bg-white rounded-2xl border-2 border-border shadow-lg p-8 card-premium"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <motion.div 
          whileHover={{ scale: 1.1 }}
          className="w-12 h-12 rounded-lg bg-gold/20 border-2 border-gold/40 flex items-center justify-center text-gold"
        >
          <User size={20} strokeWidth={2} />
        </motion.div>
        <h3 className="text-2xl font-bold text-ink-1 tracking-tight font-serif">Identité</h3>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Name Field */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <label className="text-xs font-bold uppercase tracking-widest text-ink-3 ml-1">Nom Complet</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" size={18} />
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData({...data, name: e.target.value})}
              className="input-premium w-full pl-12 pr-5 py-3.5"
              placeholder="Votre nom"
              required
            />
          </div>
        </motion.div>

        {/* Email Field */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <label className="text-xs font-bold uppercase tracking-widest text-ink-3 ml-1">Adresse Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" size={18} />
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData({...data, email: e.target.value})}
              className="input-premium w-full pl-12 pr-5 py-3.5"
              placeholder="votre@email.com"
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
          className="w-full bg-gradient-to-r from-gold to-gold/90 text-ink-1 px-8 py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider flex justify-center items-center gap-2 hover:shadow-lg hover:shadow-gold/40 transition-all disabled:opacity-60"
        >
          {loading ? <Loader2 size={18} className="animate-spin" strokeWidth={2} /> : <Save size={18} strokeWidth={2} />}
          Mettre à jour le profil
        </motion.button>
      </form>
    </motion.section>
  );
}
