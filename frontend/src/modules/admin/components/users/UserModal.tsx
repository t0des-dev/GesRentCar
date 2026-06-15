"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Plus, Shield, Save, Loader2, Edit } from "lucide-react";
import { cn } from "@/shared/utils";

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-ink-1/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="card-premium w-full max-w-lg overflow-hidden shadow-2xl"
          >
            <div className="p-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-serif text-ink-1 tracking-tight">{editingUser ? "Modifier le profil" : "Nouveau collaborateur"}</h3>
                  <p className="text-ink-2 text-sm font-bold italic">Définissez les accès de ce compte.</p>
                </div>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-ink-3 hover:text-ink-1"
                >
                  <X size={24} />
                </motion.button>
              </div>

              <form onSubmit={onSave} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink-3 ml-1 flex items-center gap-2"><User size={10} /> Nom complet</label>
                  <input name="name" defaultValue={editingUser?.name} required className="input-premium" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink-3 ml-1 flex items-center gap-2"><Mail size={10} /> Email professionnel</label>
                  <input name="email" type="email" defaultValue={editingUser?.email} required className="input-premium" />
                </div>
                {!editingUser && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-ink-3 ml-1 flex items-center gap-2"><Plus size={10} /> Mot de passe initial</label>
                    <input name="password" type="password" required className="input-premium" />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink-3 ml-1 flex items-center gap-2"><Shield size={10} /> Rôle & Permissions</label>
                  <div className="relative">
                    <select name="role" defaultValue={editingUser?.role || "agent"} className="input-premium appearance-none cursor-pointer">
                      <option value="admin">Administrateur (Accès total)</option>
                      <option value="agent">Agent Fleet (Gestion restreinte)</option>
                    </select>
                    <div className="absolute right-6 top-5 pointer-events-none text-ink-3"><Edit size={14} /></div>
                  </div>
                </div>

                <div className="flex gap-4 pt-8">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-gold to-gold/90 text-ink-1 py-5 rounded-2xl font-bold uppercase text-xs tracking-wider shadow-lg shadow-gold/20 flex items-center justify-center gap-3"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {editingUser ? "Mettre à jour" : "Créer le compte"}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
