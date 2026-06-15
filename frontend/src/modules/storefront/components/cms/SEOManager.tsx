"use client";

import { motion } from "framer-motion";
import { Search, Globe, Share2, MousePointer2, Type, Tag, Eye } from "lucide-react";
import { cn } from "@/shared/utils";
import AssetUpload from "@/components/AssetUpload";

interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  og_image: string;
}

interface SEOManagerProps {
  config: SEOConfig;
  onChange: (config: SEOConfig) => void;
}

export default function SEOManager({ config, onChange }: SEOManagerProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <div className="bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Search size={20} />
          </div>
          <h3 className="text-xl font-black text-slate-900">Méta-données SEO</h3>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Titre de la page (Meta Title)</label>
            <input 
              type="text" 
              value={config.title ?? ""} 
              onChange={e => onChange({ ...config, title: e.target.value })}
              placeholder="Vectoria Rent Car | Location de voitures de luxe au Maroc"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all"
            />
            <p className="text-[9px] text-slate-400 font-medium px-1 flex justify-between">
              <span>Recommandé: 50-60 caractères</span>
              <span className={cn(config.title.length > 60 ? "text-rose-500" : "text-emerald-500")}>{config.title.length} caractères</span>
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description (Meta Description)</label>
            <textarea 
              rows={4} 
              value={config.description ?? ""} 
              onChange={e => onChange({ ...config, description: e.target.value })}
              placeholder="Réservez votre voiture de luxe à Casablanca, Marrakech et Rabat..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all resize-none"
            />
            <p className="text-[9px] text-slate-400 font-medium px-1 flex justify-between">
              <span>Recommandé: 150-160 caractères</span>
              <span className={cn(config.description.length > 160 ? "text-rose-500" : "text-emerald-500")}>{config.description.length} caractères</span>
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mots-clés (Keywords)</label>
            <input 
              type="text" 
              value={config.keywords ?? ""} 
              onChange={e => onChange({ ...config, keywords: e.target.value })}
              placeholder="location voiture, luxe, casablanca, rent car"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all"
            />
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Share2 size={20} />
            </div>
            <h3 className="text-xl font-black text-slate-900">OpenGraph (Partage)</h3>
          </div>

          <AssetUpload 
            type="hero" 
            label="Image de partage (1200x630)" 
            currentUrl={config.og_image} 
            onUploadComplete={(url: any) => onChange({ ...config, og_image: url })}
          />

          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
             <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4">Aperçu du partage (WhatsApp/FB)</p>
             <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="aspect-[1.91/1] bg-slate-100 relative">
                   {config.og_image ? (
                     <img src={config.og_image} className="w-full h-full object-cover" alt="OG Preview" />
                   ) : (
                     <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-black text-[10px] uppercase">Aperçu image</div>
                   )}
                </div>
                <div className="p-4 space-y-1">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new URL(window.location.origin).hostname}</p>
                   <h4 className="text-sm font-black text-slate-900 truncate">{config.title || "Titre de partage"}</h4>
                   <p className="text-xs text-slate-500 line-clamp-2">{config.description || "Description de partage qui s'affichera lors de l'envoi du lien."}</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
