"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import api from "@/shared/services/client";

// Modular Components
import UserTable from "./users/UserTable";
import UserModal from "./users/UserModal";

export default function UserManager() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) { console.error("Error fetching users", err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSaveUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    try {
      if (editingUser) { await api.put(`/users/${editingUser.id}`, data); }
      else { await api.post("/users", data); }
      setShowUserModal(false);
      fetchUsers();
    } catch (err: any) { alert(err.response?.data?.message || "Erreur"); }
    finally { setLoading(false); }
  };

  const handleDeleteUser = async (id: number) => {
    if(confirm('Supprimer cet utilisateur ?')) {
      try { await api.delete(`/users/${id}`); fetchUsers(); }
      catch(err: any) { alert(err.response?.data?.message || "Erreur"); }
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
          <Plus size={18} /> Nouveau Membre
        </button>
      </div>

      <UserTable 
        users={users} 
        onEdit={(u: any) => { setEditingUser(u); setShowUserModal(true); }} 
        onDelete={handleDeleteUser} 
      />

      <UserModal 
        isOpen={showUserModal} 
        onClose={() => setShowUserModal(false)} 
        editingUser={editingUser} 
        onSave={handleSaveUser} 
        loading={loading} 
      />
    </div>
  );
}
