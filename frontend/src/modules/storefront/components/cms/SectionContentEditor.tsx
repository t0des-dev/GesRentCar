"use client";

import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import Image from "next/image";
import { Plus, Trash2, GripVertical, LayoutGrid, Sliders, Grid2x2, Grid3x3, Check, X, Sparkles } from "lucide-react";
import AssetUpload from "@/components/AssetUpload";
import { getImageUrl } from "@/shared/utils/image";
import IconPicker from "./IconPicker";

interface OptionItem {
  value: string;
  label: string;
  icon?: string;
}

interface FieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "image" | "color" | "icon" | "segmented" | "toggle";
  placeholder?: string;
  options?: OptionItem[];
}

interface ArrayFieldDef {
  key: string;
  label: string;
  type: "array";
  fields: FieldDef[];
  defaultItem: Record<string, string>;
}

type SectionFieldDef = FieldDef | ArrayFieldDef;

const FIELD_ICONS: Record<string, any> = {
  LayoutGrid, Sliders, Grid2x2, Grid3x3, Check, X, Sparkles
};

const COLOR_PRESETS = [
  { name: "Navy Sombre", hex: "#182232" },
  { name: "Indigo", hex: "#6366f1" },
  { name: "Émeraude", hex: "#059669" },
  { name: "Rouge", hex: "#dc2626" },
  { name: "Or Prestige", hex: "#c39a4d" },
  { name: "Bleu Royal", hex: "#2563eb" },
  { name: "Slate", hex: "#0f172a" },
  { name: "Violet", hex: "#8b5cf6" },
];

const sectionFields: Record<string, SectionFieldDef[]> = {
  hero: [
    { key: "badge", label: "Badge", type: "text" },
    { key: "title", label: "Titre", type: "text" },
    { key: "subtitle", label: "Sous-titre", type: "textarea" },
    { key: "cta_text", label: "Texte du bouton CTA", type: "text" },
    { key: "cta_link", label: "Lien du bouton CTA", type: "text" },
    { key: "rating_text", label: "Texte de réputation / Note", type: "text" },
  ],
  why_us: [
    { key: "title", label: "Titre", type: "text" },
    { key: "subtitle", label: "Sous-titre", type: "textarea" },
  ],
  vibe: [
    { key: "eyebrow", label: "Sur-titre", type: "text" },
    { key: "columns", label: "Colonnes (2, 3 ou 4)", type: "text" },
    { key: "title", label: "Titre", type: "text" },
    { key: "subtitle", label: "Sous-titre", type: "textarea" },
  ],
  lifestyle: [
    { key: "title", label: "Titre", type: "text" },
    { key: "subtitle", label: "Sous-titre", type: "text" },
    { key: "text", label: "Texte", type: "textarea" },
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
  map: [
    { key: "badge", label: "Badge", type: "text" },
    { key: "slogan", label: "Slogan", type: "textarea" },
  ],
  comparator: [
    { key: "badge", label: "Badge", type: "text" },
    { key: "title", label: "Titre", type: "text" },
    { key: "subtitle", label: "Sous-titre", type: "textarea" },
    { key: "vs_label", label: "Étiquette VS", type: "text" },
  ],
  sticky_booking: [
    { key: "placeholder", label: "Placeholder", type: "text" },
    { key: "search_label", label: "Texte recherche", type: "text" },
  ],
  featured_vehicles: [
    { key: "eyebrow", label: "Sur-titre", type: "text" },
    { key: "title", label: "Titre", type: "text" },
    { key: "cta_text", label: "Texte du bouton", type: "text" },
    { key: "cta_link", label: "Lien du bouton", type: "text" },
    {
      key: "layout",
      label: "Mise en page d'affichage",
      type: "segmented",
      options: [
        { value: "grid", label: "Grille", icon: "LayoutGrid" },
        { value: "carousel", label: "Carrousel", icon: "Sliders" },
      ],
    },
    {
      key: "columns",
      label: "Nombre de colonnes",
      type: "segmented",
      options: [
        { value: "2", label: "2 Colonnes", icon: "Grid2x2" },
        { value: "3", label: "3 Colonnes", icon: "LayoutGrid" },
        { value: "4", label: "4 Colonnes", icon: "Grid3x3" },
      ],
    },
    { key: "limit", label: "Nombre max de véhicules", type: "text", placeholder: "6" },
    {
      key: "show_filters",
      label: "Afficher les filtres par catégorie",
      type: "toggle",
      options: [
        { value: "true", label: "Oui (Affichés)", icon: "Check" },
        { value: "false", label: "Non (Masqués)", icon: "X" },
      ],
    },
    { key: "filter_color", label: "Couleur des filtres actifs", type: "color" },
    {
      key: "dynamic_bg",
      label: "Fond dynamique au survol",
      type: "toggle",
      options: [
        { value: "true", label: "Activé", icon: "Check" },
        { value: "false", label: "Désactivé", icon: "X" },
      ],
    },
    { key: "loading_text", label: "Texte de chargement", type: "text" },
    { key: "empty_heading", label: "Titre si aucun véhicule", type: "text" },
    { key: "empty_description", label: "Description si aucun véhicule", type: "textarea" },
  ],
  search_form: [
    { key: "form_title", label: "Titre du formulaire", type: "text" },
    { key: "form_subtitle", label: "Sous-titre du formulaire", type: "text" },
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
    { key: "columns", label: "Colonnes (2, 3 ou 4)", type: "text" },
    { key: "theme", label: "Thème (dark ou light)", type: "text" },
    { key: "height", label: "Hauteur (small, normal, large)", type: "text" },
    { key: "text_size", label: "Taille texte (small, normal, large, xl)", type: "text" },
    { key: "text_color", label: "Couleur personnalisée (optionnel)", type: "color" },
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
  if (field.type === "segmented") {
    const options = field.options || [];
    const currentValue = value || options[0]?.value || "";
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
        {options.map((opt) => {
          const isSelected = currentValue === opt.value;
          const IconComp = opt.icon ? FIELD_ICONS[opt.icon] : null;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                isSelected
                  ? "bg-slate-900 text-white shadow-md shadow-slate-950/20 scale-[1.02]"
                  : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {IconComp && <IconComp size={15} strokeWidth={2} />}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  if (field.type === "toggle") {
    const options = field.options || [
      { value: "true", label: "Oui", icon: "Check" },
      { value: "false", label: "Non", icon: "X" },
    ];
    const currentValue = value === "false" ? "false" : "true";
    return (
      <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
        {options.map((opt) => {
          const isSelected = currentValue === opt.value;
          const IconComp = opt.icon ? FIELD_ICONS[opt.icon] : null;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                isSelected
                  ? opt.value === "true"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-slate-800 text-white shadow-md shadow-slate-800/20"
                  : "bg-white text-slate-500 border border-slate-200/80 hover:bg-slate-100"
              }`}
            >
              {IconComp && <IconComp size={15} strokeWidth={2.2} />}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  if (field.type === "color") {
    return (
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="w-11 h-11 rounded-2xl border-2 border-white shadow-md shrink-0 overflow-hidden relative">
            <input
              type="color"
              value={value || "#182232"}
              onChange={(e) => onChange(e.target.value)}
              className="absolute inset-[-5px] w-[150%] h-[150%] cursor-pointer"
            />
          </div>
          <input
            type="text"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 text-sm font-mono font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all uppercase"
            placeholder="#182232"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-1">Palette :</span>
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.hex}
              type="button"
              title={preset.name}
              onClick={() => onChange(preset.hex)}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
                value === preset.hex ? "border-primary scale-125 shadow-md ring-2 ring-primary/20" : "border-white shadow-sm hover:scale-110"
              }`}
              style={{ backgroundColor: preset.hex }}
            />
          ))}
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-[10px] text-slate-400 hover:text-slate-600 underline ml-auto font-medium"
            >
              Par défaut
            </button>
          )}
        </div>
      </div>
    );
  }
  if (field.type === "icon") {
    return <IconPicker value={value ?? ""} onChange={onChange} />;
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
  lifestyle: "Galerie Lifestyle",
  faq: "FAQ",
  experience: "Expérience Premium",
  how_it_works: "Comment ça marche",
  cta_banner: "Bannière CTA",
  promotion_banner: "Bannière Promotion",
  testimonials: "Témoignages",
  map: "Localisation",
  comparator: "Comparateur",
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
              { key: "icon", label: "Icône", type: "icon" },
              { key: "image", label: "Image", type: "image" },
              { key: "color_from", label: "Couleur début (ex: blue-400)", type: "text" },
              { key: "color_via", label: "Couleur milieu (ex: blue-600)", type: "text" },
              { key: "lifestyle", label: "Lifestyle (ex: business)", type: "text" },
              { key: "link", label: "Lien personnalisé", type: "text" },
            ]}
            defaultItem={{ id: "", title: "", subtitle: "", icon: "ShieldCheck", image: "", color_from: "primary", color_via: "primary", lifestyle: "", link: "" }}
            thumbnailKey="image"
          />
        </div>
      )}

      {/* Hero — benefits array */}
      {sectionId === "hero" && (
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Avantages</label>
          <ReorderableArrayEditor
            items={(content?.benefits ?? []).map((b: any, i: number) => ({ ...b, _idx: String(i) }))}
            onChange={(items) => onChange({ ...content, benefits: items })}
            fields={[
              { key: "icon", label: "Icône", type: "icon" },
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
              { key: "icon", label: "Icône", type: "icon" },
              { key: "image", label: "Ou Image (URL de l'image)", type: "image" },
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
                { key: "icon", label: "Icône", type: "icon" },
                { key: "image", label: "URL image", type: "text" },
                { key: "color_from", label: "Couleur début (ex: blue-400)", type: "text" },
                { key: "color_via", label: "Couleur milieu (ex: blue-600)", type: "text" },
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

      {/* Map — locations array */}
      {sectionId === "map" && (
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Localisations</label>
          <ReorderableArrayEditor
            items={content?.locations ?? []}
            onChange={(items) => onChange({ ...content, locations: items })}
            fields={[
              { key: "city", label: "Ville", type: "text" },
              { key: "car", label: "Véhicule", type: "text" },
              { key: "user", label: "Utilisateur", type: "text" },
            ]}
            defaultItem={{ city: "", car: "", user: "" }}
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

      {/* Lifestyle gallery — images array with reorder + thumbnails */}
      {sectionId === "lifestyle" && (
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Images</label>
          <ReorderableArrayEditor
            items={content?.images ?? []}
            onChange={(items) => onChange({ ...content, images: items })}
            fields={[
              { key: "url", label: "URL image", type: "image" },
              { key: "speed", label: "Vitesse défilement (ex: 0.15)", type: "text" },
              { key: "className", label: "Classe CSS (taille et grille)", type: "text" },
            ]}
            defaultItem={{ url: "", speed: "0.1", className: "col-span-6 h-[400px]" }}
            thumbnailKey="url"
          />
          <div className="mt-6">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Statistiques du bloc</label>
            <ReorderableArrayEditor
              items={content?.stats ?? []}
              onChange={(items) => onChange({ ...content, stats: items })}
              fields={[
                { key: "value", label: "Valeur (ex: 98%)", type: "text" },
                { key: "label", label: "Libellé (ex: Recommandation)", type: "text" },
              ]}
              defaultItem={{ value: "", label: "" }}
            />
          </div>
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
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Éléments de la barre</label>
          <ReorderableArrayEditor
            items={content?.items ?? []}
            onChange={(items) => onChange({ ...content, items })}
            fields={[
              { key: "id", label: "ID (unique)", type: "text", placeholder: "s1" },
              { key: "value", label: "Valeur (optionnel, ex : 2400+)", type: "text", placeholder: "" },
              { key: "label", label: "Étiquette (ex : Clients satisfaits)", type: "text" },
              { key: "icon", label: "Icône", type: "icon" },
            ]}
            defaultItem={{ id: "", label: "", value: "", icon: "Star", color: "primary" }}
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
