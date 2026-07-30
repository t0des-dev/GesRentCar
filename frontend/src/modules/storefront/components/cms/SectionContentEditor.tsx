"use client";

import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import Image from "next/image";
import { 
  Plus, Trash2, GripVertical,
  Users, Car, Clock, Phone, Star, Shield, Award, MapPin,
  TrendingUp, Heart, Zap, Globe, Crown, CheckCircle, Headphones
} from "lucide-react";
import { cn } from "@/shared/utils";
import AssetUpload from "@/components/AssetUpload";
import { getImageUrl } from "@/shared/utils/image";

interface FieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "image" | "color" | "icon" | "color-palette" | "columns-picker" | "theme-picker" | "height-picker" | "text-size-picker" | "layout-style-picker" | "custom-color" | "fleet-layout-picker" | "toggle-picker" | "limit-picker";
  placeholder?: string;
}

interface ArrayFieldDef {
  key: string;
  label: string;
  type: "array";
  fields: FieldDef[];
  defaultItem: Record<string, string>;
}

type SectionFieldDef = FieldDef | ArrayFieldDef;

const STAT_ICONS = [
  { name: "Star", icon: Star, label: "Étoile" },
  { name: "Users", icon: Users, label: "Clients" },
  { name: "Car", icon: Car, label: "Véhicule" },
  { name: "Clock", icon: Clock, label: "Temps" },
  { name: "Phone", icon: Phone, label: "Support" },
  { name: "Shield", icon: Shield, label: "Assurance" },
  { name: "Award", icon: Award, label: "Excellence" },
  { name: "MapPin", icon: MapPin, label: "Agences" },
  { name: "TrendingUp", icon: TrendingUp, label: "Croissance" },
  { name: "Heart", icon: Heart, label: "Satisfaction" },
  { name: "Zap", icon: Zap, label: "Vitesse" },
  { name: "Globe", icon: Globe, label: "Monde" },
  { name: "Crown", icon: Crown, label: "Prestige" },
  { name: "CheckCircle", icon: CheckCircle, label: "Validé" },
  { name: "Headphones", icon: Headphones, label: "Concierge" },
];

const COLOR_PALETTE = [
  { id: "amber", name: "Doré", bg: "bg-amber-500" },
  { id: "emerald", name: "Émeraude", bg: "bg-emerald-500" },
  { id: "indigo", name: "Indigo", bg: "bg-indigo-500" },
  { id: "rose", name: "Rose", bg: "bg-rose-500" },
  { id: "blue", name: "Bleu Luxe", bg: "bg-blue-500" },
  { id: "purple", name: "Violet", bg: "bg-purple-500" },
  { id: "primary", name: "Marque", bg: "bg-slate-900" },
];

function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-5 sm:grid-cols-8 gap-1.5 p-2 bg-slate-100/90 rounded-2xl border border-slate-200">
      {STAT_ICONS.map((item) => {
        const Icon = item.icon;
        const isSelected = value === item.name;
        return (
          <button
            key={item.name}
            type="button"
            onClick={() => onChange(item.name)}
            title={item.label}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 border",
              isSelected
                ? "bg-slate-900 text-white border-slate-900 shadow-md scale-105"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            )}
          >
            <Icon size={18} />
            <span className="text-[8px] font-bold mt-1 truncate max-w-full">{item.name}</span>
          </button>
        );
      })}
    </div>
  );
}

function ColorPalettePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-1.5 p-2 bg-slate-100/90 rounded-2xl border border-slate-200 flex-wrap">
      {COLOR_PALETTE.map((c) => {
        const isSelected = value === c.id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onChange(c.id)}
            title={c.name}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[10px] font-bold transition-all",
              isSelected
                ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/20 scale-105"
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
            )}
          >
            <span className={`w-3 h-3 rounded-full ${c.bg} shrink-0 border border-black/10`} />
            <span>{c.name}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Visual Pickers ───────────────────────────────────────────────────────────

function ColumnsPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const options = [
    {
      val: "2",
      label: "2 Col.",
      preview: (
        <div className="flex gap-1 w-full">
          <div className="flex-1 h-5 rounded bg-current opacity-40" />
          <div className="flex-1 h-5 rounded bg-current opacity-40" />
        </div>
      ),
    },
    {
      val: "3",
      label: "3 Col.",
      preview: (
        <div className="flex gap-1 w-full">
          <div className="flex-1 h-5 rounded bg-current opacity-40" />
          <div className="flex-1 h-5 rounded bg-current opacity-40" />
          <div className="flex-1 h-5 rounded bg-current opacity-40" />
        </div>
      ),
    },
    {
      val: "4",
      label: "4 Col.",
      preview: (
        <div className="flex gap-0.5 w-full">
          <div className="flex-1 h-5 rounded bg-current opacity-40" />
          <div className="flex-1 h-5 rounded bg-current opacity-40" />
          <div className="flex-1 h-5 rounded bg-current opacity-40" />
          <div className="flex-1 h-5 rounded bg-current opacity-40" />
        </div>
      ),
    },
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map((opt) => {
        const isSelected = value === opt.val;
        return (
          <button
            key={opt.val}
            type="button"
            onClick={() => onChange(opt.val)}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200",
              isSelected
                ? "border-slate-900 bg-slate-900 text-white shadow-lg scale-[1.02]"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50"
            )}
          >
            {opt.preview}
            <span className="text-[10px] font-black uppercase tracking-wider">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function ThemePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Dark */}
      <button
        type="button"
        onClick={() => onChange("dark")}
        className={cn(
          "relative overflow-hidden rounded-2xl border-2 transition-all duration-200 group",
          value === "dark"
            ? "border-slate-900 ring-2 ring-slate-900/20 scale-[1.02]"
            : "border-slate-200 hover:border-slate-400"
        )}
      >
        <div className="bg-slate-950 p-4 flex flex-col gap-1.5">
          <div className="flex gap-1">
            <div className="flex-1 h-1.5 rounded bg-white/20" />
            <div className="flex-1 h-1.5 rounded bg-white/10" />
          </div>
          <div className="h-px bg-white/10" />
          <div className="flex justify-around pt-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-4 h-4 rounded bg-amber-400/70" />
                <div className="w-6 h-1 rounded bg-white/30" />
                <div className="w-4 h-0.5 rounded bg-white/20" />
              </div>
            ))}
          </div>
        </div>
        <div className="px-3 py-2 bg-slate-100 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">🌑 Dark</span>
          {value === "dark" && <span className="w-2 h-2 rounded-full bg-slate-900" />}
        </div>
      </button>

      {/* Light */}
      <button
        type="button"
        onClick={() => onChange("light")}
        className={cn(
          "relative overflow-hidden rounded-2xl border-2 transition-all duration-200 group",
          value === "light"
            ? "border-slate-900 ring-2 ring-slate-900/20 scale-[1.02]"
            : "border-slate-200 hover:border-slate-400"
        )}
      >
        <div className="bg-white p-4 flex flex-col gap-1.5">
          <div className="flex gap-1">
            <div className="flex-1 h-1.5 rounded bg-slate-200" />
            <div className="flex-1 h-1.5 rounded bg-slate-100" />
          </div>
          <div className="h-px bg-slate-100" />
          <div className="flex justify-around pt-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-4 h-4 rounded bg-slate-400" />
                <div className="w-6 h-1 rounded bg-slate-800" />
                <div className="w-4 h-0.5 rounded bg-slate-300" />
              </div>
            ))}
          </div>
        </div>
        <div className="px-3 py-2 bg-slate-100 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">☀️ Light</span>
          {value === "light" && <span className="w-2 h-2 rounded-full bg-slate-900" />}
        </div>
      </button>
    </div>
  );
}

function HeightPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const options = [
    { val: "small", label: "Compact", emoji: "▁", height: "h-3" },
    { val: "normal", label: "Normal", emoji: "▃", height: "h-5" },
    { val: "large", label: "Grand", emoji: "▇", height: "h-8" },
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map((opt) => {
        const isSelected = value === opt.val;
        return (
          <button
            key={opt.val}
            type="button"
            onClick={() => onChange(opt.val)}
            className={cn(
              "flex flex-col items-center justify-end gap-2 p-3 rounded-2xl border-2 transition-all duration-200 min-h-[70px]",
              isSelected
                ? "border-slate-900 bg-slate-900 text-white shadow-lg"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
            )}
          >
            <div className={cn(
              "w-full rounded",
              opt.height,
              isSelected ? "bg-white/30" : "bg-slate-300"
            )} />
            <span className="text-[10px] font-black uppercase tracking-wider">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function TextSizePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const options = [
    { val: "small", label: "S", size: "text-sm", desc: "Petit" },
    { val: "normal", label: "M", size: "text-base", desc: "Normal" },
    { val: "large", label: "L", size: "text-xl", desc: "Grand" },
    { val: "xl", label: "XL", size: "text-2xl", desc: "Très Grand" },
  ];
  return (
    <div className="grid grid-cols-4 gap-2">
      {options.map((opt) => {
        const isSelected = value === opt.val;
        return (
          <button
            key={opt.val}
            type="button"
            onClick={() => onChange(opt.val)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 p-3 rounded-2xl border-2 transition-all duration-200 min-h-[60px]",
              isSelected
                ? "border-slate-900 bg-slate-900 text-white shadow-lg scale-[1.02]"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
            )}
          >
            <span className={cn("font-black leading-none", opt.size)}>{opt.label}</span>
            <span className="text-[8px] font-bold uppercase tracking-widest opacity-70">{opt.desc}</span>
          </button>
        );
      })}
    </div>
  );
}

function LayoutStylePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const options = [
    {
      val: "banner",
      label: "Bannière",
      emoji: "🌃",
      preview: (
        <div className="w-full h-10 rounded-lg bg-slate-900 flex items-center justify-around px-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <div className="w-3 h-3 rounded bg-amber-400/70" />
              <div className="w-5 h-0.5 rounded bg-white/30" />
            </div>
          ))}
        </div>
      ),
    },
    {
      val: "cards",
      label: "Cartes",
      emoji: "🃏",
      preview: (
        <div className="w-full h-10 rounded-lg bg-slate-800 flex items-center justify-around px-2 gap-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-1 h-7 rounded-lg bg-white/10 border border-white/20 flex flex-col items-center justify-center gap-0.5 p-1">
              <div className="w-3 h-1.5 rounded bg-amber-400/60" />
              <div className="w-4 h-0.5 rounded bg-white/30" />
            </div>
          ))}
        </div>
      ),
    },
    {
      val: "minimal",
      label: "Minimal",
      emoji: "⬜",
      preview: (
        <div className="w-full h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-around px-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <div className="w-3 h-3 rounded bg-slate-300" />
              <div className="w-5 h-0.5 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      ),
    },
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map((opt) => {
        const isSelected = value === opt.val;
        return (
          <button
            key={opt.val}
            type="button"
            onClick={() => onChange(opt.val)}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200",
              isSelected
                ? "border-slate-900 bg-slate-900 text-white shadow-lg scale-[1.02]"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
            )}
          >
            {opt.preview}
            <span className="text-[10px] font-black uppercase tracking-wider">{opt.emoji} {opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function CustomColorPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const PRESETS = [
    "#f59e0b", "#10b981", "#6366f1", "#ef4444", "#3b82f6",
    "#a855f7", "#ec4899", "#0ea5e9", "#f97316", "#0f172a",
  ];
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            className={cn(
              "w-8 h-8 rounded-xl border-2 transition-all duration-150 hover:scale-110",
              value === c ? "border-slate-900 ring-2 ring-slate-900/30 scale-110" : "border-white/50"
            )}
            style={{ backgroundColor: c }}
            title={c}
          />
        ))}
        <div
          className={cn(
            "w-8 h-8 rounded-xl border-2 overflow-hidden relative",
            !PRESETS.includes(value) && value ? "border-slate-900 ring-2 ring-slate-900/30" : "border-slate-200"
          )}
        >
          <input
            type="color"
            value={value || "#f59e0b"}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-[-4px] w-[150%] h-[150%] cursor-pointer"
            title="Couleur personnalisée"
          />
        </div>
      </div>
      {value && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
          <div className="w-5 h-5 rounded-lg shrink-0 border border-black/10" style={{ backgroundColor: value }} />
          <span className="text-[11px] font-mono font-bold text-slate-700 uppercase">{value}</span>
          <button onClick={() => onChange("")} className="ml-auto text-[9px] text-slate-400 hover:text-red-500 font-bold">✕ Retirer</button>
        </div>
      )}
    </div>
  );
}

function FleetLayoutPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const options = [
    {
      val: "grid",
      label: "Grille Responsive",
      emoji: "▦",
      preview: (
        <div className="grid grid-cols-3 gap-1 w-full p-1 bg-slate-100 rounded-lg">
          <div className="h-6 rounded bg-slate-400/60" />
          <div className="h-6 rounded bg-slate-400/60" />
          <div className="h-6 rounded bg-slate-400/60" />
        </div>
      ),
    },
    {
      val: "carousel",
      label: "Carrousel Défilant",
      emoji: "🎠",
      preview: (
        <div className="flex gap-1 w-full p-1 bg-slate-100 rounded-lg overflow-hidden">
          <div className="w-1/2 shrink-0 h-6 rounded bg-amber-500/80" />
          <div className="w-1/2 shrink-0 h-6 rounded bg-slate-300" />
          <div className="w-1/2 shrink-0 h-6 rounded bg-slate-200" />
        </div>
      ),
    },
  ];
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((opt) => {
        const isSelected = (value || "grid") === opt.val;
        return (
          <button
            key={opt.val}
            type="button"
            onClick={() => onChange(opt.val)}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200",
              isSelected
                ? "border-slate-900 bg-slate-900 text-white shadow-lg scale-[1.02]"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
            )}
          >
            {opt.preview}
            <span className="text-[10px] font-black uppercase tracking-wider">{opt.emoji} {opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function TogglePicker({ value, onChange, labelOn = "Activé", labelOff = "Masqué" }: { value: string; onChange: (v: string) => void; labelOn?: string; labelOff?: string }) {
  const isTrue = value !== "false";
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={() => onChange("true")}
        className={cn(
          "flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl border-2 font-black text-[11px] uppercase tracking-wider transition-all",
          isTrue
            ? "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-500/20 scale-[1.02]"
            : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
        )}
      >
        <span className={cn("w-2 h-2 rounded-full", isTrue ? "bg-white animate-pulse" : "bg-slate-300")} />
        {labelOn}
      </button>
      <button
        type="button"
        onClick={() => onChange("false")}
        className={cn(
          "flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl border-2 font-black text-[11px] uppercase tracking-wider transition-all",
          !isTrue
            ? "border-slate-900 bg-slate-900 text-white shadow-md scale-[1.02]"
            : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
        )}
      >
        <span className={cn("w-2 h-2 rounded-full", !isTrue ? "bg-white" : "bg-slate-300")} />
        {labelOff}
      </button>
    </div>
  );
}

function LimitPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const options = ["3", "6", "9", "12", "18"];
  return (
    <div className="flex items-center gap-2">
      {options.map((num) => {
        const isSelected = (value || "6") === num;
        return (
          <button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            className={cn(
              "flex-1 py-2.5 rounded-xl border-2 font-black text-xs transition-all",
              isSelected
                ? "border-slate-900 bg-slate-900 text-white shadow-md scale-105"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
            )}
          >
            {num}
          </button>
        );
      })}
    </div>
  );
}

const sectionFields: Record<string, SectionFieldDef[]> = {
  hero: [
    { key: "badge", label: "Badge", type: "text" },
    { key: "title", label: "Titre", type: "text" },
    { key: "subtitle", label: "Sous-titre", type: "textarea" },
  ],
  why_us: [
    { key: "title", label: "Titre", type: "text" },
    { key: "subtitle", label: "Sous-titre", type: "textarea" },
  ],
  vibe: [
    { key: "eyebrow", label: "Sur-titre", type: "text" },
    { key: "columns", label: "Nombre de colonnes de cartes", type: "columns-picker" },
    { key: "title", label: "Titre principal", type: "text" },
    { key: "subtitle", label: "Sous-titre", type: "textarea" },
  ],
  faq: [
    { key: "badge", label: "Badge", type: "text" },
    { key: "title", label: "Titre", type: "text" },
    { key: "subtitle", label: "Sous-titre", type: "textarea" },
    { key: "contact_text", label: "Texte de contact", type: "text" },
    { key: "contact_link", label: "Lien de contact", type: "text" },
  ],
  experience: [
    { key: "eyebrow", label: "Sur-titre", type: "text" },
    { key: "title_line1", label: "Ligne 1 du titre", type: "text" },
    { key: "title_line2", label: "Ligne 2 du titre", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "cta_text", label: "Texte du bouton", type: "text" },
    { key: "cta_link", label: "Lien du bouton", type: "text" },
    { key: "right_label", label: "Étiquette droite", type: "text" },
  ],
  how_it_works: [
    { key: "badge", label: "Badge", type: "text" },
  ],
  cta_banner: [
    { key: "eyebrow", label: "Sur-titre", type: "text" },
    { key: "button_text", label: "Texte du bouton", type: "text" },
    { key: "button_link", label: "Lien du bouton", type: "text" },
  ],
  promotion_banner: [
    { key: "badge", label: "Badge", type: "text" },
    { key: "title_line1", label: "Ligne 1 du titre", type: "text" },
    { key: "title_line2", label: "Ligne 2 du titre", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "cta_text", label: "Texte du bouton", type: "text" },
    { key: "cta_link", label: "Lien du bouton", type: "text" },
    { key: "side_note", label: "Note latérale", type: "text" },
  ],
  testimonials: [
    { key: "badge", label: "Badge", type: "text" },
    { key: "heading", label: "Titre", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
  ],
  sticky_booking: [
    { key: "placeholder", label: "Placeholder", type: "text" },
    { key: "search_label", label: "Texte recherche", type: "text" },
  ],
  featured_vehicles: [
    { key: "eyebrow", label: "Sur-titre", type: "text" },
    { key: "title", label: "Titre principal", type: "text" },
    { key: "cta_text", label: "Texte du bouton catalogue", type: "text" },
    { key: "cta_link", label: "Lien du bouton catalogue", type: "text" },
    { key: "layout", label: "Mode d'affichage de la flotte", type: "fleet-layout-picker" },
    { key: "columns", label: "Nombre de colonnes en mode grille", type: "columns-picker" },
    { key: "limit", label: "Nombre max de véhicules affichés", type: "limit-picker" },
    { key: "show_filters", label: "Filtres par catégorie (Tous, SUV, Luxe...)", type: "toggle-picker" },
    { key: "filter_color", label: "Couleur d'accentuation des filtres", type: "custom-color" },
    { key: "dynamic_bg", label: "Ambiance / Fond dynamique au survol", type: "toggle-picker" },
    { key: "empty_heading", label: "Titre si aucun véhicule", type: "text" },
    { key: "empty_description", label: "Description si aucun véhicule", type: "textarea" },
  ],
  search_form: [
    { key: "location_label", label: "Étiquette destination", type: "text" },
    { key: "location_placeholder", label: "Placeholder destination", type: "text" },
    { key: "start_label", label: "Étiquette début", type: "text" },
    { key: "end_label", label: "Étiquette retour", type: "text" },
    { key: "search_button", label: "Texte bouton", type: "text" },
    { key: "fleet_link_text", label: "Texte lien flotte", type: "text" },
    { key: "fleet_link_href", label: "Lien flotte", type: "text" },
  ],
  concierge: [
    { key: "title", label: "Titre", type: "text" },
    { key: "text", label: "Texte", type: "textarea" },
    { key: "badge", label: "Badge", type: "text" },
  ],
  stats: [
    { key: "layout_style", label: "Style de mise en page", type: "layout-style-picker" },
    { key: "columns", label: "Nombre de colonnes", type: "columns-picker" },
    { key: "theme", label: "Thème", type: "theme-picker" },
    { key: "height", label: "Hauteur de la section", type: "height-picker" },
    { key: "text_size", label: "Taille du texte", type: "text-size-picker" },
    { key: "text_color", label: "Couleur d'accentuation", type: "custom-color" },
  ],
};

interface SectionContentEditorProps {
  sectionId: string;
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
  extraFields?: { key: string; label: string; value: string; onChange: (v: string) => void }[];
  faqItems?: { q: string; a: string }[];
  onFaqItemsChange?: (items: { q: string; a: string }[]) => void;
}

function StringField({ value, onChange, field }: { value: string; onChange: (v: string) => void; field: FieldDef }) {
  if (field.type === "icon") {
    return <IconPicker value={value ?? "Star"} onChange={onChange} />;
  }
  if (field.type === "color-palette") {
    return <ColorPalettePicker value={value ?? "amber"} onChange={onChange} />;
  }
  if (field.type === "columns-picker") {
    return <ColumnsPicker value={value ?? "4"} onChange={onChange} />;
  }
  if (field.type === "theme-picker") {
    return <ThemePicker value={value ?? "dark"} onChange={onChange} />;
  }
  if (field.type === "height-picker") {
    return <HeightPicker value={value ?? "normal"} onChange={onChange} />;
  }
  if (field.type === "text-size-picker") {
    return <TextSizePicker value={value ?? "normal"} onChange={onChange} />;
  }
  if (field.type === "layout-style-picker") {
    return <LayoutStylePicker value={value ?? "banner"} onChange={onChange} />;
  }
  if (field.type === "custom-color") {
    return <CustomColorPicker value={value ?? ""} onChange={onChange} />;
  }
  if (field.type === "fleet-layout-picker") {
    return <FleetLayoutPicker value={value ?? "grid"} onChange={onChange} />;
  }
  if (field.type === "toggle-picker") {
    return <TogglePicker value={value ?? "true"} onChange={onChange} />;
  }
  if (field.type === "limit-picker") {
    return <LimitPicker value={value ?? "6"} onChange={onChange} />;
  }
  if (field.type === "color") {
    return (
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-xl border-2 border-white shadow-sm shrink-0 overflow-hidden relative">
          <input
            type="color"
            value={value || "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-[-5px] w-[150%] h-[150%] cursor-pointer"
          />
        </div>
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 text-sm font-mono font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all uppercase"
        />
      </div>
    );
  }
  if (field.type === "image") {
    return (
      <AssetUpload
        type="hero"
        label=""
        currentUrl={value}
        onUploadComplete={onChange}
      />
    );
  }
  if (field.type === "textarea") {
    return (
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all resize-y min-h-[80px]"
        placeholder={field.placeholder ?? field.label}
      />
    );
  }
  return (
    <input
      type="text"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
      placeholder={field.placeholder ?? field.label}
    />
  );
}

function ReorderableArrayEditor({
  items,
  onChange,
  fields,
  defaultItem,
  thumbnailKey,
}: {
  items: Record<string, string>[];
  onChange: (items: Record<string, string>[]) => void;
  fields: FieldDef[];
  defaultItem: Record<string, string>;
  thumbnailKey?: string;
}) {
  return (
    <div className="space-y-3">
      <Reorder.Group axis="y" values={items} onReorder={onChange} className="space-y-3">
        {items.map((item, idx) => (
          <Reorder.Item key={idx} value={item} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3 relative cursor-grab active:cursor-grabbing">
            <div className="flex items-center gap-2 mb-2">
              <GripVertical size={16} className="text-slate-300 shrink-0" />
              {thumbnailKey && item[thumbnailKey] && (
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                  <Image src={getImageUrl(item[thumbnailKey]) || ""} width={40} height={40} className="w-full h-full object-cover" alt="" />
                </div>
              )}
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">#{idx + 1}</span>
              <button
                onClick={() => onChange(items.filter((_, i) => i !== idx))}
                className="ml-auto p-1.5 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
            {fields.map((f) => (
              <div key={f.key}>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">{f.label}</label>
                <StringField
                  field={f}
                  value={item[f.key] ?? ""}
                  onChange={(v) => {
                    const next = [...items];
                    next[idx] = { ...next[idx], [f.key]: v };
                    onChange(next);
                  }}
                />
              </div>
            ))}
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <button
        onClick={() => onChange([...items, { ...defaultItem }])}
        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-dashed border-slate-300 text-slate-500 hover:border-primary/40 hover:text-primary transition-all text-xs font-black uppercase tracking-widest"
      >
        <Plus size={14} /> Ajouter
      </button>
    </div>
  );
}

const sectionLabels: Record<string, string> = {
  hero: "Bannière Hero",
  why_us: "Nos Avantages",
  vibe: "Sélecteur d'Expérience",
  faq: "FAQ",
  experience: "Expérience Premium",
  how_it_works: "Comment ça marche",
  cta_banner: "Bannière CTA",
  promotion_banner: "Bannière Promotion",
  testimonials: "Témoignages",
  sticky_booking: "Réservation rapide",
  featured_vehicles: "Véhicules Vedettes",
  search_form: "Formulaire de recherche",
  concierge: "Bannière Concierge IA",
  stats: "Statistiques Clés",
};

export default function SectionContentEditor({ sectionId, content, onChange, extraFields, faqItems, onFaqItemsChange }: SectionContentEditorProps) {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const fields = sectionFields[sectionId];
  if (!fields) return <p className="text-sm text-slate-400 italic">Aucun champ éditable pour cette section.</p>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          {sectionLabels[sectionId] ?? sectionId}
        </h4>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          {(["fr", "en"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                lang === l ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {l === "fr" ? "FR" : "EN"}
            </button>
          ))}
        </div>
      </div>

      {extraFields?.map((ef) => (
        <div key={ef.key}>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">{ef.label}</label>
          {ef.key.includes("video") ? (
            <input
              type="text"
              value={ef.value ?? ""}
              onChange={(e) => ef.onChange(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
              placeholder="URL directe .mp4"
            />
          ) : ef.key === "hero_image" ? (
            <AssetUpload type="hero" label="" currentUrl={ef.value} onUploadComplete={ef.onChange} />
          ) : (
            <input
              type="text"
              value={ef.value ?? ""}
              onChange={(e) => ef.onChange(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
            />
          )}
        </div>
      ))}

      {fields.map((field) => {
        if (field.type === "array") return null;
        const val = content?.[field.key];
        const displayValue = typeof val === "object" && val !== null ? val[lang] ?? "" : val ?? "";
        return (
          <div key={field.key}>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
              {field.label}
            </label>
            <StringField
              field={field}
              value={displayValue}
              onChange={(v) => {
                if (typeof val === "object" && val !== null) {
                  onChange({ ...content, [field.key]: { ...val, [lang]: v } });
                } else {
                  onChange({ ...content, [field.key]: v });
                }
              }}
            />
          </div>
        );
      })}

      {/* Vibe — items array */}
      {sectionId === "vibe" && (
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Expériences (Vibes)</label>
          <ReorderableArrayEditor
            items={content?.items ?? []}
            onChange={(items) => onChange({ ...content, items })}
            fields={[
              { key: "id", label: "ID (unique)", type: "text" },
              { key: "title", label: "Titre", type: "text" },
              { key: "subtitle", label: "Sous-titre", type: "text" },
              { key: "icon", label: "Icône Visuelle", type: "icon" },
              { key: "image", label: "Image (URL)", type: "image" },
              { key: "color_from", label: "Couleur d'accentuation", type: "custom-color" },
              { key: "lifestyle", label: "Type / Catégorie", type: "text" },
              { key: "link", label: "Lien personnalisé", type: "text" },
            ]}
            defaultItem={{ id: "", title: "", subtitle: "", icon: "Shield", image: "", color_from: "amber", color_via: "amber", lifestyle: "", link: "" }}
            thumbnailKey="image"
          />
        </div>
      )}

      {/* Hero — benefits array */}
      {sectionId === "hero" && (
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Avantages Hero</label>
          <ReorderableArrayEditor
            items={(content?.benefits ?? []).map((b: any, i: number) => ({ ...b, _idx: String(i) }))}
            onChange={(items) => onChange({ ...content, benefits: items })}
            fields={[
              { key: "icon", label: "Icône Visuelle", type: "icon" },
              { key: "text", label: "Texte", type: "text" },
            ]}
            defaultItem={{ icon: "CheckCircle", text: "" }}
          />
        </div>
      )}

      {/* Why Us — features array */}
      {sectionId === "why_us" && (
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Cartes d&apos;avantages</label>
          <ReorderableArrayEditor
            items={content?.features ?? []}
            onChange={(items) => onChange({ ...content, features: items })}
            fields={[
              { key: "icon", label: "Icône Visuelle", type: "icon" },
              { key: "image", label: "Ou Image (URL)", type: "image" },
              { key: "title", label: "Titre", type: "text" },
              { key: "desc", label: "Description", type: "textarea" },
            ]}
            defaultItem={{ icon: "Star", image: "", title: "", desc: "" }}
          />
        </div>
      )}

      {/* Experience — stats array */}
      {sectionId === "experience" && (
        <>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Statistiques</label>
            <ReorderableArrayEditor
              items={content?.stats ?? []}
              onChange={(items) => onChange({ ...content, stats: items })}
              fields={[
                { key: "value", label: "Valeur", type: "text" },
                { key: "label", label: "Étiquette", type: "text" },
              ]}
              defaultItem={{ value: "", label: "" }}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
              Cartes d&apos;expérience <span className="text-slate-300 normal-case">(Lifestyle Items)</span>
            </label>
            <ReorderableArrayEditor
              items={content?.lifestyles ?? []}
              onChange={(items) => onChange({ ...content, lifestyles: items })}
              fields={[
                { key: "id", label: "ID", type: "text" },
                { key: "title", label: "Titre", type: "text" },
                { key: "subtitle", label: "Sous-titre", type: "text" },
                { key: "icon", label: "Icône Visuelle", type: "icon" },
                { key: "image", label: "Image (URL)", type: "image" },
                { key: "color_from", label: "Couleur de départ", type: "custom-color" },
                { key: "lifestyle", label: "Type lifestyle", type: "text" },
                { key: "cta_text", label: "Texte CTA", type: "text" },
              ]}
              defaultItem={{
                id: "", title: "", subtitle: "", icon: "Shield",
                image: "", color_from: "blue-400", color_via: "blue-600",
                lifestyle: "", cta_text: "",
              }}
              thumbnailKey="image"
            />
          </div>
        </>
      )}

      {/* How it works — steps array */}
      {sectionId === "how_it_works" && (
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Étapes</label>
          <ReorderableArrayEditor
            items={content?.steps ?? []}
            onChange={(items) => onChange({ ...content, steps: items })}
            fields={[
              { key: "num", label: "Numéro", type: "text" },
              { key: "title", label: "Titre", type: "text" },
              { key: "desc", label: "Description", type: "textarea" },
            ]}
            defaultItem={{ num: "", title: "", desc: "" }}
          />
        </div>
      )}

      {/* Promotion banner — footer_items array */}
      {sectionId === "promotion_banner" && (
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Éléments de pied</label>
          <ReorderableArrayEditor
            items={(content?.footer_items ?? []).map((s: string, i: number) => ({ _val: s, _idx: String(i) }))}
            onChange={(items) => onChange({ ...content, footer_items: items.map((i: any) => i._val) })}
            fields={[{ key: "_val", label: "Élément", type: "text" }]}
            defaultItem={{ _val: "" }}
          />
        </div>
      )}



      {/* Testimonials — items array */}
      {sectionId === "testimonials" && (
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Avis Clients</label>
          <ReorderableArrayEditor
            items={content?.items ?? []}
            onChange={(items) => onChange({ ...content, items })}
            fields={[
              { key: "name", label: "Nom du client", type: "text" },
              { key: "role", label: "Rôle / Titre", type: "text" },
              { key: "content", label: "Témoignage", type: "textarea" },
              { key: "image", label: "Image (URL)", type: "image" },
            ]}
            defaultItem={{ name: "", role: "Client", content: "", image: "" }}
            thumbnailKey="image"
          />
        </div>
      )}

      {/* Stats — items array */}
      {sectionId === "stats" && (
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Statistiques</label>
          <ReorderableArrayEditor
            items={content?.items ?? []}
            onChange={(items) => onChange({ ...content, items })}
            fields={[
              { key: "id", label: "ID (unique)", type: "text" },
              { key: "value", label: "Valeur (ex: 2400+)", type: "text" },
              { key: "label", label: "Étiquette (ex: Clients satisfaits)", type: "text" },
              { key: "description", label: "Sous-texte / Note (ex: Note 4.9/5)", type: "text" },
              { key: "icon", label: "Icône Visuelle", type: "icon" },
              { key: "color", label: "Palette de Couleur / Accentuation", type: "color-palette" },
            ]}
            defaultItem={{ id: "", label: "", value: "", description: "", icon: "Star", color: "amber" }}
          />
        </div>
      )}

      {/* FAQ — items array */}
      {sectionId === "faq" && faqItems && onFaqItemsChange && (
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Questions Fréquentes</label>
          <ReorderableArrayEditor
            items={faqItems as unknown as Record<string, string>[]}
            onChange={(items) => onFaqItemsChange(items as unknown as { q: string; a: string }[])}
            fields={[
              { key: "q", label: "Question", type: "text" },
              { key: "a", label: "Réponse", type: "textarea" },
            ]}
            defaultItem={{ q: "", a: "" }}
          />
        </div>
      )}
    </motion.div>
  );
}
