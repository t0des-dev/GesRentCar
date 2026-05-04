"use client";

import { motion } from "framer-motion";
import { Type, Sliders } from "lucide-react";
import AssetUpload from "@/components/AssetUpload";
import { cn } from "@/lib/utils";

interface GlobalBrandingProps {
  form: any;
  setForm: (v: any) => void;
}

export default function GlobalBranding({ form, setForm }: GlobalBrandingProps) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      <div className="bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Type size={20} /></div>
          <h3 className="text-xl font-black text-slate-900">Identité & Marque</h3>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nom de l'Agence</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Slogan Principal</label>
              <input type="text" value={form.slogan} onChange={e => setForm({...form, slogan: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all" />
            </div>
          </div>
          <AssetUpload type="hero" label="Image de repli (Poster)" currentUrl={form.hero_image_url} onUploadComplete={(url) => setForm({...form, hero_image_url: url})} />
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">URL Vidéo Hero (MP4)</label>
            <input type="text" placeholder="Lien direct vers une vidéo .mp4" value={form.hero_video_url} onChange={e => setForm({...form, hero_video_url: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Couleur Signature</label>
            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-2xl border-2 border-white shadow-lg shrink-0 overflow-hidden relative">
                <input type="color" value={form.primary_color} onChange={e => setForm({...form, primary_color: e.target.value})} className="absolute inset-[-5px] w-[150%] h-[150%] cursor-pointer" />
              </div>
              <input type="text" value={form.primary_color} onChange={e => setForm({...form, primary_color: e.target.value})} className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-mono font-bold uppercase outline-none focus:bg-white focus:border-primary transition-all" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center"><Sliders size={20} /></div>
          <h3 className="text-xl font-black text-slate-900">Design du Système</h3>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Rayon (Radius)</label>
              <select value={form.theme_config.border_radius} onChange={e => setForm({...form, theme_config: {...form.theme_config, border_radius: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 font-bold outline-none appearance-none">
                <option value="0px">Carré</option><option value="12px">Arrondi</option><option value="24px">Premium</option><option value="40px">Extra-Smooth</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Style de Bouton</label>
              <select value={form.theme_config.button_style} onChange={e => setForm({...form, theme_config: {...form.theme_config, button_style: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 font-bold outline-none appearance-none">
                <option value="square">Standard</option><option value="rounded">Arrondi</option><option value="pill">Pillule (Moderne)</option>
              </select>
            </div>
          </div>
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
             <label className="flex items-center justify-between cursor-pointer group">
                <div className="space-y-1"><span className="text-sm font-black text-slate-900">Effet Glassmorphism</span></div>
                <input type="checkbox" className="hidden" checked={form.theme_config.glassmorphism} onChange={e => setForm({...form, theme_config: {...form.theme_config, glassmorphism: e.target.checked}})} />
                <div className={cn("w-12 h-6 rounded-full p-1 transition-all duration-300", form.theme_config.glassmorphism ? "bg-primary" : "bg-slate-300")}>
                  <div className={cn("w-4 h-4 bg-white rounded-full transition-all duration-300", form.theme_config.glassmorphism ? "translate-x-6" : "translate-x-0")} />
                </div>
             </label>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
