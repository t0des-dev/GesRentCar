"use client";

import { motion } from "framer-motion";
import { Monitor, Plus, Trash2, Smartphone, MapPin, Mail, Phone } from "lucide-react";

interface MenuFooterSettingsProps {
  form: any;
  setForm: (v: any) => void;
}

export default function MenuFooterSettings({ form, setForm }: MenuFooterSettingsProps) {
  const addMenuLink = () => setForm({ ...form, header_config: { ...form.header_config, menu_links: [...form.header_config.menu_links, { label: "Nouveau", url: "#" }] } });
  const removeMenuLink = (i: number) => {
    const links = [...form.header_config.menu_links];
    links.splice(i, 1);
    setForm({ ...form, header_config: { ...form.header_config, menu_links: links } });
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      <div className="bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3"><Monitor size={20} className="text-blue-600" /><h3 className="text-xl font-black text-slate-900">Navigation & Menu</h3></div>
          <button onClick={addMenuLink} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Plus size={14} /> Ajouter un lien</button>
        </div>
        <div className="space-y-3">
          {form.header_config.menu_links.map((link: any, i: number) => (
            <div key={i} className="flex items-center gap-4 bg-white border border-slate-100 p-4 rounded-2xl">
              <input type="text" value={link.label} onChange={e => { const l = [...form.header_config.menu_links]; l[i].label = e.target.value; setForm({...form, header_config: {...form.header_config, menu_links: l}}); }} className="flex-1 text-sm font-bold outline-none" />
              <input type="text" value={link.url} onChange={e => { const l = [...form.header_config.menu_links]; l[i].url = e.target.value; setForm({...form, header_config: {...form.header_config, menu_links: l}}); }} className="flex-1 text-sm font-bold text-slate-400 outline-none" />
              <button onClick={() => removeMenuLink(i)} className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm space-y-8">
        <div className="flex items-center gap-3"><Smartphone size={20} className="text-purple-600" /><h3 className="text-xl font-black text-slate-900">Configuration Footer</h3></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Téléphone</label><input type="text" value={form.footer_config.phone} onChange={e => setForm({...form, footer_config: {...form.footer_config, phone: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none" /></div>
          <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email</label><input type="email" value={form.footer_config.email} onChange={e => setForm({...form, footer_config: {...form.footer_config, email: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none" /></div>
        </div>
        <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Adresse</label><textarea rows={2} value={form.footer_config.address} onChange={e => setForm({...form, footer_config: {...form.footer_config, address: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none resize-none" /></div>
      </div>
    </motion.div>
  );
}
