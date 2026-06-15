"use client";

import { motion } from "framer-motion";
import { Type } from "lucide-react";
import type { StorefrontForm } from "@/types/storefront";

interface MultilingualSettingsProps {
  form: StorefrontForm;
  setForm: (v: StorefrontForm) => void;
}

export default function MultilingualSettings({ form, setForm }: MultilingualSettingsProps) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      <div className="bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm space-y-8">
        <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-900 flex items-center justify-center"><Type size={20} /></div><h3 className="text-xl font-black text-slate-900">À propos de nous</h3></div>
        <div className="space-y-6">
          <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400">Français</label><textarea rows={3} value={form.about_text_fr ?? ""} onChange={e => setForm({...form, about_text_fr: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none" /></div>
          <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400">English</label><textarea rows={3} value={form.about_text_en ?? ""} onChange={e => setForm({...form, about_text_en: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none" /></div>
          <div className="space-y-2 text-right"><label className="text-[10px] font-black uppercase text-slate-400">العربية</label><textarea rows={3} dir="rtl" value={form.about_text_ar ?? ""} onChange={e => setForm({...form, about_text_ar: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none" /></div>
        </div>
      </div>
    </motion.div>
  );
}
