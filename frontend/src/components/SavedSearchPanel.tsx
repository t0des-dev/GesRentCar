"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bookmark,
  Trash2,
  Play,
  Bell,
  BellOff,
  Search,
  Plus,
  X,
  Filter,
} from "lucide-react";
import { cn } from "@/shared/utils";

interface SavedSearch {
  id: number;
  name: string;
  filters: Record<string, string>;
  notify: boolean;
  createdAt: string;
}

export default function SavedSearchPanel() {
  const [searches, setSearches] = useState<SavedSearch[]>([
    { id: 1, name: "SUV disponibles juillet", filters: { type: "SUV", status: "available", month: "Juillet" }, notify: true, createdAt: "2026-06-28" },
    { id: 2, name: "Berlines < 500 DH/jour", filters: { type: "Berline", maxPrice: "500", status: "available" }, notify: false, createdAt: "2026-06-25" },
    { id: 3, name: "Véhicules familiaux", filters: { seats: "7+", type: "Van", status: "available" }, notify: true, createdAt: "2026-06-20" },
  ]);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [currentFilters] = useState<Record<string, string>>({ type: "SUV", status: "available" });

  const handleDelete = (id: number) => {
    setSearches(prev => prev.filter(s => s.id !== id));
  };

  const handleToggleNotify = (id: number) => {
    setSearches(prev => prev.map(s => s.id === id ? { ...s, notify: !s.notify } : s));
  };

  const handleSave = (name: string) => {
    setSearches(prev => [
      { id: Date.now(), name, filters: { ...currentFilters }, notify: true, createdAt: new Date().toISOString().split("T")[0] },
      ...prev,
    ]);
    setShowSaveForm(false);
  };

  return (
    <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bookmark size={18} className="text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-ink-1 uppercase tracking-wider text-sm">Recherches Sauvegardées</h3>
            <p className="text-[10px] text-ink-3 font-bold uppercase tracking-widest">{searches.length} recherches</p>
          </div>
        </div>
        <button
          onClick={() => setShowSaveForm(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors"
        >
          <Plus size={14} />
          Sauvegarder
        </button>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {searches.map((search) => (
            <motion.div
              key={search.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-4 p-4 rounded-xl border border-border bg-surface-0 hover:bg-surface-1 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center shrink-0">
                <Search size={16} className="text-ink-3" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-ink-1 text-sm">{search.name}</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {Object.entries(search.filters).map(([key, val]) => (
                    <span key={key} className="px-2 py-0.5 bg-surface-2 rounded text-[10px] font-bold text-ink-3 uppercase tracking-widest">
                      {key}: {val}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleToggleNotify(search.id)}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    search.notify ? "text-primary bg-primary/10" : "text-ink-3 hover:bg-surface-2"
                  )}
                  title={search.notify ? "Notifications activées" : "Notifications désactivées"}
                >
                  {search.notify ? <Bell size={14} /> : <BellOff size={14} />}
                </button>
                <button
                  className="p-2 rounded-lg text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                  title="Relancer la recherche"
                >
                  <Play size={14} />
                </button>
                <button
                  onClick={() => handleDelete(search.id)}
                  className="p-2 rounded-lg text-ink-3 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {searches.length === 0 && (
        <div className="py-12 text-center">
          <Bookmark size={32} className="mx-auto text-ink-3/30 mb-3" />
          <p className="text-ink-3 text-sm font-bold">Aucune recherche sauvegardée</p>
        </div>
      )}

      <AnimatePresence>
        {showSaveForm && <SaveSearchForm onSave={handleSave} onClose={() => setShowSaveForm(false)} filters={currentFilters} />}
      </AnimatePresence>
    </div>
  );
}

function SaveSearchForm({ onSave, onClose, filters }: { onSave: (name: string) => void; onClose: () => void; filters: Record<string, string> }) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name.trim());
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-1/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-ink-1 uppercase tracking-wider text-sm">Sauvegarder la recherche</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-ink-3 hover:text-ink-2 hover:bg-surface-2 transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-ink-3 uppercase tracking-widest mb-1.5 block">Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ma recherche"
              className="w-full px-4 py-2.5 bg-surface-1 border border-border rounded-xl text-xs text-ink-1 placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
              autoFocus
              required
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(filters).map(([key, val]) => (
              <span key={key} className="px-2 py-0.5 bg-surface-2 rounded text-[10px] font-bold text-ink-3 uppercase tracking-widest">
                {key}: {val}
              </span>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold text-ink-2 bg-surface-2 hover:bg-surface-3 transition-colors">
              Annuler
            </button>
            <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary/90 transition-colors">
              Sauvegarder
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
