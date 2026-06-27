"use client";

import { useState, useEffect } from "react";
import { Monitor, Grid2X2, Grid3X3, LayoutGrid, Rows3, Save, Check } from "lucide-react";
import { cn } from "@/shared/utils";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

interface FleetDisplaySettingsProps {
  className?: string;
}

interface FleetSettings {
  pageSize: number;
  columns: number;
}

const DEFAULTS: FleetSettings = { pageSize: 10, columns: 4 };
const PAGE_SIZES = [6, 8, 10, 12, 16, 20];
const COLUMN_OPTIONS = [
  { value: 2, icon: Grid2X2, label: "2 col" },
  { value: 3, icon: Grid3X3, label: "3 col" },
  { value: 4, icon: LayoutGrid, label: "4 col" },
];

function loadSettings(): FleetSettings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem("vrc_fleet_settings");
    if (raw) {
      const p = JSON.parse(raw);
      return { pageSize: p.pageSize || DEFAULTS.pageSize, columns: p.columns || DEFAULTS.columns };
    }
  } catch {}
  return DEFAULTS;
}

export default function FleetDisplaySettings({ className }: FleetDisplaySettingsProps) {
  const [settings, setSettings] = useState<FleetSettings>(DEFAULTS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const save = () => {
    localStorage.setItem("vrc_fleet_settings", JSON.stringify(settings));
    toast.success("Affichage mis à jour. La page fleet utilisera ces paramètres.");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={cn("bg-white border border-slate-100 rounded-2xl p-6 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center">
            <Monitor size={18} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Affichage Fleet Public</h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Colonnes & pagination</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={save}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
            saved ? "bg-emerald-500 text-white" : "bg-slate-900 text-white hover:bg-slate-800"
          )}
        >
          {saved ? <Check size={14} /> : <Save size={14} />}
          {saved ? "Sauvegardé" : "Sauvegarder"}
        </motion.button>
      </div>

      {/* Columns */}
      <div className="space-y-3 mb-6">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Colonnes par ligne
        </label>
        <div className="flex gap-3">
          {COLUMN_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isActive = settings.columns === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setSettings(s => ({ ...s, columns: opt.value }))}
                className={cn(
                  "flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                  isActive
                    ? "border-primary bg-primary/5 text-primary shadow-sm"
                    : "border-slate-100 bg-slate-50/50 text-slate-400 hover:border-slate-200"
                )}
              >
                <Icon size={20} />
                <span className="text-[10px] font-bold uppercase tracking-wider">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Page Size */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Véhicules par page
        </label>
        <div className="flex flex-wrap gap-2">
          {PAGE_SIZES.map((size) => {
            const isActive = settings.pageSize === size;
            return (
              <button
                key={size}
                onClick={() => setSettings(s => ({ ...s, pageSize: size }))}
                className={cn(
                  "px-4 py-2.5 rounded-lg border-2 text-xs font-bold transition-all",
                  isActive
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-slate-100 bg-slate-50/50 text-slate-500 hover:border-slate-200"
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
