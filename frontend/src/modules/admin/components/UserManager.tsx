"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import api from "@/shared/services/client";
import { ConfirmDialog, notifyError } from "@/components/Notifications";

// Modular Components
import UserTable from "./users/UserTable";
import UserModal from "./users/UserModal";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function UserManager() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<() => void>(() => {});

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
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      notifyError(msg || "Erreur lors de la sauvegarde."); }
    finally { setLoading(false); }
  };

  const handleDeleteUser = async (id: number) => {
    setPendingAction(() => async () => {
      try { await api.delete(`/users/${id}`); fetchUsers(); }
      catch(err: unknown) {
        const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
        notifyError(msg || "Erreur lors de la suppression.");
      }
    });
    setConfirmOpen(true);
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
        onEdit={(u: User) => { setEditingUser(u); setShowUserModal(true); }} 
        onDelete={handleDeleteUser} 
      />

      <UserModal 
        isOpen={showUserModal} 
        onClose={() => setShowUserModal(false)} 
        editingUser={editingUser} 
        onSave={handleSaveUser} 
        loading={loading} 
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Supprimer l'utilisateur"
        message="Supprimer cet utilisateur ?"
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        variant="danger"
        onConfirm={() => { pendingAction(); setConfirmOpen(false); }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
