"use client";

import { motion } from "framer-motion";
import { Search, Plus } from "lucide-react";

interface FleetToolbarProps {
  search: string;
  setSearch: (val: string) => void;
  onAdd: () => void;
  count: number;
}

export default function FleetToolbar({ search, setSearch, onAdd, count }: FleetToolbarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-premium flex flex-col lg:flex-row gap-4 justify-between items-center mb-8"
    >
      <div className="flex-1 flex items-center gap-4 text-ink-3">
        <Search size={20} strokeWidth={1.5} />
        <input
          type="text"
          className="input-premium flex-1"
          placeholder="Rechercher par marque, modèle ou plaque..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="text-xs font-bold uppercase tracking-wider text-ink-3 whitespace-nowrap">
        <strong className="text-ink-1 text-sm mr-1">{count}</strong> modèles en inventaire
      </div>
    </motion.div>
  );
}
