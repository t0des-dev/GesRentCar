"use client";

import { useCompare } from "@/hooks/useCompare";
import { X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/shared/ui/button";

export default function CompareFloatingBar() {
  const { selectedIds, removeFromCompare, clearCompare } = useCompare();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || selectedIds.length === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-ink-1/90 backdrop-blur-xl border border-ink-2 shadow-2xl rounded-2xl px-5 py-4 flex items-center gap-6">
        <div className="flex flex-col gap-0.5 hidden md:flex">
          <p className="text-[10px] font-semibold text-primary uppercase tracking-widest">Comparaison</p>
          <p className="text-xs text-ink-3">{selectedIds.length} véhicule(s) sélectionné(s)</p>
        </div>

        <div className="flex items-center gap-2">
          {selectedIds.map((id) => (
            <div key={id} className="relative group">
              <div className="w-10 h-10 rounded-lg bg-ink-2 border border-ink-3 flex items-center justify-center text-xs font-bold text-ink-3">
                {String(id).slice(0, 3).toUpperCase()}
              </div>
              <button
                onClick={() => removeFromCompare(id)}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-ink-3 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Retirer"
              >
                <X size={10} />
              </button>
            </div>
          ))}
          {selectedIds.length < 3 && (
            <div className="w-10 h-10 rounded-lg border border-dashed border-ink-3 flex items-center justify-center text-ink-2">
              <span className="text-lg leading-none">+</span>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-ink-2 hidden md:block" />

        <div className="flex items-center gap-3">
          <button
            onClick={clearCompare}
            className="text-[10px] font-semibold text-ink-2 hover:text-ink-3 transition-colors uppercase tracking-widest"
          >
            Vider
          </button>
          <Button asChild variant="default" size="sm" className="rounded-xl h-auto py-2.5">
            <Link href="/compare">
              Comparer
              <ArrowRight size={14} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
