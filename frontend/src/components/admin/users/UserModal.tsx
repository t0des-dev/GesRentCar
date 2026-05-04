"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Plus, Shield, Save, Loader2, Edit } from "lucide-react";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingUser: any;
  onSave: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
}

export default function UserModal({ isOpen, onClose, editingUser, onSave, loading }: UserModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20"
          >
            <div className="p-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{editingUser ? "Modifier le profil" : "Nouveau collaborateur"}</h3>
                  <p className="text-slate-500 text-sm font-medium italic">Définissez les accès de ce compte.</p>
                </div>
                <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-600"><X size={24} /></button>
              </div>
              
              <form onSubmit={onSave} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2"><User size={10} /> Nom complet</label>
                  <input name="name" defaultValue={editingUser?.name} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2"><Mail size={10} /> Email professionnel</label>
                  <input name="email" type="email" defaultValue={editingUser?.email} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all" />
                </div>
                {!editingUser && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2"><Plus size={10} /> Mot de passe initial</label>
                    <input name="password" type="password" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all" />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2"><Shield size={10} /> Rôle & Permissions</label>
                  <div className="relative">
                    <select name="role" defaultValue={editingUser?.role || "agent"} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all appearance-none cursor-pointer">
                      <option value="admin">Administrateur (Accès total)</option>
                      <option value="agent">Agent Fleet (Gestion restreinte)</option>
                    </select>
                    <div className="absolute right-6 top-5 pointer-events-none text-slate-400"><Edit size={14} /></div>
                  </div>
                </div>

                <div className="flex gap-4 pt-8">
                  <button type="submit" disabled={loading} className="flex-1 bg-primary text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {editingUser ? "Mettre à jour" : "Créer le compte"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
