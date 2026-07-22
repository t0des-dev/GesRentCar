"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Layers, Settings, Bot, ChevronRight, Edit3, ArrowLeft, Search } from "lucide-react";
import SectionReorder from "./SectionReorder";
import SectionContentEditor from "./SectionContentEditor";
import type { StorefrontForm, StatsConfig, ConciergeConfig } from "@/types/storefront";

interface StructureManagerProps {
  form: StorefrontForm;
  setForm: (v: StorefrontForm) => void;
  onNavigate?: (tab: string) => void;
  onSelectSection?: (id: string | null) => void;
}

const SECTION_CONTENT_KEY: Record<string, string> = {
  vibe_selector: "vibe",
  lifestyle_gallery: "lifestyle",
  featured: "featured_vehicles",
};

function contentKey(sectionId: string): string {
  return SECTION_CONTENT_KEY[sectionId] ?? sectionId;
}

export default function StructureManager({ form, setForm, onNavigate, onSelectSection }: StructureManagerProps) {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const handleSelect = (id: string | null) => {
    setSelectedSection(id);
    onSelectSection?.(id);
  };

  const selected = form.sections_order.find((s) => s.id === selectedSection);
  const key = selectedSection ? contentKey(selectedSection) : null;

  const isFormLevel = (id: string) => id === "stats" || id === "trust_bar" || id === "concierge_banner" || id === "dual_cta";

  const specialEditors: Record<string, { label: string; editor: ReactNode }> = {
    stats: {
      label: "Statistiques Clés",
      editor: (
        <SectionContentEditor
          sectionId="stats"
          content={form.stats_config ?? {}}
          onChange={(v) => setForm({ ...form, stats_config: v as StatsConfig })}
        />
      ),
    },
    trust_bar: {
      label: "Avantages & Support VIP",
      editor: (
        <SectionContentEditor
          sectionId="stats"
          content={form.stats_config ?? {}}
          onChange={(v) => setForm({ ...form, stats_config: v as StatsConfig })}
        />
      ),
    },
    concierge_banner: {
      label: "Bannière Concierge IA",
      editor: (
        <SectionContentEditor
          sectionId="concierge"
          content={form.concierge_config ?? {}}
          onChange={(v) => setForm({ ...form, concierge_config: v as ConciergeConfig })}
        />
      ),
    },
    faq: {
      label: "FAQ",
      editor: (
        <SectionContentEditor
          sectionId="faq"
          content={form.sections_content.faq ?? {}}
          faqItems={form.faq_config ?? []}
          onFaqItemsChange={(items) => setForm({ ...form, faq_config: items })}
          onChange={(v) => setForm({ ...form, sections_content: { ...form.sections_content, faq: v as any } })}
        />
      ),
    },
    dual_cta: {
      label: "Double Appel à l'Action",
      editor: (
        <div className="space-y-8">
          <div>
            <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Panel Gauche — Programme Privilège</h5>
            <SectionContentEditor
              sectionId="promotion_banner"
              content={form.sections_content.promotion_banner ?? {}}
              onChange={(v) => setForm({ ...form, sections_content: { ...form.sections_content, promotion_banner: v as any } })}
            />
          </div>
          <div className="h-px bg-slate-100" />
          <div>
            <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Panel Droit — Prêt à prendre le volant ?</h5>
            <SectionContentEditor
              sectionId="cta_banner"
              content={form.sections_content.cta_banner ?? {}}
              onChange={(v) => setForm({ ...form, sections_content: { ...form.sections_content, cta_banner: v as any } })}
            />
          </div>
        </div>
      ),
    },
  };

  const renderEditor = () => {
    if (!selectedSection || !selected) return null;

    if (isFormLevel(selectedSection)) {
      return (
        <div className="p-6 rounded-[32px] border border-slate-100 bg-white">
          <div className="flex items-center gap-2 mb-6">
            <button onClick={() => handleSelect(null)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all">
              <ArrowLeft size={16} />
            </button>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
              <Edit3 size={14} className="text-primary" />
              Modification : {selected.label}
            </h4>
          </div>
          {specialEditors[selectedSection]?.editor}
        </div>
      );
    }

    const sectionContent = key ? (form.sections_content as unknown as Record<string, unknown>)[key] : null;
    if (sectionContent === undefined) return null;

    const isHero = selectedSection === "hero" || key === "hero";
    const extraFields = isHero ? [
      {
        key: "hero_image",
        label: "Image de fond (Hero)",
        value: form.hero_image_url,
        onChange: (v: string) => setForm({ ...form, hero_image_url: v }),
      },
      {
        key: "hero_video",
        label: "Vidéo de fond (URL .mp4)",
        value: form.hero_video_url,
        onChange: (v: string) => setForm({ ...form, hero_video_url: v }),
      },
    ] : undefined;

    return (
      <div className="p-6 rounded-[32px] border border-slate-100 bg-white">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => handleSelect(null)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all">
            <ArrowLeft size={16} />
          </button>
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
            <Edit3 size={14} className="text-primary" />
            Modification : {selected.label}
          </h4>
        </div>
        <SectionContentEditor
          sectionId={key!}
          content={(sectionContent ?? {}) as Record<string, unknown>}
          extraFields={extraFields}
          onChange={(newContent) => {
            setForm({
              ...form,
              sections_content: { ...form.sections_content, [key!]: newContent } as StorefrontForm['sections_content'],
            });
          }}
        />
      </div>
    );
  };

  return (
    <motion.div id="structure-manager" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      <div className="bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm space-y-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-950 text-white flex items-center justify-center shadow-lg"><Layers size={24} /></div>
          <div><h3 className="text-2xl font-black text-slate-900 tracking-tight">Structure de l&apos;Accueil</h3></div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          <div className="xl:col-span-4">
             <div className="p-6 bg-slate-50 border border-slate-100 rounded-[32px] space-y-6 sticky top-8">
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                    <Settings size={16} className="text-primary" /> 
                    Configuration Flux
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium mt-2 leading-relaxed">
                    Glissez-déposez les sections pour réorganiser l&apos;ordre d&apos;affichage sur la page d&apos;accueil de la vitrine B2C. Cliquez sur une section pour la modifier.
                  </p>
                </div>
                <SectionReorder
                  sections={form.sections_order}
                  form={form}
                  onChange={(s) => setForm({ ...form, sections_order: s })}
                  selectedSection={selectedSection}
                  onSelectSection={handleSelect}
                />
             </div>
          </div>

          <div className="xl:col-span-8 space-y-8">
            {renderEditor() ?? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div onClick={() => onNavigate?.("multilingual")} className="p-8 rounded-[32px] bg-indigo-50/30 border border-indigo-100/50 group hover:bg-indigo-50 transition-all cursor-pointer">
                   <div className="flex items-center gap-4 mb-4"><div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-600"><Bot size={20} /></div><span className="text-sm font-black text-slate-900">Intelligence & FAQ</span></div>
                   <p className="text-[11px] text-slate-500 font-medium">Gérez les questions fréquentes et la bannière Concierge IA.</p>
                   <div className="flex justify-end"><ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" /></div>
                </div>
                <div onClick={() => onNavigate?.("seo")} className="p-8 rounded-[32px] bg-emerald-50/30 border border-emerald-100/50 group hover:bg-emerald-50 transition-all cursor-pointer">
                   <div className="flex items-center gap-4 mb-4"><div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-600"><Search size={20} /></div><span className="text-sm font-black text-slate-900">SEO & Visibilité</span></div>
                   <p className="text-[11px] text-slate-500 font-medium">Gérez le référencement de votre agence sur Google et les réseaux sociaux.</p>
                   <div className="flex justify-end"><ChevronRight size={16} className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" /></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
