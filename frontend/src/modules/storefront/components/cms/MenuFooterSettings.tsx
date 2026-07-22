"use client";

import { motion } from "framer-motion";
import { Monitor, Plus, Trash2, Smartphone, Share2 } from "lucide-react";
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
        menu_links: [...(form.header_config?.menu_links || []), { label: "Nouveau", url: "#" }],
      },
    });

  const removeMenuLink = (i: number) => {
    const links = [...(form.header_config?.menu_links || [])];
    links.splice(i, 1);
    setForm({ ...form, header_config: { ...form.header_config, menu_links: links } });
  };

  const social = form.footer_config?.social_links || {};

  const updateSocial = (key: string, val: string) => {
    setForm({
      ...form,
      footer_config: {
        ...form.footer_config,
        social_links: {
          ...form.footer_config?.social_links,
          [key]: val,
        },
      },
    });
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      {/* Header Navigation Menu Settings */}
      <div className="bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Monitor size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Navigation & Menu</h3>
              <p className="text-xs text-slate-400">Liens du menu d&apos;en-tête de la vitrine</p>
            </div>
          </div>
          <button
            onClick={addMenuLink}
            type="button"
            className="px-4 py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm"
          >
            <Plus size={14} /> Ajouter un lien
          </button>
        </div>

        <div className="space-y-3">
          {(form.header_config?.menu_links || []).map((link: any, i: number) => (
            <div key={i} className="flex items-center gap-4 bg-slate-50 border border-slate-200/80 p-4 rounded-2xl">
              <div className="flex-1 space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Libellé</label>
                <input
                  type="text"
                  value={link.label ?? ""}
                  onChange={(e) => {
                    const l = [...form.header_config.menu_links];
                    l[i].label = e.target.value;
                    setForm({ ...form, header_config: { ...form.header_config, menu_links: l } });
                  }}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-primary transition-all text-slate-900"
                />
              </div>

              <div className="flex-1 space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Lien URL</label>
                <input
                  type="text"
                  value={link.url ?? ""}
                  onChange={(e) => {
                    const l = [...form.header_config.menu_links];
                    l[i].url = e.target.value;
                    setForm({ ...form, header_config: { ...form.header_config, menu_links: l } });
                  }}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-700 outline-none focus:border-primary transition-all"
                />
              </div>

              <button
                type="button"
                onClick={() => removeMenuLink(i)}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors mt-4"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Contact Info */}
      <div className="bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Smartphone size={20} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Coordonnées du Footer</h3>
            <p className="text-xs text-slate-400">Téléphone, email et adresse affichés en bas de page</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Téléphone VIP
            </label>
            <input
              type="text"
              value={form.footer_config?.phone ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  footer_config: { ...form.footer_config, phone: e.target.value },
                })
              }
              placeholder="+212 6 00 00 00 00"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all text-slate-900"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Email Contact
            </label>
            <input
              type="email"
              value={form.footer_config?.email ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  footer_config: { ...form.footer_config, email: e.target.value },
                })
              }
              placeholder="contact@vectoriarentcar.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all text-slate-900"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
            Adresse Physique
          </label>
          <textarea
            rows={2}
            value={form.footer_config?.address ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                footer_config: { ...form.footer_config, address: e.target.value },
              })
            }
            placeholder="Casablanca & Villes principales, Maroc"
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all text-slate-900 resize-none"
          />
        </div>
      </div>

      {/* Social Networks Links */}
      <div className="bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
            <Share2 size={20} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Réseaux Sociaux</h3>
            <p className="text-xs text-slate-400">Liens de vos profils sociaux pour les icônes du footer</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              WhatsApp (Numéro ou Lien wa.me)
            </label>
            <input
              type="text"
              value={social.whatsapp ?? ""}
              onChange={(e) => updateSocial("whatsapp", e.target.value)}
              placeholder="https://wa.me/212600000000 ou 212600000000"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all text-slate-900 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Instagram (URL)
            </label>
            <input
              type="text"
              value={social.instagram ?? ""}
              onChange={(e) => updateSocial("instagram", e.target.value)}
              placeholder="https://instagram.com/votre_agence"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all text-slate-900 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Facebook (URL)
            </label>
            <input
              type="text"
              value={social.facebook ?? ""}
              onChange={(e) => updateSocial("facebook", e.target.value)}
              placeholder="https://facebook.com/votre_agence"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all text-slate-900 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              TikTok (URL)
            </label>
            <input
              type="text"
              value={social.tiktok ?? ""}
              onChange={(e) => updateSocial("tiktok", e.target.value)}
              placeholder="https://tiktok.com/@votre_agence"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all text-slate-900 text-sm"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
