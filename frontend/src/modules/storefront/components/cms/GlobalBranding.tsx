"use client";

import { motion } from "framer-motion";
import { Type, Sliders, CheckCircle2 } from "lucide-react";
import AssetUpload from "@/components/AssetUpload";
import { cn } from "@/shared/utils";
import type { StorefrontForm } from "@/types/storefront";

interface GlobalBrandingProps {
  form: StorefrontForm;
  setForm: (v: StorefrontForm) => void;
}

export default function GlobalBranding({ form, setForm }: GlobalBrandingProps) {
  const themes = [
    {
      id: 'luxury',
      name: 'Luxury Elite',
      desc: 'Or & Noir • Classique',
      color: '#D4AF37',
      font: 'Playfair Display',
      radius: '0px',
      buttonStyle: 'square'
    },
    {
      id: 'eco',
      name: 'Modern Eco',
      desc: "Vert d'eau • Arrondi",
      color: '#10B981',
      font: 'Outfit',
      radius: '40px',
      buttonStyle: 'pill'
    },
    {
      id: 'corporate',
      name: 'Corporate Blue',
      desc: 'Bleu Roi • Pro',
      color: '#2563EB',
      font: 'Inter',
      radius: '12px',
      buttonStyle: 'rounded'
    },
    {
      id: 'sport',
      name: 'Sport Racing',
      desc: 'Rouge Vif • Dynamique',
      color: '#EF4444',
      font: 'Outfit',
      radius: '8px',
      buttonStyle: 'rounded'
    }
  ];

  const applyTheme = (t: typeof themes[0]) => {
    setForm({
      ...form, 
      primary_color: t.color, 
      theme_config: {
        ...form.theme_config, 
        border_radius: t.radius, 
        button_style: t.buttonStyle, 
        font_family: t.font
      }
    });
  };

  const isThemeActive = (t: typeof themes[0]) => {
    return form.primary_color === t.color &&
           form.theme_config?.border_radius === t.radius &&
           (form.theme_config?.font_family || 'Inter') === t.font;
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      {/* Presets */}
      <div className="bg-slate-900 p-8 rounded-[40px] shadow-xl text-white">
        <h3 className="text-lg font-black mb-6">Thèmes Magiques</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {themes.map(t => {
            const active = isThemeActive(t);
            return (
              <button 
                key={t.id}
                onClick={() => applyTheme(t)} 
                className={cn(
                  "relative text-left bg-slate-800 p-5 rounded-3xl transition-all border-2 overflow-hidden group hover:-translate-y-1",
                  active ? "shadow-lg shadow-white/5" : "border-slate-700 hover:border-slate-500"
                )}
                style={{ borderColor: active ? t.color : undefined }}
              >
                {active && (
                  <div className="absolute top-4 right-4" style={{ color: t.color }}>
                    <CheckCircle2 size={20} className="fill-current text-slate-800" />
                  </div>
                )}
                
                <div className="flex items-center gap-2 mb-5">
                   <div className="w-5 h-5 rounded-full shadow-sm" style={{ backgroundColor: t.color }} />
                   <div className="w-4 h-4 rounded-full bg-slate-700" />
                   <div className="w-4 h-4 rounded-full bg-slate-900" />
                </div>

                <span className="block font-bold text-lg mb-1" style={{ color: t.color, fontFamily: t.font }}>{t.name}</span>
                <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-6">{t.desc}</span>
                
                <div 
                  className="w-full py-2.5 text-center text-[10px] uppercase tracking-wider font-black transition-all text-white shadow-sm"
                  style={{ 
                    backgroundColor: t.color, 
                    borderRadius: t.radius,
                    fontFamily: t.font
                  }}
                >
                  Voir le rendu
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Type size={20} /></div>
          <h3 className="text-xl font-black text-slate-900">Identité & Marque</h3>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nom de l&apos;Agence</label>
              <input type="text" value={form.name ?? ""} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Slogan Principal</label>
              <input type="text" value={form.slogan ?? ""} onChange={e => setForm({...form, slogan: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AssetUpload type="logo" label="Logo de l&apos;Agence" currentUrl={form.logo_url} onUploadComplete={(url) => setForm({...form, logo_url: url})} />
            <AssetUpload type="hero" label="Image de repli (Poster)" currentUrl={form.hero_image_url} onUploadComplete={(url) => setForm({...form, hero_image_url: url})} />
          </div>

          {/* Logo Settings */}
          {form.logo_url && (
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Paramètres du Logo</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500">Largeur</label>
                  <input
                    type="text"
                    value={form.logo_config?.width ?? "36px"}
                    onChange={e => setForm({...form, logo_config: {...form.logo_config, width: e.target.value}})}
                    placeholder="36px"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:border-primary transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500">Hauteur</label>
                  <input
                    type="text"
                    value={form.logo_config?.height ?? "36px"}
                    onChange={e => setForm({...form, logo_config: {...form.logo_config, height: e.target.value}})}
                    placeholder="36px"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:border-primary transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500">Rayon</label>
                  <input
                    type="text"
                    value={form.logo_config?.radius ?? "8px"}
                    onChange={e => setForm({...form, logo_config: {...form.logo_config, radius: e.target.value}})}
                    placeholder="8px"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:border-primary transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500">Fond</label>
                  <div className="flex gap-2">
                    <div className="w-9 h-9 rounded-lg border-2 border-white shadow shrink-0 overflow-hidden relative">
                      <input
                        type="color"
                        value={form.logo_config?.background ?? "#6366f1"}
                        onChange={e => setForm({...form, logo_config: {...form.logo_config, background: e.target.value}})}
                        className="absolute inset-[-5px] w-[150%] h-[150%] cursor-pointer"
                      />
                    </div>
                    <input
                      type="text"
                      value={form.logo_config?.background ?? ""}
                      onChange={e => setForm({...form, logo_config: {...form.logo_config, background: e.target.value}})}
                      placeholder="auto"
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-mono font-bold outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500">Opacité ({Math.round((form.logo_config?.background_opacity ?? 1) * 100)}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={form.logo_config?.background_opacity ?? 1}
                    onChange={e => setForm({...form, logo_config: {...form.logo_config, background_opacity: parseFloat(e.target.value)}})}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.logo_config?.transparent_bg === true}
                    onChange={e => setForm({...form, logo_config: {...form.logo_config, transparent_bg: e.target.checked, background_opacity: e.target.checked ? 0 : 1}})}
                    className="rounded border-slate-300 text-primary focus:ring-primary/50 cursor-pointer w-4 h-4"
                  />
                  <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">Fond transparent</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.logo_config?.show_name !== false}
                    onChange={e => setForm({...form, logo_config: {...form.logo_config, show_name: e.target.checked}})}
                    className="rounded border-slate-300 text-primary focus:ring-primary/50 cursor-pointer w-4 h-4"
                  />
                  <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">Afficher le nom à côté du logo</span>
                </label>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">URL Vidéo Hero (MP4)</label>
            <input type="text" placeholder="Lien direct vers une vidéo .mp4" value={form.hero_video_url ?? ""} onChange={e => setForm({...form, hero_video_url: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Couleur Signature</label>
            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-2xl border-2 border-white shadow-lg shrink-0 overflow-hidden relative">
                <input type="color" value={form.primary_color ?? ""} onChange={e => setForm({...form, primary_color: e.target.value})} className="absolute inset-[-5px] w-[150%] h-[150%] cursor-pointer" />
              </div>
              <input type="text" value={form.primary_color ?? ""} onChange={e => setForm({...form, primary_color: e.target.value})} className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-mono font-bold uppercase outline-none focus:bg-white focus:border-primary transition-all" />
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
              <select value={form.theme_config?.border_radius ?? ""} onChange={e => setForm({...form, theme_config: {...form.theme_config, border_radius: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 font-bold outline-none appearance-none">
                <option value="0px">Carré</option><option value="12px">Arrondi</option><option value="24px">Premium</option><option value="40px">Extra-Smooth</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Style de Bouton</label>
              <select value={form.theme_config?.button_style ?? ""} onChange={e => setForm({...form, theme_config: {...form.theme_config, button_style: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 font-bold outline-none appearance-none">
                <option value="square">Standard</option><option value="rounded">Arrondi</option><option value="pill">Pillule (Moderne)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Typographie Globale</label>
              <select value={form.theme_config?.font_family ?? "Inter"} onChange={e => setForm({...form, theme_config: {...form.theme_config, font_family: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 font-bold outline-none appearance-none">
                <option value="Inter">Standard (Inter)</option>
                <option value="Playfair Display">Élégance (Playfair Display)</option>
                <option value="Outfit">Moderne &amp; Tech (Outfit)</option>
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
