"use client";

import { motion } from "framer-motion";
import { Monitor, Plus, Trash2, Smartphone, ChevronUp, ChevronDown } from "lucide-react";
import type { StorefrontForm } from "@/types/storefront";

interface MenuFooterSettingsProps {
  form: StorefrontForm;
  setForm: (v: StorefrontForm) => void;
}

export default function MenuFooterSettings({ form, setForm }: MenuFooterSettingsProps) {
  const addMenuLink = () => 
    setForm({ 
      ...form, 
      header_config: { 
        ...form.header_config, 
        menu_links: [...(form.header_config.menu_links ?? []), { label: "Nouveau", url: "#" }] 
      } 
    });

  const removeMenuLink = (i: number) => {
    const links = [...(form.header_config.menu_links ?? [])];
    links.splice(i, 1);
    setForm({ ...form, header_config: { ...form.header_config, menu_links: links } });
  };

  const moveLinkUp = (i: number) => {
    if (i === 0) return;
    const links = [...(form.header_config.menu_links ?? [])];
    const temp = links[i];
    links[i] = links[i - 1];
    links[i - 1] = temp;
    setForm({ ...form, header_config: { ...form.header_config, menu_links: links } });
  };

  const moveLinkDown = (i: number) => {
    const links = [...(form.header_config.menu_links ?? [])];
    if (i >= links.length - 1) return;
    const temp = links[i];
    links[i] = links[i + 1];
    links[i + 1] = temp;
    setForm({ ...form, header_config: { ...form.header_config, menu_links: links } });
  };

  const menuLinks = form.header_config.menu_links ?? [];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-200/60 shadow-sm space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Monitor size={20} className="text-blue-600" />
            <h3 className="text-xl font-black text-slate-900">Navigation & Menu</h3>
          </div>
          <button 
            onClick={addMenuLink} 
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <Plus size={14} /> Ajouter un lien
          </button>
        </div>

        <div className="space-y-3">
          {menuLinks.map((link: any, i: number) => (
            <div key={i} className="flex items-center gap-3 bg-slate-50/80 border border-slate-200/80 p-4 rounded-2xl group hover:bg-white hover:border-slate-300 transition-all">
              {/* Up / Down Buttons */}
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => moveLinkUp(i)}
                  disabled={i === 0}
                  title="Déplacer vers le haut"
                  className="p-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-600 transition-all"
                >
                  <ChevronUp size={14} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => moveLinkDown(i)}
                  disabled={i === menuLinks.length - 1}
                  title="Déplacer vers le bas"
                  className="p-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-600 transition-all"
                >
                  <ChevronDown size={14} strokeWidth={2.5} />
                </button>
              </div>

              {/* Label Input */}
              <div className="flex-1 min-w-0">
                <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  Intitulé du lien
                </label>
                <input 
                  type="text" 
                  value={link.label ?? ""} 
                  onChange={e => { 
                    const l = [...(form.header_config.menu_links ?? [])]; 
                    l[i].label = e.target.value; 
                    setForm({ ...form, header_config: { ...form.header_config, menu_links: l } }); 
                  }} 
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
                  placeholder="Ex: Accueil"
                />
              </div>

              {/* URL Input */}
              <div className="flex-1 min-w-0">
                <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  URL / Destination
                </label>
                <input 
                  type="text" 
                  value={link.url ?? ""} 
                  onChange={e => { 
                    const l = [...(form.header_config.menu_links ?? [])]; 
                    l[i].url = e.target.value; 
                    setForm({ ...form, header_config: { ...form.header_config, menu_links: l } }); 
                  }} 
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono" 
                  placeholder="Ex: /fleet"
                />
              </div>

              {/* Remove Button */}
              <button 
                onClick={() => removeMenuLink(i)} 
                title="Supprimer le lien"
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all self-center"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {menuLinks.length === 0 && (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm font-medium">
              Aucun lien dans le menu de navigation. Cliquer sur &quot;Ajouter un lien&quot;.
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-200/60 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <Smartphone size={20} className="text-purple-600" />
          <h3 className="text-xl font-black text-slate-900">Configuration Footer</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Téléphone</label>
            <input 
              type="text" 
              value={form.footer_config.phone ?? ""} 
              onChange={e => setForm({ ...form, footer_config: { ...form.footer_config, phone: e.target.value } })} 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-purple-500 transition-all text-sm" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email</label>
            <input 
              type="email" 
              value={form.footer_config.email ?? ""} 
              onChange={e => setForm({ ...form, footer_config: { ...form.footer_config, email: e.target.value } })} 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-purple-500 transition-all text-sm" 
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Adresse</label>
          <textarea 
            rows={2} 
            value={form.footer_config.address ?? ""} 
            onChange={e => setForm({ ...form, footer_config: { ...form.footer_config, address: e.target.value } })} 
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none resize-none focus:bg-white focus:border-purple-500 transition-all text-sm" 
          />
        </div>
      </div>
    </motion.div>
  );
}
