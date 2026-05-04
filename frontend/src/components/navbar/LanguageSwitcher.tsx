"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Globe, ChevronDown, Check } from "lucide-react";
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
          "flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 text-xs font-black uppercase tracking-widest",
          (isScrolled || !transparentHero)
            ? "bg-muted/50 border-border/50 text-foreground hover:bg-muted"
            : "bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-md"
        )}
      >
        <Globe size={14} className={cn("transition-transform duration-500", isOpen ? "rotate-180" : "rotate-0")} />
        {lang}
        <ChevronDown size={12} className={cn("transition-transform duration-300", isOpen ? "rotate-180" : "rotate-0")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-48 glass-card border border-border/50 shadow-2xl p-2 z-[60]"
          >
            <div className="flex flex-col gap-1">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    switchLang(l.code);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
                    lang === l.code ? "bg-primary text-white" : "hover:bg-primary/10 text-foreground"
                  )}
                >
                  <span className={cn("text-sm font-bold", lang === l.code ? "" : "text-muted-foreground group-hover:text-primary")}>
                    {l.label}
                  </span>
                  {lang === l.code && <Check size={16} className="text-white" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
