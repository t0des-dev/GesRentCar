"use client";

import { useState, useEffect, useCallback } from "react";
import { Save, Loader2, Plus, Trash2, GripVertical, MapPin, Image, Eye, EyeOff } from "lucide-react";
import { useAgency } from "@/hooks/useAgency";
import toast from "react-hot-toast";
import api from "@/shared/services/client";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/utils";
import AssetUpload from "@/components/AssetUpload";
import type { FleetConfig } from "@/types/storefront";

export const DEFAULT_FLEET: FleetConfig = {
  hero_image_url: "",
  hero_eyebrow: "Premium Fleet",
  hero_title: "Explorez Notre Flotte Premium",
  hero_subtitle: "Trouvez le véhicule parfait pour vos voyages d'affaires, vacances familiales et expériences de luxe à travers le Maroc.",
  default_location: "Casablanca — Aéroport Mohammed V (CMN)",
  locations: [
    { id: "cmn", name: "Aéroport Mohammed V (CMN)", city: "Casablanca" },
    { id: "casa", name: "Centre Ville", city: "Casablanca" },
    { id: "rak", name: "Aéroport Menara (RAK)", city: "Marrakech" },
  ],
  default_columns: "3",
  default_sort: "price_asc",
  page_size: "12",
  show_lifestyle_filter: true,
  show_category_filter: true,
  show_transmission_filter: true,
  show_fuel_filter: true,
  show_seats_filter: true,
  show_price_filter: true,
  theme: "light",
};

interface FleetCmsEditorProps {
  value?: FleetConfig;
  onChange?: (v: FleetConfig) => void;
}

export default function FleetCmsEditor({ value, onChange }: FleetCmsEditorProps = {}) {
  const isControlled = value !== undefined && onChange !== undefined;
  const currentAgency = useAgency();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [internalForm, setInternalForm] = useState<FleetConfig>(DEFAULT_FLEET);
  const [activeTab, setActiveTab] = useState<"hero" | "locations" | "settings" | "filters">("hero");

  useEffect(() => {
    if (!isControlled && currentAgency.sections_content?.fleet) {
      setInternalForm({ ...DEFAULT_FLEET, ...currentAgency.sections_content.fleet });
    }
  }, [currentAgency.sections_content?.fleet, isControlled]);

  const form = isControlled ? value! : internalForm;

  const setField = useCallback(<K extends keyof FleetConfig>(key: K, val: FleetConfig[K]) => {
    const next = { ...form, [key]: val };
    if (isControlled) {
      onChange!(next);
    } else {
      setInternalForm(next);
    }
  }, [form, isControlled, onChange]);

  const saveToServer = async () => {
    setLoading(true);
    try {
      const sectionsContent = {
        ...(currentAgency.sections_content || {}),
        fleet: form,
      };
      await api.post("/config", { sections_content: sectionsContent });
      queryClient.invalidateQueries({ queryKey: ["agency-config"] });
      setSaved(true);
      toast.success("Configuration Fleet sauvegardée !");
      setTimeout(() => setSaved(false), 3000);
    } catch {
      toast.error("Erreur lors de la sauvegarde.");
    } finally {
      setLoading(false);
    }
  };

  const addLocation = () => {
    const locs = form.locations || [];
    setField("locations", [...locs, { id: `loc-${Date.now()}`, name: "", city: "" }]);
  };

  const updateLocation = (index: number, key: "id" | "name" | "city", value: string) => {
    const locs = [...(form.locations || [])];
    locs[index] = { ...locs[index], [key]: value };
    setField("locations", locs);
  };

  const removeLocation = (index: number) => {
    const locs = (form.locations || []).filter((_, i) => i !== index);
    setField("locations", locs);
  };

  const tabs = [
    { id: "hero" as const, label: "Hero Section" },
    { id: "locations" as const, label: "Emplacements" },
    { id: "settings" as const, label: "Paramètres" },
    { id: "filters" as const, label: "Filtres" },
  ];

  return (
    <div className="space-y-8">
      {/* Header with tabs + save (standalone only) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-5 py-2.5 rounded-xl text-sm font-bold transition-all",
                activeTab === tab.id
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {!isControlled && (
          <button
            onClick={saveToServer}
            disabled={loading}
            className={cn(
              "flex items-center gap-3 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl active:scale-95 disabled:opacity-50",
              saved ? "bg-emerald-500 shadow-emerald-500/20" : "bg-primary shadow-primary/20 hover:bg-blue-600"
            )}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : saved ? <>✓</> : <Save size={18} />}
            {loading ? "Sauvegarde..." : saved ? "Sauvegardé" : "Enregistrer"}
          </button>
        )}
      </div>

      {/* Hero Tab */}
      {activeTab === "hero" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-slate-900">Image de fond</h3>
            <AssetUpload
              type="hero"
              label="Image Hero"
              currentUrl={form.hero_image_url || ""}
              onUploadComplete={(url: string) => setField("hero_image_url", url)}
              onRemove={() => setField("hero_image_url", "")}
            />
            {form.hero_image_url && (
              <div className="relative h-48 rounded-2xl overflow-hidden bg-slate-100">
                <img src={form.hero_image_url} alt="Hero preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80">{form.hero_eyebrow}</p>
                  <p className="text-xl font-black">{form.hero_title}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-lg font-black text-slate-900">Contenu Hero</h3>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Sur-titre (Eyebrow)</label>
              <input
                value={form.hero_eyebrow || ""}
                onChange={(e) => setField("hero_eyebrow", e.target.value)}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:border-primary focus:bg-white transition-all"
                placeholder="Premium Fleet"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Titre principal</label>
              <input
                value={form.hero_title || ""}
                onChange={(e) => setField("hero_title", e.target.value)}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:border-primary focus:bg-white transition-all"
                placeholder="Explorez Notre Flotte Premium"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Sous-titre</label>
              <textarea
                value={form.hero_subtitle || ""}
                onChange={(e) => setField("hero_subtitle", e.target.value)}
                rows={3}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:border-primary focus:bg-white transition-all resize-y"
                placeholder="Trouvez le véhicule parfait..."
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Lieu par défaut</label>
              <input
                value={form.default_location || ""}
                onChange={(e) => setField("default_location", e.target.value)}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:border-primary focus:bg-white transition-all"
                placeholder="Casablanca — Aéroport Mohammed V (CMN)"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Locations Tab */}
      {activeTab === "locations" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">Emplacements de retrait</h3>
              <button
                onClick={addLocation}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-all"
              >
                <Plus size={16} /> Ajouter
              </button>
            </div>
            <p className="text-sm text-slate-500">Gérez les lieux de retrait disponibles pour les clients.</p>

            <div className="space-y-3">
              <AnimatePresence>
                {(form.locations || []).map((loc, i) => (
                  <motion.div
                    key={loc.id || i}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary/30 transition-all"
                  >
                    <GripVertical size={16} className="text-slate-300 shrink-0 cursor-grab" />
                    <MapPin size={16} className="text-primary shrink-0" />
                    <input
                      value={loc.city}
                      onChange={(e) => updateLocation(i, "city", e.target.value)}
                      placeholder="Ville"
                      className="flex-1 min-w-0 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-primary"
                    />
                    <input
                      value={loc.name}
                      onChange={(e) => updateLocation(i, "name", e.target.value)}
                      placeholder="Nom du lieu"
                      className="flex-[2] min-w-0 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-primary"
                    />
                    <input
                      value={loc.id}
                      onChange={(e) => updateLocation(i, "id", e.target.value)}
                      placeholder="ID"
                      className="w-24 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-primary"
                    />
                    <button
                      onClick={() => removeLocation(i)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {(!form.locations || form.locations.length === 0) && (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <MapPin size={32} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-400 text-sm">Aucun emplacement. Cliquez sur "Ajouter" pour commencer.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-slate-900">Paramètres d'affichage</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Colonnes par défaut</label>
                <select
                  value={form.default_columns || "3"}
                  onChange={(e) => setField("default_columns", e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:border-primary appearance-none cursor-pointer"
                >
                  <option value="2">2 colonnes</option>
                  <option value="3">3 colonnes</option>
                  <option value="4">4 colonnes</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Tri par défaut</label>
                <select
                  value={form.default_sort || "price_asc"}
                  onChange={(e) => setField("default_sort", e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:border-primary appearance-none cursor-pointer"
                >
                  <option value="price_asc">Prix croissant</option>
                  <option value="price_desc">Prix décroissant</option>
                  <option value="year_desc">Plus récents</option>
                  <option value="brand_asc">Marque (A-Z)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Véhicules par page</label>
                <select
                  value={form.page_size || "12"}
                  onChange={(e) => setField("page_size", e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:border-primary appearance-none cursor-pointer"
                >
                  <option value="4">4</option>
                  <option value="8">8</option>
                  <option value="12">12</option>
                  <option value="16">16</option>
                  <option value="20">20</option>
                  <option value="24">24</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Thème</label>
                <select
                  value={form.theme || "light"}
                  onChange={(e) => setField("theme", e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:border-primary appearance-none cursor-pointer"
                >
                  <option value="light">Clair</option>
                  <option value="dark">Sombre</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filters Tab */}
      {activeTab === "filters" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-slate-900">Filtres disponibles</h3>
            <p className="text-sm text-slate-500">Activez ou désactivez les filtres affichés sur la page Fleet.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {([
                { key: "show_lifestyle_filter" as const, label: "Filtre Lifestyle", desc: "Filtrer par style de vie (Business, Aventure...)" },
                { key: "show_category_filter" as const, label: "Filtre Catégorie", desc: "SUV, Sedan, Economy, etc." },
                { key: "show_transmission_filter" as const, label: "Filtre Transmission", desc: "Automatique / Manuelle" },
                { key: "show_fuel_filter" as const, label: "Filtre Carburant", desc: "Essence, Diesel, Hybride, Électrique" },
                { key: "show_seats_filter" as const, label: "Filtre Places", desc: "2, 4, 5, 7+ places" },
                { key: "show_price_filter" as const, label: "Filtre Prix", desc: "Fourchette de prix par jour" },
              ]).map(({ key, label, desc }) => (
                <button
                  key={key}
                  onClick={() => setField(key, !form[key])}
                  className={cn(
                    "flex items-center justify-between p-5 rounded-2xl border-2 transition-all text-left",
                    form[key]
                      ? "bg-primary/5 border-primary/30 shadow-sm"
                      : "bg-slate-50 border-slate-200 hover:border-slate-300"
                  )}
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900">{label}</p>
                    <p className="text-xs text-slate-500 mt-1">{desc}</p>
                  </div>
                  <div className={cn(
                    "w-11 h-6 rounded-full transition-all relative shrink-0 ml-4",
                    form[key] ? "bg-primary" : "bg-slate-300"
                  )}>
                    <div className={cn(
                      "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all",
                      form[key] ? "left-[22px]" : "left-0.5"
                    )} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
