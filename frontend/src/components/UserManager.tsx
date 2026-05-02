"use client";

import { useState, useEffect } from "react";
import { 
  Users, Plus, Trash2, Edit, Loader2, Save, X, Shield, Mail, User
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api/client";
import { motion, AnimatePresence } from "framer-motion";

export default function UserManager() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, data);
      } else {
        await api.post("/users", data);
      }
      setShowUserModal(false);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if(confirm('Supprimer cet utilisateur ?')) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch(err: any) {
        alert(err.response?.data?.message || "Erreur");
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Gestion de l'Équipe</h2>
          <p className="text-slate-500 font-medium italic mt-1">Administrez les comptes et les permissions de vos collaborateurs.</p>
        </div>
        <button 
          onClick={() => { setEditingUser(null); setShowUserModal(true); }}
          className="bg-primary text-white flex items-center gap-2 px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all"
        >
          <Plus size={18} />
          Nouveau Membre
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Collaborateur</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Rôle & Accès</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Dernière activité</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-sm text-primary shadow-sm">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 leading-tight">{u.name}</p>
                        <div className="flex items-center gap-1.5 text-slate-400 mt-0.5">
                          <Mail size={10} />
                          <span className="text-[11px] font-bold">{u.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className={cn(
                      "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border font-black uppercase text-[10px] tracking-widest",
                      u.role === 'admin' 
                        ? "bg-red-50 border-red-100 text-red-600" 
                        : "bg-blue-50 border-blue-100 text-blue-600"
                    )}>
                      <Shield size={12} />
                      {u.role === 'admin' ? "Administrateur" : "Agent Fleet"}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold text-slate-400">Il y a quelques minutes</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { setEditingUser(u); setShowUserModal(true); }}
                        className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-500 hover:border-red-500 transition-all shadow-sm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Modal */}
      <AnimatePresence>
        {showUserModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20"
            >
              <div className="p-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      {editingUser ? "Modifier le profil" : "Nouveau collaborateur"}
                    </h3>
                    <p className="text-slate-500 text-sm font-medium italic">Définissez les accès de ce compte.</p>
                  </div>
                  <button onClick={() => setShowUserModal(false)} className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                    <X size={24} />
                  </button>
                </div>
                
                <form onSubmit={handleSaveUser} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                      <User size={10} /> Nom complet
                    </label>
                    <input 
                      name="name" 
                      defaultValue={editingUser?.name} 
                      required 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                      <Mail size={10} /> Email professionnel
                    </label>
                    <input 
                      name="email" 
                      type="email" 
                      defaultValue={editingUser?.email} 
                      required 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all" 
                    />
                  </div>
                  {!editingUser && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                        <Plus size={10} /> Mot de passe initial
                      </label>
                      <input 
                        name="password" 
                        type="password" 
                        required 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all" 
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                      <Shield size={10} /> Rôle & Permissions
                    </label>
                    <div className="relative">
                      <select 
                        name="role" 
                        defaultValue={editingUser?.role || "agent"} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-primary transition-all appearance-none cursor-pointer"
                      >
                        <option value="admin">Administrateur (Accès total)</option>
                        <option value="agent">Agent Fleet (Gestion restreinte)</option>
                      </select>
                      <div className="absolute right-6 top-5 pointer-events-none text-slate-400">
                        <Edit size={14} />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-8">
                    <button 
                      type="submit" 
                      disabled={loading} 
                      className="flex-1 bg-primary text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
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
    </div>
  );
}
