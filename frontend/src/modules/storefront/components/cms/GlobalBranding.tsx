"use client";

import { motion } from "framer-motion";
import { 
  Type, Sliders, CheckCircle2, Sparkles, Image as ImageIcon, 
  Palette, Eye, Check, RefreshCw, Wand2, Shield, Layers
} from "lucide-react";
import Image from "next/image";
import AssetUpload from "@/components/AssetUpload";
import { cn } from "@/shared/utils";
import { getImageUrl } from "@/shared/utils/image";
import type { StorefrontForm } from "@/types/storefront";

interface GlobalBrandingProps {
  form: StorefrontForm;
  setForm: (v: StorefrontForm) => void;
}

const COLOR_PRESETS = [
  { name: "Or Prestige", hex: "#D4AF37" },
  { name: "Indigo Modern", hex: "#6366F1" },
  { name: "Vert Émeraude", hex: "#10B981" },
  { name: "Bleu Royal", hex: "#2563EB" },
  { name: "Rouge Carmine", hex: "#EF4444" },
  { name: "Slate Obsidienne", hex: "#0F172A" },
  { name: "Violet Royal", hex: "#8B5CF6" },
  { name: "Ambre Warm", hex: "#F59E0B" },
];

const FONTS = [
  { id: "Inter", name: "Inter", category: "Sans-Serif Modern", sample: "Drive Morocco with confidence" },
  { id: "Playfair Display", name: "Playfair Display", category: "Serif Élégant & Luxe", sample: "Drive Morocco with confidence" },
  { id: "Outfit", name: "Outfit", category: "Geometric & Tech", sample: "Drive Morocco with confidence" },
  { id: "Plus Jakarta Sans", name: "Plus Jakarta Sans", category: "Clean & Corporate", sample: "Drive Morocco with confidence" },
  { id: "Montserrat", name: "Montserrat", category: "Bold & Premium", sample: "Drive Morocco with confidence" },
];

const BORDER_RADII = [
  { id: "0px", label: "Carré", previewClass: "rounded-none" },
  { id: "12px", label: "Arrondi", previewClass: "rounded-xl" },
  { id: "24px", label: "Premium", previewClass: "rounded-3xl" },
  { id: "40px", label: "Pillule", previewClass: "rounded-full" },
];

const BUTTON_STYLES = [
  { id: "square", label: "Standard (Square)", previewClass: "rounded-none" },
  { id: "rounded", label: "Arrondi (Rounded)", previewClass: "rounded-xl" },
  { id: "pill", label: "Pillule (Full Pill)", previewClass: "rounded-full" },
];

export default function GlobalBranding({ form, setForm }: GlobalBrandingProps) {
  const themes = [
    {
      id: "luxury",
      name: "Luxury Elite",
      desc: "Or & Noir • Prestige",
      color: "#D4AF37",
      font: "Playfair Display",
      radius: "0px",
      buttonStyle: "square",
    },
    {
      id: "eco",
      name: "Modern Eco",
      desc: "Vert Émeraude • Arrondi",
      color: "#10B981",
      font: "Outfit",
      radius: "40px",
      buttonStyle: "pill",
    },
    {
      id: "corporate",
      name: "Corporate Blue",
      desc: "Bleu Roi • Professionnel",
      color: "#2563EB",
      font: "Inter",
      radius: "12px",
      buttonStyle: "rounded",
    },
    {
      id: "sport",
      name: "Sport Racing",
      desc: "Rouge Carmine • Dynamique",
      color: "#EF4444",
      font: "Plus Jakarta Sans",
      radius: "8px",
      buttonStyle: "rounded",
    },
  ];

  const applyTheme = (t: (typeof themes)[0]) => {
    setForm({
      ...form,
      primary_color: t.color,
      theme_config: {
        ...form.theme_config,
        border_radius: t.radius,
        button_style: t.buttonStyle,
        font_family: t.font,
      },
    });
  };

  const isThemeActive = (t: (typeof themes)[0]) => {
    return (
      form.primary_color === t.color &&
      form.theme_config?.border_radius === t.radius &&
      (form.theme_config?.font_family || "Inter") === t.font
    );
  };

  const primaryColor = form.primary_color || "#6366F1";
  const fontFamily = form.theme_config?.font_family || "Inter";
  const borderRadius = form.theme_config?.border_radius || "24px";
  const buttonStyle = form.theme_config?.button_style || "pill";

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
      
      {/* 🚀 Dynamic Live Preview Banner */}
      <div className="bg-slate-950 p-8 rounded-[40px] shadow-2xl border border-slate-800 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-primary/20 text-primary flex items-center justify-center border border-primary/30">
              <Eye size={18} />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">Aperçu Visuel en Temps Réel</h3>
              <p className="text-[11px] text-slate-400 font-medium">Rendu en direct du Header & de la Marque</p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/30">
            Live Preview
          </span>
        </div>

        {/* Live Header Component Preview */}
        <div 
          className="bg-slate-900/90 backdrop-blur-md rounded-3xl p-5 border border-slate-800/80 shadow-inner space-y-4 relative z-10"
          style={{ fontFamily }}
        >
          <div className="flex items-center justify-between gap-4">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3">
              {form.logo_url ? (
                <div
                  className="overflow-hidden flex items-center justify-center transition-all shadow-md shrink-0"
                  style={{
                    width: form.logo_config?.width || "40px",
                    height: form.logo_config?.height || "40px",
                    borderRadius: form.logo_config?.radius || "10px",
                    backgroundColor: form.logo_config?.transparent_bg ? "transparent" : form.logo_config?.background || "#6366f1",
                    opacity: form.logo_config?.background_opacity ?? 1,
                  }}
                >
                  <Image
                    src={getImageUrl(form.logo_url) || ""}
                    alt="Logo Preview"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-md"
                  style={{ backgroundColor: primaryColor }}
                >
                  {(form.name || "V")[0]?.toUpperCase()}
                </div>
              )}

              <div>
                <h4 className="text-base font-bold text-white tracking-tight leading-none">
                  {form.name || "Vectoria Rent Car"}
                </h4>
                <p className="text-[11px] text-slate-400 font-medium mt-1">
                  {form.slogan || "Premium Car Rental Experience"}
                </p>
              </div>
            </div>

            {/* CTA Button Sample */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="px-5 py-2.5 text-xs font-bold text-white transition-all shadow-lg hover:scale-105"
                style={{
                  backgroundColor: primaryColor,
                  borderRadius: buttonStyle === "square" ? "0px" : buttonStyle === "rounded" ? "12px" : "9999px",
                }}
              >
                Réserver maintenant
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🪄 Magic Preset Themes */}
      <div className="bg-slate-900 p-8 rounded-[40px] shadow-xl text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Wand2 size={20} className="text-amber-400" />
            <div>
              <h3 className="text-lg font-black">Thèmes Prédéfinis</h3>
              <p className="text-xs text-slate-400">Appliquez un style visuel harmonieux en 1 seul clic</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {themes.map((t) => {
            const active = isThemeActive(t);
            return (
              <button
                key={t.id}
                type="button"
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

                <span className="block font-bold text-lg mb-1" style={{ color: t.color, fontFamily: t.font }}>
                  {t.name}
                </span>
                <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-6">
                  {t.desc}
                </span>

                <div
                  className="w-full py-2.5 text-center text-[10px] uppercase tracking-wider font-black transition-all text-white shadow-sm"
                  style={{
                    backgroundColor: t.color,
                    borderRadius: t.radius,
                    fontFamily: t.font,
                  }}
                >
                  Appliquer le thème
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 🏷️ Identité & Marque Main Form */}
      <div className="bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Type size={20} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Identité & Marque</h3>
            <p className="text-xs text-slate-400">Nom, Slogan, Logo et Médias d&apos;accueil</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Nom de l&apos;Agence
              </label>
              <input
                type="text"
                value={form.name ?? ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="ex: Vectoria Rent Car"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all text-slate-900"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Slogan Principal
              </label>
              <input
                type="text"
                value={form.slogan ?? ""}
                onChange={(e) => setForm({ ...form, slogan: e.target.value })}
                placeholder="ex: Premium Car Rental Experience"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AssetUpload
              type="logo"
              label="Logo de l'Agence"
              currentUrl={form.logo_url}
              onUploadComplete={(url) => setForm({ ...form, logo_url: url })}
            />
            <AssetUpload
              type="hero"
              label="Image de repli (Poster)"
              currentUrl={form.hero_image_url}
              onUploadComplete={(url) => setForm({ ...form, hero_image_url: url })}
            />
          </div>

          {/* Logo Advanced Settings */}
          {form.logo_url && (
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-5">
              <div className="flex items-center gap-2">
                <Sliders size={16} className="text-primary" />
                <p className="text-xs font-black uppercase tracking-widest text-slate-800">
                  Paramètres Avancés du Logo
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500">Largeur</label>
                  <input
                    type="text"
                    value={form.logo_config?.width ?? "40px"}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        logo_config: { ...form.logo_config, width: e.target.value },
                      })
                    }
                    placeholder="40px"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:border-primary transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500">Hauteur</label>
                  <input
                    type="text"
                    value={form.logo_config?.height ?? "40px"}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        logo_config: { ...form.logo_config, height: e.target.value },
                      })
                    }
                    placeholder="40px"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:border-primary transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500">Rayon (Radius)</label>
                  <input
                    type="text"
                    value={form.logo_config?.radius ?? "10px"}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        logo_config: { ...form.logo_config, radius: e.target.value },
                      })
                    }
                    placeholder="10px"
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
                        onChange={(e) =>
                          setForm({
                            ...form,
                            logo_config: { ...form.logo_config, background: e.target.value },
                          })
                        }
                        className="absolute inset-[-5px] w-[150%] h-[150%] cursor-pointer"
                      />
                    </div>
                    <input
                      type="text"
                      value={form.logo_config?.background ?? ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          logo_config: { ...form.logo_config, background: e.target.value },
                        })
                      }
                      placeholder="#6366f1"
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-mono font-bold outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-200/60">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.logo_config?.transparent_bg === true}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        logo_config: {
                          ...form.logo_config,
                          transparent_bg: e.target.checked,
                          background_opacity: e.target.checked ? 0 : 1,
                        },
                      })
                    }
                    className="rounded border-slate-300 text-primary focus:ring-primary/50 cursor-pointer w-4 h-4"
                  />
                  <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                    Fond transparent
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.logo_config?.show_name !== false}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        logo_config: { ...form.logo_config, show_name: e.target.checked },
                      })
                    }
                    className="rounded border-slate-300 text-primary focus:ring-primary/50 cursor-pointer w-4 h-4"
                  />
                  <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                    Afficher le nom à côté du logo
                  </span>
                </label>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              URL Vidéo Hero (MP4)
            </label>
            <input
              type="text"
              placeholder="Lien direct vers une vidéo .mp4"
              value={form.hero_video_url ?? ""}
              onChange={(e) => setForm({ ...form, hero_video_url: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all text-slate-900"
            />
          </div>

          {/* Couleur Signature Palette */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Couleur Signature de l&apos;Agence
            </label>
            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-2xl border-2 border-white shadow-lg shrink-0 overflow-hidden relative">
                <input
                  type="color"
                  value={form.primary_color ?? "#6366f1"}
                  onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                  className="absolute inset-[-5px] w-[150%] h-[150%] cursor-pointer"
                />
              </div>
              <input
                type="text"
                value={form.primary_color ?? ""}
                onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                placeholder="#6366f1"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-mono font-bold uppercase outline-none focus:bg-white focus:border-primary transition-all text-slate-900"
              />
            </div>

            {/* Presets Palette */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-1">
                Nuancier :
              </span>
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.hex}
                  type="button"
                  title={preset.name}
                  onClick={() => setForm({ ...form, primary_color: preset.hex })}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                    form.primary_color === preset.hex
                      ? "border-slate-900 scale-125 shadow-md ring-2 ring-slate-900/20"
                      : "border-white shadow-sm hover:scale-110"
                  }`}
                  style={{ backgroundColor: preset.hex }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 🎨 Design du Système */}
      <div className="bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Sliders size={20} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Design du Système</h3>
            <p className="text-xs text-slate-400">Rayon, Typographie et Style des Boutons</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Rayon des bordures (Radius) Visual Cards */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Rayon des Bordures (Border Radius)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {BORDER_RADII.map((r) => {
                const isSelected = (form.theme_config?.border_radius || "24px") === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        theme_config: { ...form.theme_config, border_radius: r.id },
                      })
                    }
                    className={cn(
                      "p-4 border-2 flex flex-col items-center gap-2 transition-all text-center group",
                      r.previewClass,
                      isSelected
                        ? "border-primary bg-primary/5 text-primary shadow-md"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100"
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 border-2 border-current transition-all",
                        r.previewClass,
                        isSelected ? "bg-primary/20" : "bg-white"
                      )}
                    />
                    <span className="text-xs font-bold">{r.label}</span>
                    <span className="text-[9px] font-mono text-slate-400">{r.id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Style de Bouton Visual Cards */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Style de Bouton
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {BUTTON_STYLES.map((b) => {
                const isSelected = (form.theme_config?.button_style || "pill") === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        theme_config: { ...form.theme_config, button_style: b.id },
                      })
                    }
                    className={cn(
                      "p-4 border-2 rounded-2xl flex flex-col items-center gap-3 transition-all text-center",
                      isSelected
                        ? "border-primary bg-primary/5 text-primary shadow-md"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100"
                    )}
                  >
                    <div
                      className={cn(
                        "px-5 py-2 text-xs font-bold text-white shadow-sm transition-all",
                        b.previewClass
                      )}
                      style={{ backgroundColor: primaryColor }}
                    >
                      Bouton Exemple
                    </div>
                    <span className="text-xs font-bold">{b.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Typographie Globale Visual Cards */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Typographie Globale
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {FONTS.map((font) => {
                const isSelected = fontFamily === font.id;
                return (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        theme_config: { ...form.theme_config, font_family: font.id },
                      })
                    }
                    className={cn(
                      "p-5 rounded-2xl border-2 text-left transition-all relative overflow-hidden group",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
                    )}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 text-primary">
                        <Check size={16} strokeWidth={3} />
                      </div>
                    )}
                    <span className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1">
                      {font.category}
                    </span>
                    <span
                      className="block text-lg font-bold text-slate-900 mb-2"
                      style={{ fontFamily: font.id }}
                    >
                      {font.name}
                    </span>
                    <p
                      className="text-xs text-slate-500 truncate"
                      style={{ fontFamily: font.id }}
                    >
                      {font.sample}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Effet Glassmorphism Toggle */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80">
            <label className="flex items-center justify-between cursor-pointer group">
              <div className="space-y-1">
                <span className="text-sm font-black text-slate-900 block">Effet Glassmorphism</span>
                <p className="text-xs text-slate-500 font-medium">
                  Applique un effet de transparence floutée sur la barre de navigation et les cartes.
                </p>
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={form.theme_config?.glassmorphism !== false}
                onChange={(e) =>
                  setForm({
                    ...form,
                    theme_config: { ...form.theme_config, glassmorphism: e.target.checked },
                  })
                }
              />
              <div
                className={cn(
                  "w-12 h-6 rounded-full p-1 transition-all duration-300 shrink-0",
                  form.theme_config?.glassmorphism !== false ? "bg-primary" : "bg-slate-300"
                )}
              >
                <div
                  className={cn(
                    "w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm",
                    form.theme_config?.glassmorphism !== false ? "translate-x-6" : "translate-x-0"
                  )}
                />
              </div>
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
