"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { useAgency } from "@/hooks/useAgency";
import { Menu, X, ChevronDown, Check } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useCurrency } from "@/hooks/useCurrency";

// Modular Sub-components
import Logo from "./navbar/Logo";
import NavLinks from "./navbar/NavLinks";
import LanguageSwitcher from "./navbar/LanguageSwitcher";
import UserActions from "./navbar/UserActions";
import MobileMenu from "./navbar/MobileMenu";

export default function Navbar() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { lang, switchLang, t } = useTranslation();
  const { currency, setCurrency } = useCurrency();
  const agency = useAgency();
  const langRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);
  const [currencyOpen, setCurrencyOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) setLangOpen(false);
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) setCurrencyOpen(false);
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const sticky = agency.header_config?.sticky ?? true;
  const transparentHero = agency.header_config?.transparent_hero ?? true;
  const menuLinks = agency.header_config?.menu_links || [
    { label: t("nav_fleet"), url: "/fleet" },
    { label: t("nav_locations"), url: "/locations" },
    { label: t("nav_offers"), url: "/offers" },
    { label: t("nav_about"), url: "/about" },
    { label: t("nav_contact"), url: "/contact" }
  ];

  const textColor = (isScrolled || !transparentHero) ? "text-foreground" : "text-white";
  const hoverColor = (isScrolled || !transparentHero) ? "hover:text-primary" : "hover:text-secondary";

  const languages = [
    { code: "fr", label: "Français" },
    { code: "en", label: "English" },
    { code: "ar", label: "العربية" }
  ];

  const { scrollYProgress } = useScroll();

  return (
    <header
      className={cn(
        sticky ? "fixed top-0 w-full z-50" : "relative w-full",
        "transition-all duration-700 ease-in-out",
        (isScrolled || !transparentHero)
          ? "glass-header border-b border-white/10 shadow-2xl py-3 backdrop-blur-2xl bg-white/80"
          : "bg-transparent py-7"
      )}
    >
      {/* Scroll Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-primary z-[60] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <Logo agencyName={agency.agency_name} textColor={textColor} />


        <NavLinks links={menuLinks} textColor={textColor} hoverColor={hoverColor} />

        <div className="hidden md:flex items-center gap-5">
          {/* Currency Switcher (Inline for brevity, or modularize if needed) */}
          <div className="relative" ref={currencyRef}>
            <button
              onClick={() => setCurrencyOpen(!currencyOpen)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 text-xs font-black uppercase tracking-widest",
                (isScrolled || !transparentHero)
                  ? "bg-muted/50 border-border/50 text-foreground hover:bg-muted"
                  : "bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-md"
              )}
            >
              {currency}
              <ChevronDown size={12} className={cn("transition-transform duration-300", currencyOpen ? "rotate-180" : "rotate-0")} />
            </button>
            <AnimatePresence>
              {currencyOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-32 glass-card border border-border/50 shadow-2xl p-2 z-[60]"
                >
                  <div className="flex flex-col gap-1">
                    {["MAD", "EUR", "USD"].map((c) => (
                      <button
                        key={c}
                        onClick={() => { setCurrency(c as any); setCurrencyOpen(false); }}
                        className={cn("flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200", currency === c ? "bg-primary text-white" : "hover:bg-primary/10 text-foreground")}
                      >
                        <span className="text-xs font-black">{c}</span>
                        {currency === c && <Check size={14} className="text-white" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <LanguageSwitcher 
            lang={lang} languages={languages} isOpen={langOpen} 
            setIsOpen={setLangOpen} switchLang={switchLang}
            isScrolled={isScrolled} transparentHero={transparentHero}
            forwardRef={langRef}
          />

          <UserActions 
            session={session} signOut={() => signOut({ callbackUrl: '/' })} 
            t={t} textColor={textColor} hoverColor={hoverColor} 
          />
        </div>

        <button
          className={cn("md:hidden p-2 rounded-xl transition-colors", (isScrolled || !transparentHero) ? "bg-muted/50 text-foreground" : "bg-black/20 text-white backdrop-blur-sm")}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <MobileMenu 
        isOpen={mobileMenuOpen} setIsOpen={setMobileMenuOpen}
        links={menuLinks} languages={languages} lang={lang}
        switchLang={switchLang} session={session}
        signOut={() => signOut({ callbackUrl: '/' })} t={t}
      />
    </header>
  );
}
