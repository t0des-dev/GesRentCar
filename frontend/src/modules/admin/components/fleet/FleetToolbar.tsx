"use client";

import { motion } from "framer-motion";
import { Search, Download, Trash2, X, Filter, Tag, Settings2 } from "lucide-react";
import { cn } from "@/shared/utils";

interface FleetToolbarProps {
  search: string;
  setSearch: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  onAdd: () => void;
  count: number;
  onExport: () => void;
  selectedIds?: number[];
  onClearSelection?: () => void;
  onBulkDelete?: () => void;
  onBulkStatusChange?: (status: string) => void;
}

export default function FleetToolbar({
  search, setSearch,
  statusFilter, setStatusFilter,
  categoryFilter, setCategoryFilter,
  onAdd, count, onExport,
  selectedIds = [],
  onClearSelection,
  onBulkDelete,
  onBulkStatusChange
}: FleetToolbarProps) {
  
  if (selectedIds.length > 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 p-3 px-5 rounded-2xl bg-ink-1 shadow-xl shadow-ink-1/10 text-white"
      >
        <div className="flex items-center gap-4">
          <button onClick={onClearSelection} className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-slate-300 hover:text-white">
            <X size={16} />
          </button>
          <span className="text-sm font-bold tracking-wider">
            {selectedIds.length} sélectionné{selectedIds.length > 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <select 
            className="bg-white/10 border border-white/10 hover:bg-white/20 text-white h-10 px-4 rounded-xl text-xs font-bold outline-none cursor-pointer transition-colors backdrop-blur-md"
            onChange={(e) => onBulkStatusChange && e.target.value && onBulkStatusChange(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled className="text-ink-1">Action rapide...</option>
            <option value="available" className="text-ink-1">🟢 Rendre Disponible</option>
            <option value="rented" className="text-ink-1">🔵 Mettre en Location</option>
            <option value="maintenance" className="text-ink-1">🟠 Mettre en Maintenance</option>
          </select>
          <button 
            onClick={onBulkDelete}
            className="h-10 px-4 bg-red-500/90 hover:bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 backdrop-blur-md"
          >
            <Trash2 size={14} /> Supprimer
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col xl:flex-row gap-4 justify-between items-center mb-8"
    >
      <div className="flex-1 w-full bg-surface-0 rounded-2xl p-2 border border-border/60 shadow-sm flex flex-col md:flex-row gap-2 items-center">
        
        {/* Search */}
        <div className="flex-1 flex items-center gap-3 px-4 w-full h-12 border-b md:border-b-0 md:border-r border-border/60">
          <Search size={18} className="text-ink-3 shrink-0" />
          <input
            type="text"
            className="w-full bg-transparent border-none focus:outline-none text-sm font-semibold text-ink-1 placeholder:text-ink-3 placeholder:font-medium"
            placeholder="Rechercher (Marque, Modèle, Immatriculation)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto px-2">
          <div className="relative group flex items-center">
            <Tag size={14} className="absolute left-3 text-ink-3 group-hover:text-primary transition-colors pointer-events-none" />
            <select 
              className="appearance-none bg-surface-1 hover:bg-surface-2 border border-border text-ink-2 text-[10px] font-bold uppercase tracking-wider h-10 pl-9 pr-8 rounded-xl outline-none cursor-pointer transition-colors w-full md:w-auto min-w-[140px]"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous statuts</option>
              <option value="available">Disponibles</option>
              <option value="rented">En Location</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div className="relative group flex items-center">
            <Filter size={14} className="absolute left-3 text-ink-3 group-hover:text-primary transition-colors pointer-events-none" />
            <select 
              className="appearance-none bg-surface-1 hover:bg-surface-2 border border-border text-ink-2 text-[10px] font-bold uppercase tracking-wider h-10 pl-9 pr-8 rounded-xl outline-none cursor-pointer transition-colors w-full md:w-auto min-w-[150px]"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
            >
              <option value="all">Toutes classes</option>
              <option value="eco">Économique</option>
              <option value="standard">Standard</option>
              <option value="suv">SUV / 4x4</option>
              <option value="luxury">Luxe / Prestige</option>
              <option value="sport">Sport / Cabriolet</option>
            </select>
          </div>
        </div>

      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink-3 bg-surface-0 border border-border px-4 h-12 rounded-2xl shadow-sm">
          <span className="text-ink-1 text-sm font-black">{count}</span>
          <span>Actifs</span>
        </div>
        <button 
          onClick={onExport}
          className="h-12 px-6 bg-ink-1 text-surface-0 rounded-2xl text-[10px] font-bold uppercase tracking-wider hover:bg-ink-2 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <Download size={16} /> Exporter
        </button>
      </div>
    </motion.div>
  );
}
