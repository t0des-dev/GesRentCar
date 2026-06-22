"use client";

import { Reorder } from "framer-motion";
import { 
  GripVertical, Eye, EyeOff, Edit3, Image as ImageIcon, Activity, Star, 
  ShieldCheck, MessageSquareQuote, Sparkles, Camera, MapPin, Bot, 
  HelpCircle, ListOrdered, Megaphone, PanelTop, PanelBottom, ArrowLeftRight
} from "lucide-react";
import { cn } from "@/shared/utils";
import type { StorefrontForm } from "@/types/storefront";

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

const getSectionIcon = (id: string) => {
  switch (id) {
    case "hero": return <ImageIcon size={18} />;
    case "stats": return <Activity size={18} />;
    case "featured": return <Star size={18} />;
    case "why_us": return <ShieldCheck size={18} />;
    case "testimonials": return <MessageSquareQuote size={18} />;
    case "vibe_selector": return <Sparkles size={18} />;
    case "lifestyle_gallery": return <Camera size={18} />;
    case "map": return <MapPin size={18} />;
    case "concierge_banner": return <Bot size={18} />;
    case "faq": return <HelpCircle size={18} />;
    case "how_it_works": return <ListOrdered size={18} />;
    case "cta_banner": return <Megaphone size={18} />;
    case "comparator": return <ArrowLeftRight size={18} />;
    default: return <GripVertical size={18} />;
  }
};

const getSectionMeta = (id: string, form?: StorefrontForm) => {
  if (!form) return null;
  switch (id) {
    case "testimonials": return `${form.testimonials?.length || 0} avis`;
    case "faq": return `${form.faq_config?.length || 0} questions`;
    case "why_us": return `${form.features_config?.length || 0} atouts`;
    case "map": return `${form.sections_content?.map?.locations?.length || 0} villes`;
    case "featured": return `Catalogue`;
    case "how_it_works": return `${form.sections_content?.how_it_works?.steps?.length || 0} étapes`;
    default: return null;
  }
};

export default function SectionReorder({ sections, form, onChange, selectedSection, onSelectSection }: SectionReorderProps) {
  return (
    <div className="space-y-3">
      {/* Locked Header */}
      <div className="flex items-center gap-4 bg-slate-100 border border-slate-200 p-4 rounded-2xl opacity-60 pointer-events-none">
        <PanelTop size={18} className="text-slate-400" />
        <div className="flex-1">
          <h4 className="text-sm font-black text-slate-900">En-tête (Header)</h4>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Fixe • Navigation</p>
        </div>
      </div>

      <Reorder.Group 
        axis="y" 
        values={sections} 
        onReorder={onChange}
        className="space-y-3"
      >
        {sections.map((section) => {
          const isSelected = section.id === selectedSection;
          const meta = getSectionMeta(section.id, form);
          
          return (
            <Reorder.Item 
              key={section.id} 
              value={section}
              className={cn(
                "flex items-center gap-3 bg-white border p-4 rounded-2xl cursor-grab active:cursor-grabbing transition-all duration-300",
                isSelected
                  ? "border-primary shadow-lg shadow-primary/10 ring-2 ring-primary/20 scale-[1.02]"
                  : "border-slate-200 hover:border-primary/40",
                !section.active && "opacity-60 bg-slate-50/50"
              )}
            >
              <div className="flex items-center gap-2 cursor-grab text-slate-400 hover:text-slate-600">
                <GripVertical size={16} />
              </div>
              
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm shrink-0 transition-colors",
                isSelected ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
              )}>
                {getSectionIcon(section.id)}
              </div>

              <div className="flex-1 min-w-0" onClick={() => onSelectSection?.(section.id)}>
                <div className="flex items-center gap-2">
                  <h4 className={cn("text-sm font-black truncate transition-colors", isSelected ? "text-primary" : "text-slate-900")}>
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
                  className={cn(
                    "p-2.5 rounded-xl transition-all",
                    isSelected ? "text-primary bg-primary/10" : "text-slate-400 hover:text-primary hover:bg-primary/5"
                  )}
                >
                  <Edit3 size={16} />
                </button>
                <button 
                  onClick={() => {
                    const newSections = sections.map(s => s.id === section.id ? { ...s, active: !s.active } : s);
                    onChange(newSections);
                  }}
                  className={cn(
                    "p-2.5 rounded-xl transition-all",
                    section.active ? "text-slate-600 bg-slate-100 hover:bg-slate-200" : "text-slate-400 bg-transparent hover:bg-slate-100"
                  )}
                >
                  {section.active ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      {/* Locked Footer */}
      <div className="flex items-center gap-4 bg-slate-100 border border-slate-200 p-4 rounded-2xl opacity-60 pointer-events-none">
        <PanelBottom size={18} className="text-slate-400" />
        <div className="flex-1">
          <h4 className="text-sm font-black text-slate-900">Pied de page (Footer)</h4>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Fixe • Réseaux Sociaux</p>
        </div>
      </div>
    </div>
  );
}
