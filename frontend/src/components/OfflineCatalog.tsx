"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Download,
  CheckCircle,
  Clock,
  Car,
  HardDrive,
} from "lucide-react";
import { cn } from "@/shared/utils";
import { fmt } from "@/shared/utils/format";

interface CachedVehicle {
  id: number;
  name: string;
  brand: string;
  pricePerDay: number;
  available: boolean;
  lastUpdated: string;
}

export default function OfflineCatalog() {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [cachedVehicles, setCachedVehicles] = useState<CachedVehicle[]>([]);
  const [cacheSize, setCacheSize] = useState("0 KB");

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const mockCached: CachedVehicle[] = [
      { id: 1, name: "Renault Clio 2024", brand: "Renault", pricePerDay: 350, available: true, lastUpdated: "2026-07-08 14:00" },
      { id: 2, name: "Dacia Duster 2024", brand: "Dacia", pricePerDay: 500, available: true, lastUpdated: "2026-07-08 14:00" },
      { id: 3, name: "Peugeot 308 2024", brand: "Peugeot", pricePerDay: 450, available: false, lastUpdated: "2026-07-08 14:00" },
    ];
    setCachedVehicles(mockCached);
    setCacheSize("2.4 MB");
    setLastSync("2026-07-08 14:00");

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setLastSync(new Date().toLocaleString("fr-FR"));
      setIsSyncing(false);
    }, 2000);
  };

  const handleCacheAll = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setCacheSize("3.1 MB");
      setIsSyncing(false);
    }, 1500);
  };

  return (
    <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <HardDrive size={18} className="text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-ink-1 uppercase tracking-wider text-sm">Catalogue Hors-ligne</h3>
            <p className="text-[10px] text-ink-3 font-bold uppercase tracking-widest">{cachedVehicles.length} véhicule(s) en cache</p>
          </div>
        </div>
        <div className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
          isOnline ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
        )}>
          {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
          {isOnline ? "En ligne" : "Hors-ligne"}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-surface-1 rounded-xl p-3 border border-border text-center">
          <HardDrive size={16} className="mx-auto text-ink-3 mb-1" />
          <p className="text-lg font-black text-ink-1">{cacheSize}</p>
          <p className="text-[9px] font-bold text-ink-3 uppercase tracking-widest">Cache utilisé</p>
        </div>
        <div className="bg-surface-1 rounded-xl p-3 border border-border text-center">
          <Car size={16} className="mx-auto text-ink-3 mb-1" />
          <p className="text-lg font-black text-ink-1">{cachedVehicles.length}</p>
          <p className="text-[9px] font-bold text-ink-3 uppercase tracking-widest">Véhicules</p>
        </div>
        <div className="bg-surface-1 rounded-xl p-3 border border-border text-center">
          <Clock size={16} className="mx-auto text-ink-3 mb-1" />
          <p className="text-[10px] font-black text-ink-1 leading-tight">{lastSync || "Jamais"}</p>
          <p className="text-[9px] font-bold text-ink-3 uppercase tracking-widest">Dernière synchro</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleSync}
          disabled={isSyncing || !isOnline}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
          Synchroniser
        </button>
        <button
          onClick={handleCacheAll}
          disabled={isSyncing || !isOnline}
          className="flex-1 flex items-center justify-center gap-2 bg-surface-1 border border-border text-ink-2 px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-surface-2 transition-colors disabled:opacity-50"
        >
          <Download size={14} />
          Tout cache
        </button>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-bold text-ink-3 uppercase tracking-widest mb-2">Véhicules en cache</p>
        {cachedVehicles.map((v) => (
          <div key={v.id} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-surface-0">
            <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center shrink-0">
              <Car size={14} className="text-ink-3" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-ink-1 text-xs truncate">{v.name}</p>
              <p className="text-[10px] text-ink-3 font-bold uppercase tracking-widest">{v.pricePerDay} DH/jour</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className={cn(
                "w-2 h-2 rounded-full",
                v.available ? "bg-emerald-500" : "bg-red-500"
              )} />
              <span className="text-[9px] font-bold text-ink-3 uppercase tracking-widest">
                {v.available ? "Dispo" : "Indispo"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {!isOnline && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest flex items-center gap-1.5">
            <WifiOff size={12} />
            Mode hors-ligne — Les données affichées proviennent du cache local
          </p>
        </div>
      )}
    </div>
  );
}
