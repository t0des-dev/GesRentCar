"use client";

import { motion } from "framer-motion";
import { User as UserIcon, Save, Loader2, Shield, Lock } from "lucide-react";

export function ProfileSettings({ form, setForm, onSubmit, loading }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Informations Personnelles</h2>
        <p className="text-slate-500 text-sm font-medium italic">Gérez votre identité sur la plateforme Vectoria.</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Nom complet</label>
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:bg-white focus:border-primary transition-all font-bold outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Adresse Email</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:bg-white focus:border-primary transition-all font-bold outline-none" />
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <button disabled={loading} className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-3 disabled:opacity-50">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Enregistrer
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export function SecuritySettings({ form, setForm, onSubmit, loading }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Sécurité du Compte</h2>
        <p className="text-slate-500 text-sm font-medium italic">Nous vous recommandons de changer votre mot de passe régulièrement.</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Mot de passe actuel</label>
          <input type="password" required value={form.current_password} onChange={e => setForm({...form, current_password: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:bg-white focus:border-primary transition-all font-bold outline-none" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Nouveau mot de passe</label>
            <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:bg-white focus:border-primary transition-all font-bold outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Confirmer</label>
            <input type="password" required value={form.password_confirmation} onChange={e => setForm({...form, password_confirmation: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:bg-white focus:border-primary transition-all font-bold outline-none" />
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <button disabled={loading} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all flex items-center gap-3">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />} Mettre à jour
          </button>
        </div>
      </form>
    </motion.div>
  );
}
