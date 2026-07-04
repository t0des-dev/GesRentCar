"use client";

import { motion } from "framer-motion";
import { Type, FileText, ExternalLink, Plus } from "lucide-react";
import type { StorefrontForm } from "@/types/storefront";
import { useEffect, useState } from "react";
import { pageService } from "@/lib/api/pages";
import type { Page } from "@/types/page";

interface MultilingualSettingsProps {
  form: StorefrontForm;
  setForm: (v: StorefrontForm) => void;
}

export default function MultilingualSettings({ form, setForm }: MultilingualSettingsProps) {
  const [pages, setPages] = useState<Page[]>([]);

  useEffect(() => {
    pageService.getPages().then(setPages).catch(() => {});
  }, []);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      {/* About Us multilingual */}
      <div className="bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm space-y-8">
        <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-900 flex items-center justify-center"><Type size={20} /></div><h3 className="text-xl font-black text-slate-900">À propos de nous</h3></div>
        <div className="space-y-6">
          <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400">Français</label><textarea rows={3} value={form.about_text_fr ?? ""} onChange={e => setForm({...form, about_text_fr: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none" /></div>
          <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400">English</label><textarea rows={3} value={form.about_text_en ?? ""} onChange={e => setForm({...form, about_text_en: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none" /></div>
          <div className="space-y-2 text-right"><label className="text-[10px] font-black uppercase text-slate-400">العربية</label><textarea rows={3} dir="rtl" value={form.about_text_ar ?? ""} onChange={e => setForm({...form, about_text_ar: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none" /></div>
        </div>
      </div>

      {/* Page management */}
      <div className="bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-900 flex items-center justify-center"><FileText size={20} /></div>
            <h3 className="text-xl font-black text-slate-900">Pages</h3>
          </div>
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL || "/api"}/../filament-admin/pages`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors"
          >
            <Plus size={14} /> Gérer les pages <ExternalLink size={12} />
          </a>
        </div>
        <div className="space-y-2">
          {pages.length === 0 ? (
            <p className="text-sm text-slate-400 italic">Aucune page publiée</p>
          ) : (
            pages.map((page) => (
              <div key={page.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="font-semibold text-slate-900">{page.title}</p>
                  <p className="text-xs text-slate-400">/{page.slug}</p>
                </div>
                <a
                  href={`/${page.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors"
                >
                  Voir <ExternalLink size={12} className="inline" />
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
