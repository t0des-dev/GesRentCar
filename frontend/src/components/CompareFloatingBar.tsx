"use client";

import { useCompare } from "@/hooks/useCompare";
import { useVehicles } from "@/hooks/useApi";
import { X, ArrowRight, BarChart3 } from "lucide-react";
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
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
      <div className="bg-card/80 backdrop-blur-xl border border-primary/20 shadow-2xl rounded-3xl p-4 md:p-6 flex items-center gap-6">
        <div className="flex flex-col gap-1 hidden md:flex">
          <p className="text-xs font-bold text-primary uppercase tracking-widest">Comparaison</p>
          <p className="text-sm font-medium">{selectedIds.length} véhicule(s) sélectionné(s)</p>
        </div>

        <div className="flex items-center gap-3">
          {selectedIds.map((id) => (
            <div key={id} className="relative group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
                <BarChart3 size={20} />
              </div>
              <button
                onClick={() => removeFromCompare(id)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          
          {selectedIds.length < 3 && (
            <div className="w-12 h-12 rounded-xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground/40">
              <span className="text-lg">+</span>
            </div>
          )}
        </div>

        <div className="h-10 w-px bg-border mx-2 hidden md:block" />

        <div className="flex items-center gap-3">
          <button
            onClick={clearCompare}
            className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
          >
            Vider
          </button>
          <Link
            href="/compare"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl
                       text-sm font-bold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all"
          >
            Comparer
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
