"use client";

import { useState } from "react";
import { Reorder } from "framer-motion";
import { 
  GripVertical, Eye, EyeOff, Edit3, Image as ImageIcon, Activity, Star, 
  ShieldCheck, MessageSquareQuote, Sparkles, Bot, 
  HelpCircle, ListOrdered, Megaphone, PanelTop, PanelBottom, Crown,
  ArrowUp, ArrowDown, RotateCcw, Zap, SlidersHorizontal, Award
} from "lucide-react";
import { cn } from "@/shared/utils";
import type { StorefrontForm } from "@/types/storefront";
import { defaultStorefrontForm } from "@/constants/storefrontDefaults";

interface Section {
  id: string;
  label: string;
  active: boolean;
}

interface SectionReorderProps {
  sections: Section[];
  form?: StorefrontForm;
  onChange: (sections: Section[]) => void;
  selectedSection?: string | null;
  onSelectSection?: (id: string | null) => void;
}

const PRESET_TEMPLATES: Record<string, { label: string; icon: any; order: string[] }> = {
  conversion: {
    label: "Focus Conversion",
    icon: Zap,
    order: ["hero", "stats", "featured", "why_us", "testimonials", "faq", "how_it_works", "cta_banner", "vibe_selector", "concierge_banner"],
  },
  minimalist: {
    label: "Minimaliste",
    icon: SlidersHorizontal,
    order: ["hero", "featured", "why_us", "faq", "cta_banner"],
  },
  prestige: {
    label: "Prestige",
    icon: Award,
    order: ["hero", "vibe_selector", "featured", "concierge_banner", "why_us", "testimonials", "stats", "faq", "cta_banner"],
  },
};

const getSectionIcon = (id: string) => {
  switch (id) {
    case "hero": return <ImageIcon size={18} />;
    case "stats": return <Activity size={18} />;
    case "featured": return <Star size={18} />;
    case "why_us": return <ShieldCheck size={18} />;
    case "testimonials": return <MessageSquareQuote size={18} />;
    case "vibe_selector": return <Sparkles size={18} />;
    case "concierge_banner": return <Bot size={18} />;
    case "faq": return <HelpCircle size={18} />;
    case "how_it_works": return <ListOrdered size={18} />;
    case "cta_banner": return <Megaphone size={18} />;
    case "promotion_banner": return <Crown size={18} />;
    case "dual_cta": return <Megaphone size={18} />;
    default: return <GripVertical size={18} />;
  }
};

const getSectionMeta = (id: string, form?: StorefrontForm) => {
  if (!form) return null;
  switch (id) {
    case "testimonials": return `${form.testimonials?.length || 0} avis`;
    case "faq": return `${form.faq_config?.length || 0} questions`;
    case "why_us": return `${form.features_config?.length || 0} atouts`;
    case "featured": return `Catalogue`;
    case "how_it_works": return `${form.sections_content?.how_it_works?.steps?.length || 0} étapes`;
    default: return null;
  }
};

export default function SectionReorder({ sections, form, onChange, selectedSection, onSelectSection }: SectionReorderProps) {
  const [filter, setFilter] = useState<"all" | "active" | "hidden">("all");
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const activeCount = sections.filter((s) => s.active).length;
  const totalCount = sections.length;

  const moveItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    const newSections = [...sections];
    const [movedItem] = newSections.splice(index, 1);
    newSections.splice(targetIndex, 0, movedItem);
    onChange(newSections);
  };

  const toggleAll = (active: boolean) => {
    onChange(sections.map((s) => ({ ...s, active })));
  };

  const resetToDefault = () => {
    onChange(defaultStorefrontForm.sections_order);
    setActivePreset(null);
  };

  const applyPreset = (presetKey: string) => {
    const preset = PRESET_TEMPLATES[presetKey];
    if (!preset) return;
    const orderMap = new Map(preset.order.map((id, idx) => [id, idx]));
    const newSections = [...sections]
      .map((s) => ({
        ...s,
        active: orderMap.has(s.id),
      }))
      .sort((a, b) => {
        const idxA = orderMap.get(a.id) ?? 99;
        const idxB = orderMap.get(b.id) ?? 99;
        return idxA - idxB;
      });
    onChange(newSections);
    setActivePreset(presetKey);
  };

  const filteredSections = sections.filter((s) => {
    if (filter === "active") return s.active;
    if (filter === "hidden") return !s.active;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Global Quick Action Toolbar */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-3">
        {/* Header & Stats counter */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Sections</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold">
              {activeCount} / {totalCount} actives
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleAll(true)}
              title="Tout afficher"
              className="px-2 py-1 text-[10px] font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 flex items-center gap-1 transition-all"
            >
              <Eye size={12} /> Tout afficher
            </button>
            <button
              onClick={() => toggleAll(false)}
              title="Tout masquer"
              className="px-2 py-1 text-[10px] font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 flex items-center gap-1 transition-all"
            >
              <EyeOff size={12} /> Tout masquer
            </button>
            <button
              onClick={resetToDefault}
              title="Réinitialiser l'ordre"
              className="p-1 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-all"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>

        {/* Layout Preset Templates */}
        <div>
          <span className="block text-[9px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">
            Presets de Disposition
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {Object.entries(PRESET_TEMPLATES).map(([key, p]) => {
              const Icon = p.icon;
              const isSelected = activePreset === key;
              return (
                <button
                  key={key}
                  onClick={() => applyPreset(key)}
                  className={cn(
                    "flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-[10px] font-bold transition-all border",
                    isSelected
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  <Icon size={12} />
                  <span className="truncate">{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-slate-200/60 p-0.5 rounded-xl text-[10px] font-bold">
          {(["all", "active", "hidden"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "flex-1 py-1 rounded-lg capitalize transition-all",
                filter === f ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              )}
            >
              {f === "all" ? "Toutes" : f === "active" ? "Visibles" : "Masquées"}
            </button>
          ))}
        </div>
      </div>

      {/* Locked Header */}
      <div className="flex items-center gap-4 bg-slate-100 border border-slate-200 p-3.5 rounded-2xl opacity-60 pointer-events-none">
        <PanelTop size={18} className="text-slate-400" />
        <div className="flex-1">
          <h4 className="text-xs font-black text-slate-900">En-tête (Header)</h4>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Fixe • Navigation</p>
        </div>
      </div>

      <Reorder.Group 
        axis="y" 
        values={sections} 
        onReorder={onChange}
        className="space-y-2.5"
      >
        {filteredSections.map((section) => {
          const index = sections.findIndex((s) => s.id === section.id);
          const isSelected = section.id === selectedSection;
          const meta = getSectionMeta(section.id, form);
          
          return (
            <Reorder.Item 
              key={section.id} 
              value={section}
              className={cn(
                "flex items-center gap-2.5 bg-white border p-3 rounded-2xl cursor-grab active:cursor-grabbing transition-all duration-200",
                isSelected
                  ? "border-primary shadow-lg shadow-primary/10 ring-2 ring-primary/20 scale-[1.01]"
                  : "border-slate-200 hover:border-primary/40",
                !section.active && "opacity-60 bg-slate-50/50"
              )}
            >
              {/* Drag Handle & Up/Down Arrows */}
              <div className="flex items-center gap-1 text-slate-400">
                <GripVertical size={16} className="cursor-grab hover:text-slate-600 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <button
                    disabled={index === 0}
                    onClick={(e) => { e.stopPropagation(); moveItem(index, "up"); }}
                    className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-20 hover:bg-slate-100 rounded"
                    title="Monter"
                  >
                    <ArrowUp size={11} />
                  </button>
                  <button
                    disabled={index === sections.length - 1}
                    onClick={(e) => { e.stopPropagation(); moveItem(index, "down"); }}
                    className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-20 hover:bg-slate-100 rounded"
                    title="Descendre"
                  >
                    <ArrowDown size={11} />
                  </button>
                </div>
              </div>
              
              <div className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center shadow-sm shrink-0 transition-colors",
                isSelected ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
              )}>
                {getSectionIcon(section.id)}
              </div>

              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onSelectSection?.(section.id)}>
                <div className="flex items-center gap-2">
                  <h4 className={cn("text-xs font-black truncate transition-colors", isSelected ? "text-primary" : "text-slate-900")}>
                    {section.label}
                  </h4>
                  {meta && (
                    <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[9px] font-bold uppercase tracking-wider">
                      {meta}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={cn(
                    "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm",
                    section.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"
                  )}>
                    {section.active ? "Visible" : "Masqué"}
                  </span>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider truncate">
                    ID: {section.id}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onSelectSection?.(section.id)}
                  title="Modifier cette section"
                  className={cn(
                    "p-2 rounded-xl transition-all",
                    isSelected ? "text-primary bg-primary/10" : "text-slate-400 hover:text-primary hover:bg-primary/5"
                  )}
                >
                  <Edit3 size={15} />
                </button>
                <button 
                  onClick={() => {
                    const newSections = sections.map(s => s.id === section.id ? { ...s, active: !s.active } : s);
                    onChange(newSections);
                  }}
                  title={section.active ? "Masquer" : "Afficher"}
                  className={cn(
                    "p-2 rounded-xl transition-all",
                    section.active ? "text-slate-600 bg-slate-100 hover:bg-slate-200" : "text-slate-400 bg-transparent hover:bg-slate-100"
                  )}
                >
                  {section.active ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
              </div>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      {/* Locked Footer */}
      <div className="flex items-center gap-4 bg-slate-100 border border-slate-200 p-3.5 rounded-2xl opacity-60 pointer-events-none">
        <PanelBottom size={18} className="text-slate-400" />
        <div className="flex-1">
          <h4 className="text-xs font-black text-slate-900">Pied de page (Footer)</h4>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Fixe • Réseaux Sociaux</p>
        </div>
      </div>
    </div>
  );
}
