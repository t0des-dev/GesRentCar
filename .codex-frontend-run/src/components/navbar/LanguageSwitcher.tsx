"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ForwardedRef } from "react";

interface LanguageSwitcherProps {
  lang: string;
  languages: any[];
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  switchLang: (v: any) => void;
  isScrolled: boolean;
  transparentHero: boolean;
  forwardRef: ForwardedRef<HTMLDivElement>;
}

export default function LanguageSwitcher({
  lang, languages, isOpen, setIsOpen, switchLang, isScrolled, transparentHero, forwardRef
}: LanguageSwitcherProps) {
  return (
    <div className="relative" ref={forwardRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 text-xs font-semibold",
          (isScrolled || !transparentHero)
            ? "text-foreground/60 hover:text-foreground hover:bg-muted/60"
            : "text-white/70 hover:text-white hover:bg-white/10"
        )}
      >
        <Globe size={14} />
        <span className="uppercase">{lang}</span>
        <ChevronDown size={12} className={cn("transition-transform duration-300", isOpen ? "rotate-180" : "")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-[60]"
          >
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => { switchLang(l.code); setIsOpen(false); }}
                className={cn(
                  "flex items-center justify-between w-full px-4 py-3 text-sm transition-colors",
                  lang === l.code
                    ? "bg-primary/5 text-primary font-semibold"
                    : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <span>{l.label}</span>
                {lang === l.code && <span className="text-primary">●</span>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
