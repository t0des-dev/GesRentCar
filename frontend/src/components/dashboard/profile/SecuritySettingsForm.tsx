"use client";

import { Shield, Lock, KeyRound, Loader2 } from "lucide-react";

interface SecuritySettingsFormProps {
  data: any;
  setData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export default function SecuritySettingsForm({ data, setData, onSubmit, loading }: SecuritySettingsFormProps) {
  return (
    <section className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 md:p-10 shadow-2xl h-full border-t-primary/20">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
          <Shield size={20} />
        </div>
        <h3 className="text-xl font-black text-white tracking-tight">Sécurité</h3>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-4">Ancien mot de passe</label>
          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
            <input 
              type="password" 
              value={data.current_password}
              onChange={(e) => setData({...data, current_password: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-primary/50 transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-4">Nouveau mot de passe</label>
          <div className="relative">
            <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
            <input 
              type="password" 
              value={data.password}
              onChange={(e) => setData({...data, password: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-primary/50 transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-4">Confirmation</label>
          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
            <input 
              type="password" 
              value={data.password_confirmation}
              onChange={(e) => setData({...data, password_confirmation: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-primary/50 transition-all"
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-white text-black font-black text-[10px] uppercase tracking-widest py-5 rounded-2xl shadow-xl hover:bg-slate-200 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
          Changer le mot de passe
        </button>
      </form>
    </section>
  );
}
