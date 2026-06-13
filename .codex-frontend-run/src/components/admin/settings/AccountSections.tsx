"use client";

import { motion } from "framer-motion";
import { Save, Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProfileSettings({ form, setForm, onSubmit, loading }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-premium p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-serif text-ink-1 mb-2">Informations Personnelles</h2>
        <p className="text-ink-2 text-sm font-bold italic">Gérez votre identité sur la plateforme Vectoria.</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-ink-3 ml-1">Nom complet</label>
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-premium" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-ink-3 ml-1">Adresse Email</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-premium" />
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="bg-gradient-to-r from-gold to-gold/90 text-ink-1 px-10 py-4 rounded-2xl font-bold uppercase text-xs tracking-wider shadow-lg shadow-gold/20 flex items-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Enregistrer
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

export function SecuritySettings({ form, setForm, onSubmit, loading }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-premium p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-serif text-ink-1 mb-2">Sécurité du Compte</h2>
        <p className="text-ink-2 text-sm font-bold italic">Nous vous recommandons de changer votre mot de passe régulièrement.</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-ink-3 ml-1">Mot de passe actuel</label>
          <input type="password" required value={form.current_password} onChange={e => setForm({...form, current_password: e.target.value})} className="input-premium" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-ink-3 ml-1">Nouveau mot de passe</label>
            <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="input-premium" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-ink-3 ml-1">Confirmer</label>
            <input type="password" required value={form.password_confirmation} onChange={e => setForm({...form, password_confirmation: e.target.value})} className="input-premium" />
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="bg-gradient-to-r from-gold to-gold/90 text-ink-1 px-10 py-4 rounded-2xl font-bold uppercase text-xs tracking-wider shadow-lg shadow-gold/20 flex items-center gap-3"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />} Mettre à jour
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
