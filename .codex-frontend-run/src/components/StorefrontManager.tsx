"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAgency } from "@/hooks/useAgency";
import { 
  Save, Palette, Type, Loader2, TrendingUp, Menu, Search, Smartphone, Monitor, Eye, EyeOff, RotateCcw, Layers
} from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api/client";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import type { StorefrontForm, Testimonial } from "@/types/storefront";
import { defaultStorefrontForm } from "@/constants/storefrontDefaults";

// Modular Components
import StorefrontPreview from "./StorefrontPreview";
import TestimonialsManager from "./cms/TestimonialsManager";
import SEOManager from "./cms/SEOManager";

// New Modular Sub-components
import GlobalBranding from "./cms/GlobalBranding";
import MenuFooterSettings from "./cms/MenuFooterSettings";
import StructureManager from "./cms/StructureManager";
import MultilingualSettings from "./cms/MultilingualSettings";
import BusinessSettings from "./cms/BusinessSettings";

export default function StorefrontManager() {
  const currentAgency = useAgency();
  const initialized = useRef(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("global");
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("mobile");
  const [showPreview, setShowPreview] = useState(true);
  
  const [form, setForm] = useState<StorefrontForm>({ ...defaultStorefrontForm });

  useEffect(() => {
    if (currentAgency.agency_name && !initialized.current) {
      setForm(prev => ({
        ...prev,
        ...currentAgency,
        sections_config: { ...prev.sections_config, ...currentAgency.sections_config },
        sections_order: currentAgency.sections_order || prev.sections_order,
        seo_config: { ...prev.seo_config, ...(currentAgency.seo_config as any) },
        category_prices: currentAgency.category_prices || prev.category_prices,
        header_config: { ...prev.header_config, ...currentAgency.header_config },
        footer_config: { ...prev.footer_config, ...(currentAgency.footer_config as any) },
        theme_config: { ...prev.theme_config, ...(currentAgency.theme_config as any) },
        stats_config: { ...prev.stats_config, ...(currentAgency.stats_config as any) },
        sections_content: { ...prev.sections_content, ...(currentAgency.sections_content as any) }
      }));
      initialized.current = true;
    }
  }, [currentAgency]);

  const queryClient = useQueryClient();

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.post("/config", form);
      queryClient.invalidateQueries({ queryKey: ["agency-config"] });
      setSaved(true);
      toast.success("Configuration sauvegardée !");
      setTimeout(() => setSaved(false), 3000);
    } catch {
      toast.error("Erreur lors de la sauvegarde.");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "global", label: "Branding & Identité", icon: Palette },
    { id: "navigation", label: "Menu & Navigation", icon: Menu },
    { id: "cms", label: "Structure de l'Accueil", icon: Layers },
    { id: "multilingual", label: "Contenu & Langues", icon: Type },
    { id: "seo", label: "SEO & Social Hub", icon: Search },
    { id: "business", label: "Tarification & Offres", icon: TrendingUp },
  ];

  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div><h2 className="text-3xl font-black text-slate-900 tracking-tight">Atelier Storefront</h2><p className="text-slate-500 font-medium italic mt-1">Concevez l'expérience digitale de votre agence.</p></div>
        <div className="flex items-center gap-4">
          <button onClick={() => setShowPreview(!showPreview)} className={cn("hidden lg:flex items-center gap-3 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all border", showPreview ? "bg-slate-900 text-white border-slate-900 shadow-xl" : "bg-white text-slate-600 border-slate-200")}>{showPreview ? <EyeOff size={14} /> : <Eye size={14} />} {showPreview ? "Masquer Aperçu" : "Aperçu Live"}</button>
          <button onClick={handleSave} disabled={loading} className={cn("flex items-center gap-3 text-white px-10 py-4 rounded-3xl font-black uppercase tracking-widest text-xs transition-all shadow-xl active:scale-95 disabled:opacity-50", saved ? "bg-emerald-500 shadow-emerald-500/20" : "bg-primary shadow-primary/20 hover:bg-blue-600")}>{loading ? <Loader2 size={18} className="animate-spin" /> : saved ? <>✓</> : <Save size={18} />} {loading ? "Sauvegarde..." : saved ? "Sauvegardé" : "Enregistrer"}</button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="lg:w-72 shrink-0 space-y-2">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-sm", activeTab === tab.id ? "bg-white text-primary shadow-xl shadow-slate-200/50 border border-slate-100" : "text-slate-500 hover:bg-white hover:text-primary border border-transparent")}>
              <tab.icon size={18} strokeWidth={2.5} /> {tab.label}
            </button>
          ))}
          <div className="mt-10 p-6 rounded-[32px] bg-slate-900 text-white overflow-hidden relative group">
             <div className="relative z-10"><p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Simulateur</p>
                <div className="flex gap-2"><button onClick={() => { setShowPreview(true); setPreviewDevice("mobile"); }} className={cn("p-2 rounded-lg transition-all", previewDevice === 'mobile' ? "bg-primary" : "bg-white/10")}><Smartphone size={16} /></button><button onClick={() => { setShowPreview(true); setPreviewDevice("desktop"); }} className={cn("p-2 rounded-lg transition-all", previewDevice === 'desktop' ? "bg-primary" : "bg-white/10")}><Monitor size={16} /></button></div>
             </div>
          </div>
        </div>

        <div className={cn("flex-1 transition-all duration-500 flex flex-col xl:flex-row gap-10", showPreview ? "max-w-full" : "max-w-5xl")}>
          <div className="flex-1 space-y-8 min-w-0">
            <AnimatePresence mode="wait">
              {activeTab === "global" && <GlobalBranding form={form} setForm={setForm} />}
              {activeTab === "navigation" && <MenuFooterSettings form={form} setForm={setForm} />}
              {activeTab === "cms" && <StructureManager form={form} setForm={setForm} onNavigate={setActiveTab} />}
              {activeTab === "multilingual" && <MultilingualSettings form={form} setForm={setForm} />}
              {activeTab === "seo" && <SEOManager config={form.seo_config} onChange={(seo) => setForm({ ...form, seo_config: seo })} />}
              {activeTab === "business" && <BusinessSettings form={form} setForm={setForm} />}
            </AnimatePresence>
            {activeTab === "cms" && <TestimonialsManager testimonials={form.testimonials} onChange={(t) => setForm({ ...form, testimonials: t })} />}
          </div>

          {showPreview && (
            <div className="xl:w-[450px] shrink-0">
              <div className="sticky top-32">
                <StorefrontPreview form={form} device={previewDevice} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
