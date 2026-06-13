"use client";

import { motion } from "framer-motion";
import { Search, Download, Trash2, X, Filter, Tag, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
        className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 p-3 px-5 rounded-2xl bg-slate-900 shadow-xl shadow-slate-900/10 text-white"
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
            className="bg-white/10 border border-white/10 hover:bg-white/20 text-white h-10 px-4 rounded-xl text-xs font-bold outline-none cursor-pointer transition-colors"
            onChange={(e) => onBulkStatusChange && e.target.value && onBulkStatusChange(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled className="text-slate-900">Action rapide...</option>
            <option value="available" className="text-slate-900">🟢 Rendre Disponible</option>
            <option value="rented" className="text-slate-900">🔵 Mettre en Location</option>
            <option value="maintenance" className="text-slate-900">🟠 Mettre en Maintenance</option>
          </select>
          <button 
            onClick={onBulkDelete}
            className="h-10 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
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
      <div className="flex-1 w-full bg-white rounded-2xl p-2 border-2 border-slate-100 shadow-sm flex flex-col md:flex-row gap-2 items-center">
        
        {/* Search */}
        <div className="flex-1 flex items-center gap-3 px-4 w-full h-12 border-b md:border-b-0 md:border-r border-slate-100">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            className="w-full bg-transparent border-none focus:outline-none text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-medium"
            placeholder="Rechercher (Marque, Modèle, Immatriculation)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto px-2">
          <div className="relative group flex items-center">
            <Tag size={14} className="absolute left-3 text-slate-400 group-hover:text-primary transition-colors pointer-events-none" />
            <select 
              className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider h-10 pl-9 pr-8 rounded-xl outline-none cursor-pointer transition-colors w-full md:w-auto min-w-[140px]"
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
            <Filter size={14} className="absolute left-3 text-slate-400 group-hover:text-primary transition-colors pointer-events-none" />
            <select 
              className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider h-10 pl-9 pr-8 rounded-xl outline-none cursor-pointer transition-colors w-full md:w-auto min-w-[150px]"
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
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 bg-white border border-slate-200 px-4 h-12 rounded-2xl shadow-sm">
          <span className="text-slate-900 text-sm">{count}</span>
          <span>Actifs</span>
        </div>
        <button 
          onClick={onExport}
          className="h-12 px-6 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <Download size={16} /> Exporter
        </button>
      </div>
    </motion.div>
  );
}
