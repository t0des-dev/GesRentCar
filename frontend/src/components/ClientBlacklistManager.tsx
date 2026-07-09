"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldOff,
  Plus,
  Search,
  Trash2,
  X,
  Mail,
  Phone,
  Hash,
  UserX,
} from "lucide-react";
import { cn } from "@/shared/utils";

interface BlacklistEntry {
  id: number;
  email: string;
  phone: string;
  cin: string;
  reason: string;
  blockedDate: string;
  blockedBy: string;
  notes: string;
}

export default function ClientBlacklistManager() {
  const [entries, setEntries] = useState<BlacklistEntry[]>([
    { id: 1, email: "ahmed.k@email.com", phone: "+212600112233", cin: "BK456789", reason: "Non-paiement répété", blockedDate: "2026-03-15", blockedBy: "Admin Principal", notes: "3 impayés consécutifs" },
    { id: 2, email: "sara.m@email.com", phone: "+212611223344", cin: "BK789012", reason: "Dommages véhicule", blockedDate: "2026-05-20", blockedBy: "Manager Fleet", notes: "Refus de payer les réparations" },
    { id: 3, email: "youssef.a@email.com", phone: "+212622334455", cin: "BK345678", reason: "Comportement abusif", blockedDate: "2026-06-01", blockedBy: "Admin Principal", notes: "Harcèlement du personnel" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterField, setFilterField] = useState<"all" | "email" | "cin">("all");

  const filtered = useMemo(() => {
    return entries.filter(entry => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      if (filterField === "email") return entry.email.toLowerCase().includes(q);
      if (filterField === "cin") return entry.cin.toLowerCase().includes(q);
      return (
        entry.email.toLowerCase().includes(q) ||
        entry.cin.toLowerCase().includes(q) ||
        entry.reason.toLowerCase().includes(q)
      );
    });
  }, [entries, searchQuery, filterField]);

  const handleAdd = (data: { email: string; reason: string; notes: string }) => {
    setEntries(prev => [
      {
        id: Date.now(),
        email: data.email,
        phone: "",
        cin: "",
        reason: data.reason,
        blockedDate: new Date().toISOString().split("T")[0],
        blockedBy: "Admin",
        notes: data.notes,
      },
      ...prev,
    ]);
    setShowForm(false);
  };

  const handleRemove = (id: number) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <UserX size={18} className="text-red-500" />
          </div>
          <div>
            <h3 className="font-bold text-ink-1 uppercase tracking-wider text-sm">Liste Noire Clients</h3>
            <p className="text-[10px] text-ink-3 font-bold uppercase tracking-widest">{entries.length} entrées</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors"
        >
          <Plus size={14} />
          Ajouter
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-surface-1 border border-border rounded-xl text-xs text-ink-1 placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          value={filterField}
          onChange={(e) => setFilterField(e.target.value as typeof filterField)}
          className="px-3 py-2.5 bg-surface-1 border border-border rounded-xl text-xs text-ink-1 focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">Tout</option>
          <option value="email">Email</option>
          <option value="cin">CIN</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-surface-2">
              <th className="px-4 py-3 text-[10px] font-black text-ink-3 uppercase tracking-widest">Email</th>
              <th className="px-4 py-3 text-[10px] font-black text-ink-3 uppercase tracking-widest">CIN</th>
              <th className="px-4 py-3 text-[10px] font-black text-ink-3 uppercase tracking-widest">Raison</th>
              <th className="px-4 py-3 text-[10px] font-black text-ink-3 uppercase tracking-widest">Date</th>
              <th className="px-4 py-3 text-[10px] font-black text-ink-3 uppercase tracking-widest">Par</th>
              <th className="px-4 py-3 text-[10px] font-black text-ink-3 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-1">
            <AnimatePresence>
              {filtered.map((entry) => (
                <motion.tr
                  key={entry.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="group hover:bg-surface-1 transition-all"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Mail size={12} className="text-ink-3 shrink-0" />
                      <span className="text-xs font-bold text-ink-1 truncate">{entry.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Hash size={12} className="text-ink-3 shrink-0" />
                      <span className="text-[10px] font-bold text-ink-2 uppercase tracking-widest">{entry.cin || "—"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs font-bold text-ink-1">{entry.reason}</span>
                    {entry.notes && <p className="text-[10px] text-ink-3 mt-0.5">{entry.notes}</p>}
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[10px] font-bold text-ink-3 uppercase tracking-widest">{entry.blockedDate}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[10px] font-bold text-ink-3 uppercase tracking-widest">{entry.blockedBy}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => handleRemove(entry.id)}
                      className="p-2 rounded-lg text-ink-3 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-ink-3 text-sm font-bold">Aucune entrée trouvée</p>
        </div>
      )}

      <AnimatePresence>
        {showForm && <BlacklistForm onAdd={handleAdd} onClose={() => setShowForm(false)} />}
      </AnimatePresence>
    </div>
  );
}

function BlacklistForm({ onAdd, onClose }: { onAdd: (data: { email: string; reason: string; notes: string }) => void; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !reason) return;
    onAdd({ email, reason, notes });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-1/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-ink-1 uppercase tracking-wider text-sm">Ajouter à la liste noire</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-ink-3 hover:text-ink-2 hover:bg-surface-2 transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-ink-3 uppercase tracking-widest mb-1.5 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@email.com"
              className="w-full px-4 py-2.5 bg-surface-1 border border-border rounded-xl text-xs text-ink-1 placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-ink-3 uppercase tracking-widest mb-1.5 block">Raison</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Motif du blocage"
              className="w-full px-4 py-2.5 bg-surface-1 border border-border rounded-xl text-xs text-ink-1 placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-ink-3 uppercase tracking-widest mb-1.5 block">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Détails optionnels..."
              rows={2}
              className="w-full px-4 py-2.5 bg-surface-1 border border-border rounded-xl text-xs text-ink-1 placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold text-ink-2 bg-surface-2 hover:bg-surface-3 transition-colors">
              Annuler
            </button>
            <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors">
              Bloquer
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
