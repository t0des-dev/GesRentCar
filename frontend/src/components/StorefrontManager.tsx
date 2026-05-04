"use client";

import { useState, useEffect, useRef } from "react";
import { useAgency } from "@/hooks/useAgency";
import { 
  Save, Palette, Type, Loader2, TrendingUp, Menu, Search, Smartphone, Monitor, Eye, EyeOff, RotateCcw, Layers
} from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api/client";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

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

interface SpecialOffer {
  category: string;
  discount: number;
  end_date: string;
  active: boolean;
}

export default function StorefrontManager() {
  const currentAgency = useAgency();
  const initialized = useRef(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("global");
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("mobile");
  const [showPreview, setShowPreview] = useState(true);
  
  const [form, setForm] = useState({
    name: "", slogan: "", primary_color: "#6366f1", hero_image_url: "", hero_video_url: "",
    about_text_fr: "", about_text_en: "", about_text_ar: "",
    sections_config: { featured: true, stats: true, why_us: true, testimonials: true, map: true, vibe_selector: true, lifestyle_gallery: true, faq: true, concierge_banner: true },
    sections_order: [
      { id: "hero", label: "Bannière Hero", active: true },
      { id: "stats", label: "Statistiques Clés", active: true },
      { id: "featured", label: "Véhicules Vedettes", active: true },
      { id: "why_us", label: "Nos Avantages", active: true },
      { id: "testimonials", label: "Témoignages", active: true },
      { id: "vibe_selector", label: "Sélecteur d'Expérience (Vibe)", active: true },
      { id: "lifestyle_gallery", label: "Galerie Lifestyle (Parallaxe)", active: true },
      { id: "map", label: "Localisation & Map", active: true },
      { id: "concierge_banner", label: "Bannière Concierge IA", active: true },
      { id: "faq", label: "Foire Aux Questions (Accordéon)", active: true },
      { id: "how_it_works", label: "Comment ça marche", active: true },
      { id: "cta_banner", label: "Bannière d'Appel à l'Action", active: true }
    ],
    testimonials: [] as any[],
    seo_config: { title: "", description: "", keywords: "", og_image: "" },
    category_prices: { eco: 250, standard: 350, suv: 600, luxury: 1200, sport: 1000 },
    special_offers: [] as SpecialOffer[],
    header_config: { sticky: true, transparent_hero: true, menu_links: [] as any[] },
    footer_config: { address: "", phone: "", email: "", social_links: { facebook: "", instagram: "", whatsapp: "" } },
    theme_config: { border_radius: "24px", button_style: "pill", glassmorphism: true, font_family: "Inter" },
    stats_config: { label_1: "Clients Satisfaits", value_1: "2,400+", label_2: "Véhicules Premium", value_2: "80+", label_3: "Années d'Excellence", value_3: "15", label_4: "Support VIP", value_4: "24/7" },
    faq_config: [
      { q: "Quelles sont les conditions de location ?", a: "Vous devez être âgé de 21 ans minimum et posséder un permis de conduire valide depuis au moins 2 ans." },
      { q: "Proposez-vous la livraison à l'hôtel ?", a: "Oui, nous livrons nos véhicules gratuitement dans tous les hôtels et aéroports des villes où nous sommes présents." }
    ],
    features_config: [
      { icon: "Crown", title: "Flotte d'Exception", desc: "Une sélection rigoureuse des modèles les plus prestigieux du marché." },
      { icon: "ShieldCheck", title: "Assurance Premium", desc: "Roulez en toute sérénité avec nos couvertures tous risques incluses." },
      { icon: "HeadphonesIcon", title: "Service Conciergerie", desc: "Une assistance personnalisée disponible 24h/7j pour tous vos besoins." }
    ],
    concierge_config: { title: "Conciergerie Digitale", text: "Besoin d'un itinéraire ou d'un conseil ? Notre IA vous accompagne." },
    sections_content: {
      hero: { badge: "Collection Exclusive 2026", title: "L'excellence en mouvement.", subtitle: "Découvrez une nouvelle dimension du voyage avec notre flotte de prestige." },
      why_us: { title: "Pourquoi choisir Vectoria ?", subtitle: "Nous redéfinissons les standards de la location de luxe au Maroc." },
      vibe: { title: "Quelle est votre vibe aujourd'hui ?", subtitle: "Choisissez l'émotion qui guidera votre prochain voyage." },
      lifestyle: { title: "Bien plus qu'un simple trajet.", subtitle: "L'Expérience", text: "Nous intégrons chaque voyage dans un style de vie d'exception." },
      faq: { title: "Questions Fréquentes", subtitle: "Tout ce que vous devez savoir pour votre location." }
    }
  });

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
      toast.success("Configuration sauvegardée !");
      setTimeout(() => window.location.reload(), 1000);
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
          <button onClick={handleSave} disabled={loading} className="flex items-center gap-3 bg-primary text-white px-10 py-4 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50">{loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Enregistrer</button>
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
              {activeTab === "cms" && <StructureManager form={form} setForm={setForm} />}
              {activeTab === "multilingual" && <MultilingualSettings form={form} setForm={setForm} />}
              {activeTab === "seo" && <SEOManager seoConfig={form.seo_config} onChange={(seo) => setForm({ ...form, seo_config: seo })} />}
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
