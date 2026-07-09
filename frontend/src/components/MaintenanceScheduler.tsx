"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench,
  Plus,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Trash2,
  ChevronDown,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/shared/utils";
import { fmt } from "@/shared/utils/format";

type MaintenanceStatus = "scheduled" | "in_progress" | "completed" | "overdue";
type MaintenanceType = "oil_change" | "tire_rotation" | "brake_check" | "inspection" | "repair" | "other";

interface MaintenanceItem {
  id: number;
  vehicleId: number;
  vehicleName: string;
  type: MaintenanceType;
  date: string;
  estimatedCost: number;
  notes: string;
  status: MaintenanceStatus;
}

const STATUS_CONFIG: Record<MaintenanceStatus, { label: string; icon: typeof CheckCircle; bg: string; text: string }> = {
  scheduled: { label: "Planifié", icon: Clock, bg: "bg-blue-50", text: "text-blue-600" },
  in_progress: { label: "En cours", icon: Wrench, bg: "bg-amber-50", text: "text-amber-600" },
  completed: { label: "Terminé", icon: CheckCircle, bg: "bg-emerald-50", text: "text-emerald-600" },
  overdue: { label: "En retard", icon: AlertTriangle, bg: "bg-red-50", text: "text-red-600" },
};

const TYPE_LABELS: Record<MaintenanceType, string> = {
  oil_change: "Vidange",
  tire_rotation: "Rotation pneus",
  brake_check: "Contrôle freins",
  inspection: "Inspection",
  repair: "Réparation",
  other: "Autre",
};

export default function MaintenanceScheduler() {
  const [items, setItems] = useState<MaintenanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<MaintenanceStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const mockData: MaintenanceItem[] = [
      { id: 1, vehicleId: 1, vehicleName: "Renault Clio 2024", type: "oil_change", date: "2026-07-15", estimatedCost: 450, notes: "Vidange 10k km", status: "scheduled" },
      { id: 2, vehicleId: 2, vehicleName: "Dacia Duster 2023", type: "tire_rotation", date: "2026-07-05", estimatedCost: 200, notes: "Rotation saisonnière", status: "overdue" },
      { id: 3, vehicleId: 3, vehicleName: "Peugeot 308 2024", type: "brake_check", date: "2026-07-20", estimatedCost: 350, notes: "Contrôle plaquettes", status: "scheduled" },
      { id: 4, vehicleId: 1, vehicleName: "Renault Clio 2024", type: "inspection", date: "2026-06-28", estimatedCost: 500, notes: "Contrôle technique annuel", status: "completed" },
      { id: 5, vehicleId: 4, vehicleName: "Toyota Yaris 2024", type: "repair", date: "2026-07-01", estimatedCost: 1200, notes: "Réparation climatisation", status: "in_progress" },
    ];
    setTimeout(() => { setItems(mockData); setLoading(false); }, 400);
  }, []);

  const filtered = useMemo(() => {
    return items.filter(item => {
      const matchesStatus = filterStatus === "all" || item.status === filterStatus;
      const matchesSearch = item.vehicleName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [items, filterStatus, searchQuery]);

  const handleAddItem = (newItem: Omit<MaintenanceItem, "id" | "status">) => {
    const status: MaintenanceStatus = new Date(newItem.date) < new Date() ? "overdue" : "scheduled";
    setItems(prev => [...prev, { ...newItem, id: Date.now(), status }]);
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  if (loading) {
    return (
      <div className="bg-white border border-border rounded-2xl p-20 text-center flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-ink-3">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Wrench size={18} className="text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-ink-1 uppercase tracking-wider text-sm">Planning Maintenance</h3>
            <p className="text-[10px] text-ink-3 font-bold uppercase tracking-widest">{items.length} interventions</p>
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
            placeholder="Rechercher véhicule..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-surface-1 border border-border rounded-xl text-xs text-ink-1 placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as MaintenanceStatus | "all")}
          className="px-3 py-2.5 bg-surface-1 border border-border rounded-xl text-xs text-ink-1 focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">Tous les statuts</option>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {filtered.map((item) => {
            const cfg = STATUS_CONFIG[item.status];
            const Icon = cfg.icon;
            const isOverdue = item.status === "overdue";
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border transition-all group",
                  isOverdue ? "border-red-200 bg-red-50/50" : "border-border bg-surface-0 hover:bg-surface-1"
                )}
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", cfg.bg)}>
                  <Icon size={16} className={cfg.text} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-ink-1 text-sm truncate">{item.vehicleName}</p>
                    <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest", cfg.bg, cfg.text)}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-ink-3 font-bold uppercase tracking-widest mt-0.5">
                    {TYPE_LABELS[item.type]} · {item.date} · {fmt(item.estimatedCost)} DH
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-lg text-ink-3 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-ink-3 text-sm font-bold">Aucune maintenance trouvée</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <MaintenanceForm onAdd={handleAddItem} onClose={() => setShowForm(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function MaintenanceForm({ onAdd, onClose }: { onAdd: (item: Omit<MaintenanceItem, "id" | "status">) => void; onClose: () => void }) {
  const [vehicleName, setVehicleName] = useState("");
  const [type, setType] = useState<MaintenanceType>("oil_change");
  const [date, setDate] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleName || !date || !estimatedCost) return;
    onAdd({ vehicleId: 0, vehicleName, type, date, estimatedCost: Number(estimatedCost), notes });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-ink-1/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-ink-1 uppercase tracking-wider text-sm">Nouvelle Maintenance</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-ink-3 hover:text-ink-2 hover:bg-surface-2 transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-ink-3 uppercase tracking-widest mb-1.5 block">Véhicule</label>
            <input
              type="text"
              value={vehicleName}
              onChange={(e) => setVehicleName(e.target.value)}
              placeholder="Nom du véhicule"
              className="w-full px-4 py-2.5 bg-surface-1 border border-border rounded-xl text-xs text-ink-1 placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-ink-3 uppercase tracking-widest mb-1.5 block">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as MaintenanceType)}
              className="w-full px-4 py-2.5 bg-surface-1 border border-border rounded-xl text-xs text-ink-1 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {Object.entries(TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-ink-3 uppercase tracking-widest mb-1.5 block">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-1 border border-border rounded-xl text-xs text-ink-1 focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-ink-3 uppercase tracking-widest mb-1.5 block">Coût estimé (DH)</label>
              <input
                type="number"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2.5 bg-surface-1 border border-border rounded-xl text-xs text-ink-1 placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
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
            <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary/90 transition-colors">
              Planifier
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
