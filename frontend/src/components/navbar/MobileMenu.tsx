"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { User, Crown, X, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  links: any[];
  languages: any[];
  lang: string;
  switchLang: (v: any) => void;
  session: any;
  signOut: () => void;
  t: (key: string) => string;
}

export default function MobileMenu({
  isOpen, setIsOpen, links, languages, lang, switchLang, session, signOut, t
}: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden absolute top-full left-0 w-full glass border-b border-border shadow-2xl overflow-hidden"
        >
          <div className="flex flex-col px-4 py-6 gap-2">
            {links.map((link: any, i: number) => (
              <Link key={i} href={link.url} className="text-foreground font-bold py-3 px-4 rounded-xl hover:bg-primary/10 transition-colors" onClick={() => setIsOpen(false)}>
                {link.label}
              </Link>
            ))}
            
            <div className="mt-4 p-4 glass rounded-3xl border border-white/10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4 ml-2">Sélectionner la langue</p>
              <div className="grid grid-cols-3 gap-2">
                {languages.map((l) => (
                  <button 
                    key={l.code} 
                    onClick={() => { switchLang(l.code); setIsOpen(false); }}
                    className={cn(
                      "flex flex-col items-center gap-1 py-4 rounded-2xl border transition-all", 
                      lang === l.code 
                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/30" 
                        : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                    )}
                  >
                    <span className="text-xs font-black uppercase">{l.code}</span>
                    <span className="text-[9px] font-medium opacity-60">{l.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {session ? (
              <div className="flex flex-col gap-2 mt-2">
                <Link href="/dashboard" className="text-primary font-black py-4 px-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-center gap-3" onClick={() => setIsOpen(false)}>
                  <User size={20} />
                  {t("nav_dashboard") || "MON COMPTE VIP"}
                </Link>
                <button 
                  onClick={() => { signOut(); setIsOpen(false); }}
                  className="text-muted-foreground font-bold py-3 px-4 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors text-left"
                >
                  {t("nav_logout") || "Déconnexion"}
                </button>
              </div>
            ) : (
              <Link href="/login" className="text-foreground font-bold py-3 px-4 rounded-xl hover:bg-primary/10 transition-colors" onClick={() => setIsOpen(false)}>
                {t("nav_login")}
              </Link>
            )}
            
            <Link href="/booking" className="bg-primary text-center text-white px-5 py-4 rounded-2xl font-black uppercase tracking-widest mt-6 shadow-xl glow-primary flex justify-center items-center gap-3 active:scale-95 transition-transform" onClick={() => setIsOpen(false)}>
              <Crown size={20} className="text-secondary" />
              {t("nav_book")}
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
