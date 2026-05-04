"use client";

import { motion } from "framer-motion";
import { TrendingUp, Plus, Trash2 } from "lucide-react";

interface BusinessSettingsProps {
  form: any;
  setForm: (v: any) => void;
}

export default function BusinessSettings({ form, setForm }: BusinessSettingsProps) {
  const addOffer = () => setForm({ ...form, special_offers: [...form.special_offers, { category: "standard", discount: 10, end_date: "", active: true }] });
  
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      <div className="bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm space-y-8">
        <div className="flex items-center gap-3"><TrendingUp size={20} className="text-emerald-600" /><h3 className="text-xl font-black text-slate-900">Tarifs par Catégorie</h3></div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {Object.entries(form.category_prices).map(([cat, price]: [string, any]) => (
            <div key={cat} className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400">{cat}</label>
              <input type="number" value={price} onChange={e => setForm({...form, category_prices: {...form.category_prices, [cat]: Number(e.target.value)}})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-900">Offres Spéciales</h3>
          <button onClick={addOffer} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest"><Plus size={14} /> Nouvelle Offre</button>
        </div>
        {form.special_offers.map((offer: any, i: number) => (
          <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl grid grid-cols-3 gap-6 items-end">
            <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400">Catégorie</label><select value={offer.category} onChange={e => { const o = [...form.special_offers]; o[i].category = e.target.value; setForm({...form, special_offers: o}); }} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold outline-none"><option value="eco">Eco</option><option value="standard">Standard</option><option value="suv">SUV</option><option value="luxury">Luxe</option></select></div>
            <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400">Remise (%)</label><input type="number" value={offer.discount} onChange={e => { const o = [...form.special_offers]; o[i].discount = Number(e.target.value); setForm({...form, special_offers: o}); }} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold outline-none" /></div>
            <div className="flex justify-end"><button onClick={() => { const o = [...form.special_offers]; o.splice(i, 1); setForm({...form, special_offers: o}); }} className="text-red-400 hover:text-red-600"><Trash2 size={20} /></button></div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
