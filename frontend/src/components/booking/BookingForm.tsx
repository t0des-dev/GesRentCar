"use client";

import { Mail, Phone, User, Fingerprint, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import styles from "../../app/search/[id]/page.module.css";

interface BookingFormProps {
  form: any;
  setForm: (v: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  today: string;
}

export default function BookingForm({ form, setForm, onSubmit, loading, today }: BookingFormProps) {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2"><User size={10} /> Nom Complet</label>
        <input type="text" required placeholder="Ex: Jean Dupont" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all" />
      </div>
      
      <div className={styles.inputGroup}>
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2"><Mail size={10} /> Email</label>
        <input type="email" required placeholder="jean@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={styles.inputGroup}>
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2"><Phone size={10} /> Téléphone</label>
          <input type="tel" required placeholder="06XXXXXXXX" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all" />
        </div>
        <div className={styles.inputGroup}>
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2"><Fingerprint size={10} /> CIN / Passeport</label>
          <input type="text" required placeholder="AB123456" value={form.cin} onChange={e => setForm({...form, cin: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all" />
        </div>
      </div>

      <div className={styles.dateGrid}>
        <div className={styles.inputGroup}>
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2"><CalendarIcon size={10} /> Départ</label>
          <input type="date" required min={today} value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all" />
        </div>
        <div className={styles.inputGroup}>
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2"><CalendarIcon size={10} /> Retour</label>
          <input type="date" required min={form.start_date || today} value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all" />
        </div>
      </div>

      <button type="submit" className="w-full bg-primary text-white py-5 rounded-[24px] font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-50" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" size={20} /> : "Confirmer ma Réservation"}
      </button>
    </form>
  );
}
