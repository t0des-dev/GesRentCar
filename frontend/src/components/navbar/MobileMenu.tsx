"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { User, Crown } from "lucide-react";
import { cn } from "@/shared/utils";
import { Button } from "@/shared/ui/button";

interface MobileLang {
  code: "fr" | "en";
  label: string;
}

interface MobileMenuLink {
  label: string;
  url: string;
}

interface MobileMenuSession {
  user?: { name?: string };
}

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  links: MobileMenuLink[];
  languages: MobileLang[];
  lang: string;
  switchLang: (v: "fr" | "en") => void;
  session: MobileMenuSession | null;
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden fixed inset-0 top-0 z-40"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute right-0 top-0 h-full w-[85vw] max-w-sm bg-surface-0 dark:bg-ink-2 shadow-2xl overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <span className="font-bold text-lg text-ink-1">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-xl bg-surface-1 flex items-center justify-center text-ink-4 hover:bg-surface-2 transition-colors text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-1">
              {links.map((link, i) => (
                <Link
                  key={i}
                  href={link.url}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-xl text-ink-2 font-medium hover:bg-surface-1 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="px-6 pb-6 space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-4 px-4">Langue</p>
              <div className="flex gap-2 px-4">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { switchLang(l.code); setIsOpen(false); }}
                    className={cn(
                      "flex-1 py-3 rounded-xl text-sm font-semibold border transition-all",
                      lang === l.code
                        ? "bg-primary text-white border-primary"
                        : "bg-surface-0 text-ink-3 border-border hover:border-ink-4"
                    )}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {session ? (
              <div className="px-6 pb-6 space-y-2">
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-4 rounded-xl bg-primary/5 border border-primary/10 text-primary font-semibold">
                  <User size={18} />
                  {t("nav_dashboard") || "MON COMPTE VIP"}
                </Link>
                <button onClick={() => { signOut(); setIsOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl text-ink-4 hover:bg-red-50 hover:text-red-600 transition-colors font-medium">
                  {t("nav_logout") || "Déconnexion"}
                </button>
              </div>
            ) : (
              <div className="px-6 pb-4">
                <Button asChild variant="ghost" className="w-full justify-start text-ink-2 font-medium py-6 rounded-xl">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    {t("nav_login")}
                  </Link>
                </Button>
              </div>
            )}

            <div className="px-6 pb-8">
              <Button asChild variant="default" size="lg" className="w-full rounded-2xl shadow-lg">
                <Link href="/booking" onClick={() => setIsOpen(false)}>
                  <Crown size={18} />
                  {t("nav_book")}
                </Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
