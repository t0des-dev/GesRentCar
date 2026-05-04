"use client";

import { User, Mail, Save, Loader2 } from "lucide-react";

interface PersonalInfoFormProps {
  data: { name: string; email: string };
  setData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export default function PersonalInfoForm({ data, setData, onSubmit, loading }: PersonalInfoFormProps) {
  return (
    <section className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 md:p-10 shadow-2xl h-full">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <User size={20} />
        </div>
        <h3 className="text-xl font-black text-white tracking-tight">Identité Visuelle</h3>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-4">Nom complet</label>
          <div className="relative">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
            <input 
              type="text" 
              value={data.name}
              onChange={(e) => setData({...data, name: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
              placeholder="Votre nom"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-4">Adresse Email</label>
          <div className="relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
            <input 
              type="email" 
              value={data.email}
              onChange={(e) => setData({...data, email: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
              placeholder="votre@email.com"
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-primary text-white font-black text-[10px] uppercase tracking-widest py-5 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Mettre à jour le profil
        </button>
      </form>
    </section>
  );
}
