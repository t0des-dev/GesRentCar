"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { User, Crown, Phone, MessageSquare, ChevronRight, X } from "lucide-react";
import { cn } from "@/shared/utils";
import { useAgency } from "@/hooks/useAgency";

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
  const agency = useAgency();
  const whatsappNum = agency.footer_config?.social_links?.whatsapp || agency.footer_config?.phone || "";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden fixed inset-0 z-50 overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsOpen(false)} />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="absolute right-0 top-0 h-full w-[88vw] max-w-md bg-slate-950 text-white shadow-2xl overflow-y-auto border-l border-white/10 flex flex-col justify-between"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="font-extrabold text-sm uppercase tracking-widest text-white">Menu Navigation</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="p-5 space-y-1">
                {links.map((link, i) => (
                  <Link
                    key={i}
                    href={link.url}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between px-4 py-3.5 rounded-xl text-white/90 font-bold text-sm hover:bg-white/5 hover:text-amber-400 transition-colors group"
                  >
                    <span>{link.label}</span>
                    <ChevronRight size={14} className="text-white/30 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>

              {/* Language Switcher */}
              <div className="px-5 py-3 border-t border-white/5">
                <p className="text-[9px] font-extrabold uppercase tracking-widest text-white/40 mb-2 px-1">Langue</p>
                <div className="flex gap-2">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { switchLang(l.code); setIsOpen(false); }}
                      className={cn(
                        "flex-1 py-2 rounded-xl text-xs font-bold border transition-all",
                        lang === l.code
                          ? "bg-amber-500 text-slate-950 border-amber-500"
                          : "bg-white/5 text-white/70 border-white/10 hover:border-white/20"
                      )}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-5 space-y-3 border-t border-white/10 bg-slate-900/60">
              {whatsappNum && (
                <a
                  href={`https://wa.me/${whatsappNum.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-600/30 transition-all"
                >
                  <MessageSquare size={16} />
                  <span>WhatsApp 24/7 VIP</span>
                </a>
              )}

              {session ? (
                <div className="space-y-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/10 text-white border border-white/15 text-xs font-bold hover:bg-white/20 transition-all"
                  >
                    <User size={15} />
                    <span>Mon Espace VIP</span>
                  </Link>
                  <button
                    onClick={() => { signOut(); setIsOpen(false); }}
                    className="w-full text-center py-2 text-xs text-red-400 hover:text-red-300 font-semibold"
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <Link
                  href="/fleet"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all"
                >
                  <Crown size={16} />
                  <span>{t("nav_book") || "Réserver un Véhicule"}</span>
                </Link>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
