"use client";

import { useCompare } from "@/hooks/useCompare";
import { X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CompareFloatingBar() {
  const { selectedIds, removeFromCompare, clearCompare } = useCompare();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || selectedIds.length === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-2xl rounded-2xl px-5 py-4 flex items-center gap-6">
        <div className="flex flex-col gap-0.5 hidden md:flex">
          <p className="text-[10px] font-semibold text-primary uppercase tracking-widest">Comparaison</p>
          <p className="text-xs text-slate-400">{selectedIds.length} véhicule(s) sélectionné(s)</p>
        </div>

        <div className="flex items-center gap-2">
          {selectedIds.map((id) => (
            <div key={id} className="relative group">
              <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">
                {String(id).slice(0, 3).toUpperCase()}
              </div>
              <button
                onClick={() => removeFromCompare(id)}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-slate-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Retirer"
              >
                <X size={10} />
              </button>
            </div>
          ))}
          {selectedIds.length < 3 && (
            <div className="w-10 h-10 rounded-lg border border-dashed border-slate-700 flex items-center justify-center text-slate-600">
              <span className="text-lg leading-none">+</span>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-slate-800 hidden md:block" />

        <div className="flex items-center gap-3">
          <button
            onClick={clearCompare}
            className="text-[10px] font-semibold text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest"
          >
            Vider
          </button>
          <Link
            href="/compare"
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-primary/90 transition-all"
          >
            Comparer
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
