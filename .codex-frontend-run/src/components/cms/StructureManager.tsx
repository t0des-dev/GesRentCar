"use client";

import { motion } from "framer-motion";
import { Layers, Settings, Bot, Quote, ChevronRight } from "lucide-react";
import SectionReorder from "./SectionReorder";
import type { StorefrontForm } from "@/types/storefront";

interface StructureManagerProps {
  form: StorefrontForm;
  setForm: (v: StorefrontForm) => void;
  onNavigate?: (tab: string) => void;
}

export default function StructureManager({ form, setForm, onNavigate }: StructureManagerProps) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      <div className="bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm space-y-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-950 text-white flex items-center justify-center shadow-lg"><Layers size={24} /></div>
          <div><h3 className="text-2xl font-black text-slate-900 tracking-tight">Structure de l'Accueil</h3></div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          <div className="xl:col-span-4">
             <div className="p-6 bg-slate-50 border border-slate-100 rounded-[32px] space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2"><Settings size={14} className="text-primary" /> Configuration Flux</h4>
                <SectionReorder sections={form.sections_order} onChange={(s) => setForm({ ...form, sections_order: s })} />
             </div>
          </div>

          <div className="xl:col-span-8 space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div onClick={() => onNavigate?.("multilingual")} className="p-8 rounded-[32px] bg-indigo-50/30 border border-indigo-100/50 group hover:bg-indigo-50 transition-all cursor-pointer">
                   <div className="flex items-center gap-4 mb-4"><div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-600"><Bot size={20} /></div><span className="text-sm font-black text-slate-900">Intelligence & FAQ</span></div>
                   <p className="text-[11px] text-slate-500 font-medium">Gérez les questions fréquentes et la bannière Concierge IA.</p>
                   <div className="flex justify-end"><ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" /></div>
                </div>
                <div onClick={() => onNavigate?.("seo")} className="p-8 rounded-[32px] bg-emerald-50/30 border border-emerald-100/50 group hover:bg-emerald-50 transition-all cursor-pointer">
                   <div className="flex items-center gap-4 mb-4"><div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-600"><Quote size={20} /></div><span className="text-sm font-black text-slate-900">Social & Témoignages</span></div>
                   <p className="text-[11px] text-slate-500 font-medium">Mettez en avant les avis clients et la galerie lifestyle.</p>
                   <div className="flex justify-end"><ChevronRight size={16} className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" /></div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
