"use client";

import { useState, useEffect } from "react";
import { useAgency } from "@/hooks/useAgency";
import { 
  Save, Palette, Type, Image as ImageIcon, Loader2, Plus, Trash2, 
  TrendingUp, Layout, Menu, Phone, Globe, MousePointer2, 
  Layers, Smartphone, Monitor, CheckCircle2, Sliders, Settings,
  Hash, Share2, Mail, MapPin, Globe as FacebookIcon, Camera as InstagramIcon, MessageCircle as WhatsAppIcon, 
  ChevronRight, RefreshCw, Eye, X, Quote, Search, Share
} from "lucide-react";
import api from "@/lib/api/client";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import StorefrontPreview from "./StorefrontPreview";
import AssetUpload from "./AssetUpload";
import SectionReorder from "./cms/SectionReorder";
import TestimonialsManager from "./cms/TestimonialsManager";
import SEOManager from "./cms/SEOManager";

interface SpecialOffer {
  category: string;
  discount: number;
  end_date: string;
  active: boolean;
}

interface NavLink {
  label: string;
  url: string;
}

export default function StorefrontManager() {
  const currentAgency = useAgency();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("global");
  const [stats, setStats] = useState<any[]>([]);
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("mobile");
  const [showPreview, setShowPreview] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    slogan: "",
    primary_color: "#6366f1",
    hero_image_url: "",
    about_text_fr: "",
    about_text_en: "",
    about_text_ar: "",
    sections_config: {
      featured: true,
      stats: true,
      why_us: true,
      testimonials: true,
      map: true
    },
    sections_order: [
      { id: "hero", label: "Bannière Hero", active: true },
      { id: "stats", label: "Statistiques Clés", active: true },
      { id: "featured", label: "Véhicules Vedettes", active: true },
      { id: "why_us", label: "Nos Avantages", active: true },
      { id: "testimonials", label: "Témoignages", active: true },
      { id: "map", label: "Localisation & Map", active: true }
    ],
    testimonials: [] as any[],
    seo_config: {
      title: "",
      description: "",
      keywords: "",
      og_image: ""
    },
    category_prices: {
      eco: 250,
      standard: 350,
      suv: 600,
      luxury: 1200,
      sport: 1000
    },
    special_offers: [] as SpecialOffer[],
    header_config: {
      sticky: true,
      transparent_hero: true,
      menu_links: [] as NavLink[]
    },
    footer_config: {
      address: "",
      phone: "",
      email: "",
      social_links: {
        facebook: "",
        instagram: "",
        whatsapp: ""
      }
    },
    theme_config: {
      border_radius: "24px",
      button_style: "pill",
      glassmorphism: true,
      font_family: "Inter"
    },
    stats_config: {
      label_1: "Clients satisfaits", value_1: "2,400+",
      label_2: "Véhicules premium", value_2: "80+",
      label_3: "Années d'expérience", value_3: "15",
      label_4: "Support disponible", value_4: "24/7"
    }
  });

  useEffect(() => {
    if (currentAgency.agency_name) {
      setForm({
        ...form,
        name: currentAgency.agency_name,
        slogan: currentAgency.agency_slogan,
        primary_color: currentAgency.primary_color,
        hero_image_url: currentAgency.hero_image_url || "",
        about_text_fr: currentAgency.about_text_fr || "",
        about_text_en: currentAgency.about_text_en || "",
        about_text_ar: currentAgency.about_text_ar || "",
        sections_config: { ...form.sections_config, ...currentAgency.sections_config },
        sections_order: currentAgency.sections_order || form.sections_order,
        testimonials: currentAgency.testimonials || [],
        seo_config: { ...form.seo_config, ...(currentAgency.seo_config as any) },
        category_prices: currentAgency.category_prices || form.category_prices,
        special_offers: (currentAgency.special_offers as SpecialOffer[]) || [],
        header_config: { ...form.header_config, ...currentAgency.header_config },
        footer_config: { ...form.footer_config, ...(currentAgency.footer_config as any) },
        theme_config: { ...form.theme_config, ...(currentAgency.theme_config as any) },
        stats_config: { ...form.stats_config, ...(currentAgency.stats_config as any) }
      });
    }
  }, [currentAgency]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/stats/revenue");
        setStats(res.data);
      } catch (err) { console.error(err); }
    };
    fetchStats();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await api.post("/config", form);
      if (res.status === 200) {
        alert("Configuration sauvegardée avec succès !");
        window.location.reload();
      }
    } catch {
      alert("Erreur lors de la sauvegarde.");
    } finally {
      setLoading(false);
    }
  };

  const addMenuLink = () => {
    setForm({
      ...form,
      header_config: {
        ...form.header_config,
        menu_links: [...form.header_config.menu_links, { label: "Nouveau", url: "#" }]
      }
    });
  };

  const removeMenuLink = (index: number) => {
    const links = [...form.header_config.menu_links];
    links.splice(index, 1);
    setForm({ ...form, header_config: { ...form.header_config, menu_links: links } });
  };

  const tabs = [
    { id: "global", label: "Branding", icon: Palette },
    { id: "navigation", label: "Structure", icon: Menu },
    { id: "cms", label: "Sections & Avis", icon: Layers },
    { id: "multilingual", label: "Langues", icon: Type },
    { id: "seo", label: "SEO & Social", icon: Search },
    { id: "business", label: "Tarification", icon: TrendingUp },
  ];

  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Atelier Storefront</h2>
          <p className="text-slate-500 font-medium italic mt-1">Concevez l'expérience digitale de votre agence.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-600 hover:border-primary hover:text-primary transition-all"
          >
            {showPreview ? <X size={14} /> : <Eye size={14} />}
            {showPreview ? "Masquer Aperçu" : "Aperçu Live"}
          </button>
          <button 
            onClick={handleSave} 
            disabled={loading}
            className="bg-primary text-white flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Publier
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Tabs */}
        <div className="lg:w-72 shrink-0 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-sm",
                activeTab === tab.id 
                  ? "bg-white text-primary shadow-xl shadow-slate-200/50 border border-slate-100" 
                  : "text-slate-500 hover:bg-white hover:text-primary border border-transparent hover:border-slate-100"
              )}
            >
              <tab.icon size={18} strokeWidth={2.5} />
              {tab.label}
            </button>
          ))}
          
          <div className="mt-10 p-6 rounded-[32px] bg-slate-900 text-white overflow-hidden relative group">
             <div className="relative z-10">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Simulateur</p>
                <div className="flex gap-2">
                   <button 
                    onClick={() => { setShowPreview(true); setPreviewDevice("mobile"); }}
                    className={cn("p-2 rounded-lg transition-all", previewDevice === 'mobile' ? "bg-primary" : "bg-white/10")}
                   >
                     <Smartphone size={16} />
                   </button>
                   <button 
                    onClick={() => { setShowPreview(true); setPreviewDevice("desktop"); }}
                    className={cn("p-2 rounded-lg transition-all", previewDevice === 'desktop' ? "bg-primary" : "bg-white/10")}
                   >
                     <Monitor size={16} />
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Content Area */}
        <div className={cn(
          "flex-1 transition-all duration-500 flex flex-col xl:flex-row gap-10",
          showPreview ? "max-w-full" : "max-w-5xl"
        )}>
          
          {/* Form Side */}
          <div className="flex-1 space-y-8 min-w-0">
            <AnimatePresence mode="wait">
              {activeTab === "global" && (
                <motion.div 
                  key="global"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Type size={20} />
                      </div>
                      <h3 className="text-xl font-black text-slate-900">Identité & Marque</h3>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nom de l'Agence</label>
                            <input 
                              type="text" 
                              value={form.name} 
                              onChange={e => setForm({...form, name: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Slogan Principal</label>
                            <input 
                              type="text" 
                              value={form.slogan} 
                              onChange={e => setForm({...form, slogan: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all"
                            />
                         </div>
                      </div>

                      <AssetUpload 
                        type="hero" 
                        label="Image Principale (Hero)" 
                        currentUrl={form.hero_image_url} 
                        onUploadComplete={(url) => setForm({...form, hero_image_url: url})}
                      />

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Couleur Signature</label>
                        <div className="flex gap-4">
                          <div className="w-14 h-14 rounded-2xl border-2 border-white shadow-lg shrink-0 overflow-hidden relative">
                             <input 
                              type="color" 
                              value={form.primary_color} 
                              onChange={e => setForm({...form, primary_color: e.target.value})}
                              className="absolute inset-[-5px] w-[150%] h-[150%] cursor-pointer"
                            />
                          </div>
                          <input 
                            type="text" 
                            value={form.primary_color} 
                            onChange={e => setForm({...form, primary_color: e.target.value})}
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-mono font-bold uppercase outline-none focus:bg-white focus:border-primary transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                        <Sliders size={20} />
                      </div>
                      <h3 className="text-xl font-black text-slate-900">Design du Système</h3>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Rayon (Radius)</label>
                          <select 
                            value={form.theme_config.border_radius} 
                            onChange={e => setForm({...form, theme_config: {...form.theme_config, border_radius: e.target.value}})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 font-bold outline-none appearance-none"
                          >
                            <option value="0px">Carré</option>
                            <option value="12px">Arrondi</option>
                            <option value="24px">Premium</option>
                            <option value="40px">Extra-Smooth</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Style de Bouton</label>
                          <select 
                            value={form.theme_config.button_style} 
                            onChange={e => setForm({...form, theme_config: {...form.theme_config, button_style: e.target.value}})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 font-bold outline-none appearance-none"
                          >
                            <option value="square">Standard</option>
                            <option value="rounded">Arrondi</option>
                            <option value="pill">Pillule (Moderne)</option>
                          </select>
                        </div>
                      </div>

                      <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                         <label className="flex items-center justify-between cursor-pointer group">
                            <div className="space-y-1">
                              <span className="text-sm font-black text-slate-900">Effet Glassmorphism</span>
                              <p className="text-[10px] text-slate-400 font-medium">Active les flous d'arrière-plan sur le site</p>
                            </div>
                            <input 
                              type="checkbox" 
                              className="hidden"
                              checked={form.theme_config.glassmorphism} 
                              onChange={e => setForm({...form, theme_config: {...form.theme_config, glassmorphism: e.target.checked}})} 
                            />
                            <div className={cn(
                              "w-12 h-6 rounded-full p-1 transition-all duration-300",
                              form.theme_config.glassmorphism ? "bg-primary" : "bg-slate-300"
                            )}>
                              <div className={cn(
                                "w-4 h-4 bg-white rounded-full transition-all duration-300",
                                form.theme_config.glassmorphism ? "translate-x-6" : "translate-x-0"
                              )} />
                            </div>
                         </label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "navigation" && (
                <motion.div 
                  key="navigation"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Monitor size={20} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900">Navigation & Menu</h3>
                      </div>
                      <button 
                        onClick={addMenuLink}
                        className="px-4 py-2 bg-slate-50 hover:bg-primary hover:text-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                      >
                        <Plus size={14} /> Ajouter un lien
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <label className="flex items-center gap-4 p-5 bg-slate-50 border border-slate-100 rounded-3xl cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={form.header_config.sticky} 
                            onChange={e => setForm({...form, header_config: {...form.header_config, sticky: e.target.checked}})} 
                            className="w-5 h-5 accent-primary"
                          />
                          <div>
                            <p className="text-sm font-black text-slate-900">Menu Fixe (Sticky)</p>
                            <p className="text-[10px] text-slate-400 font-medium">Reste visible lors du défilement</p>
                          </div>
                       </label>
                       <label className="flex items-center gap-4 p-5 bg-slate-50 border border-slate-100 rounded-3xl cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={form.header_config.transparent_hero} 
                            onChange={e => setForm({...form, header_config: {...form.header_config, transparent_hero: e.target.checked}})} 
                            className="w-5 h-5 accent-primary"
                          />
                          <div>
                            <p className="text-sm font-black text-slate-900">Transparence Hero</p>
                            <p className="text-[10px] text-slate-400 font-medium">Fond transparent sur la bannière</p>
                          </div>
                       </label>
                    </div>

                    <div className="space-y-3">
                      {form.header_config.menu_links.map((link, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-4 bg-white border border-slate-100 p-4 rounded-2xl group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 font-black text-[10px]">{i+1}</div>
                          <input 
                            type="text" 
                            placeholder="Label du lien" 
                            value={link.label} 
                            onChange={e => {
                              const links = [...form.header_config.menu_links];
                              links[i].label = e.target.value;
                              setForm({...form, header_config: {...form.header_config, menu_links: links}});
                            }} 
                            className="flex-1 text-sm font-bold outline-none"
                          />
                          <div className="h-4 w-px bg-slate-100" />
                          <input 
                            type="text" 
                            placeholder="URL / Section" 
                            value={link.url} 
                            onChange={e => {
                              const links = [...form.header_config.menu_links];
                              links[i].url = e.target.value;
                              setForm({...form, header_config: {...form.header_config, menu_links: links}});
                            }} 
                            className="flex-1 text-sm font-bold text-slate-400 outline-none"
                          />
                          <button 
                            onClick={() => removeMenuLink(i)}
                            className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                        <Smartphone size={20} />
                      </div>
                      <h3 className="text-xl font-black text-slate-900">Configuration Footer</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Téléphone de contact</label>
                        <div className="relative">
                          <Phone size={14} className="absolute left-6 top-5 text-slate-400" />
                          <input 
                            type="text" 
                            value={form.footer_config.phone} 
                            onChange={e => setForm({...form, footer_config: {...form.footer_config, phone: e.target.value}})} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email de support</label>
                        <div className="relative">
                          <Mail size={14} className="absolute left-6 top-5 text-slate-400" />
                          <input 
                            type="email" 
                            value={form.footer_config.email} 
                            onChange={e => setForm({...form, footer_config: {...form.footer_config, email: e.target.value}})} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Adresse Physique</label>
                      <div className="relative">
                        <MapPin size={14} className="absolute left-6 top-5 text-slate-400" />
                        <textarea 
                          rows={2} 
                          value={form.footer_config.address} 
                          onChange={e => setForm({...form, footer_config: {...form.footer_config, address: e.target.value}})} 
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "cms" && (
                <motion.div 
                  key="cms"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                        <Layers size={20} />
                      </div>
                      <h3 className="text-xl font-black text-slate-900">Structure de l'Accueil</h3>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Réorganisez les sections de votre page d'accueil par glisser-déposer.</p>
                    <SectionReorder 
                      sections={form.sections_order} 
                      onChange={(sections) => setForm({ ...form, sections_order: sections })} 
                    />
                  </div>

                  <TestimonialsManager 
                    testimonials={form.testimonials} 
                    onChange={(testimonials) => setForm({ ...form, testimonials })} 
                  />
                </motion.div>
              )}

              {activeTab === "multilingual" && (
                <motion.div 
                  key="multilingual"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                        <Type size={20} />
                      </div>
                      <h3 className="text-xl font-black text-slate-900">Descriptions Multilingues</h3>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Français (FR)</label>
                          <textarea 
                            rows={8} 
                            value={form.about_text_fr} 
                            onChange={e => setForm({...form, about_text_fr: e.target.value})} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all resize-none"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">English (EN)</label>
                          <textarea 
                            rows={8} 
                            value={form.about_text_en} 
                            onChange={e => setForm({...form, about_text_en: e.target.value})} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all resize-none"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 text-right block">العربية (AR)</label>
                          <textarea 
                            rows={8} 
                            dir="rtl"
                            value={form.about_text_ar} 
                            onChange={e => setForm({...form, about_text_ar: e.target.value})} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all resize-none text-right"
                          />
                       </div>
                    </div>
                  </div>

                  <div className="bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Hash size={20} />
                      </div>
                      <h3 className="text-xl font-black text-slate-900">Compteurs & Stats</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex gap-4 p-4 bg-slate-50 border border-slate-100 rounded-3xl">
                          <div className="flex-1 space-y-1">
                            <label className="text-[9px] font-black uppercase text-slate-400">Label {i}</label>
                            <input 
                              type="text" 
                              value={(form.stats_config as any)[`label_${i}`]} 
                              onChange={e => setForm({...form, stats_config: {...form.stats_config, [`label_${i}`]: e.target.value}})} 
                              className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2 font-bold text-xs outline-none focus:border-primary transition-all"
                            />
                          </div>
                          <div className="w-24 space-y-1">
                            <label className="text-[9px] font-black uppercase text-slate-400">Valeur</label>
                            <input 
                              type="text" 
                              value={(form.stats_config as any)[`value_${i}`]} 
                              onChange={e => setForm({...form, stats_config: {...form.stats_config, [`value_${i}`]: e.target.value}})} 
                              className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2 font-black text-xs outline-none focus:border-primary transition-all text-center"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "seo" && (
                <motion.div 
                  key="seo"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <SEOManager 
                    config={form.seo_config} 
                    onChange={(config) => setForm({ ...form, seo_config: config })} 
                  />

                  <div className="bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Share size={20} />
                      </div>
                      <h3 className="text-xl font-black text-slate-900">Réseaux Sociaux & Hub</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                          <FacebookIcon size={12} /> Facebook
                        </label>
                        <input 
                          type="text" 
                          value={form.footer_config.social_links.facebook} 
                          onChange={e => setForm({...form, footer_config: {...form.footer_config, social_links: {...form.footer_config.social_links, facebook: e.target.value}}})} 
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 text-xs font-bold outline-none focus:border-primary transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                          <InstagramIcon size={12} /> Instagram
                        </label>
                        <input 
                          type="text" 
                          value={form.footer_config.social_links.instagram} 
                          onChange={e => setForm({...form, footer_config: {...form.footer_config, social_links: {...form.footer_config.social_links, instagram: e.target.value}}})} 
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 text-xs font-bold outline-none focus:border-primary transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                          <WhatsAppIcon size={12} /> WhatsApp
                        </label>
                        <input 
                          type="text" 
                          value={form.footer_config.social_links.whatsapp} 
                          onChange={e => setForm({...form, footer_config: {...form.footer_config, social_links: {...form.footer_config.social_links, whatsapp: e.target.value}}})} 
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 text-xs font-bold outline-none focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "business" && (
                <motion.div 
                  key="business"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Globe size={20} />
                      </div>
                      <h3 className="text-xl font-black text-slate-900">Tarification Globale</h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                      {Object.entries(form.category_prices).map(([key, val]) => (
                        <div key={key} className="space-y-2 p-5 bg-slate-50 border border-slate-100 rounded-3xl group hover:border-primary/30 transition-all">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block text-center">{key}</label>
                          <div className="relative">
                            <input 
                              type="number" 
                              value={val as number} 
                              onChange={e => setForm({
                                ...form, category_prices: {...form.category_prices, [key]: Number(e.target.value)}
                              })} 
                              className="w-full bg-white border border-slate-200 rounded-xl px-2 py-3 font-black text-sm outline-none focus:border-primary transition-all text-center"
                            />
                            <span className="absolute -bottom-5 left-0 w-full text-center text-[8px] font-black text-slate-300 uppercase">DH / Jour</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Preview Side */}
          {showPreview && (
            <div className="xl:w-[400px] shrink-0 sticky top-32 h-[calc(100vh-200px)] flex flex-col gap-6">
              <div className="flex items-center justify-between px-4">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Simulateur Live</h4>
                 <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                    <button 
                      onClick={() => setPreviewDevice("mobile")}
                      className={cn("p-2 rounded-lg transition-all", previewDevice === 'mobile' ? "bg-primary text-white" : "text-slate-400")}
                    >
                      <Smartphone size={14} />
                    </button>
                    <button 
                      onClick={() => setPreviewDevice("desktop")}
                      className={cn("p-2 rounded-lg transition-all", previewDevice === 'desktop' ? "bg-primary text-white" : "text-slate-400")}
                    >
                      <Monitor size={14} />
                    </button>
                 </div>
              </div>
              <div className="flex-1 min-h-0">
                <StorefrontPreview form={form} device={previewDevice} />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
