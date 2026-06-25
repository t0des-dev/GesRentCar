"use client";

import { useTranslation } from "@/shared/hooks/useTranslation";
import { useAgency } from "@/hooks/useAgency";
import { Menu } from "lucide-react";
import { useAuth } from "@/modules/auth/context/context";
import { cn } from "@/shared/utils";
import { useState, useEffect, useRef } from "react";
import { useScroll } from "framer-motion";
import { useCurrency } from "@/shared/hooks/useCurrency";

import Logo from "./navbar/Logo";
import NavLinks from "./navbar/NavLinks";
import LanguageSwitcher from "./navbar/LanguageSwitcher";
import UserActions from "./navbar/UserActions";
import MobileMenu from "./navbar/MobileMenu";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Navbar() {
  const { user, logout } = useAuth();
  const session = user ? { user: { ...user, image: undefined } } : null;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { lang, switchLang, t } = useTranslation();
  const { currency, setCurrency } = useCurrency();
  const agency = useAgency();
  const langRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsScrolled(latest > 60);
    });
    return () => unsubscribe();
  }, [scrollY]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) setLangOpen(false);
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) setCurrencyOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuLinks = agency.header_config?.menu_links || [
    { label: t("nav_fleet"), url: "/fleet" },
    { label: t("nav_locations"), url: "/locations" },
    { label: t("nav_offers"), url: "/offers" },
    { label: t("nav_about"), url: "/about" },
    { label: t("nav_contact"), url: "/contact" }
  ];

  const languages: { code: "fr" | "en" | "ar"; label: string }[] = [
    { code: "fr", label: "Français" },
    { code: "en", label: "English" },
    { code: "ar", label: "العربية" }
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "premium-glass border-b border-border/20 shadow-lg"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16" style={{ height: 'var(--navbar-height)' }}>
          {/* Logo — Premium Typography */}
          <div className="flex items-center gap-3">
            <Logo />
          </div>

          {/* Nav Links — Center with animated underlines */}
          <NavLinks links={menuLinks} isScrolled={isScrolled} />

          {/* Right Actions — Premium Dropdowns */}
          <div className="hidden md:flex items-center gap-1">
            {/* Language Switcher — Glass Style */}
            <LanguageSwitcher
              lang={lang} languages={languages} isOpen={langOpen}
              setIsOpen={setLangOpen} switchLang={switchLang}
              isScrolled={isScrolled} transparentHero={true}
              forwardRef={langRef}
            />

            {/* Currency Switcher — Glass Style */}
            <CurrencySwitcher
              currency={currency} setCurrency={setCurrency}
              currencyOpen={currencyOpen} setCurrencyOpen={setCurrencyOpen}
              isScrolled={isScrolled} currencyRef={currencyRef}
            />

            {/* Dark Mode Toggle */}
            <div className={cn(
              "transition-all duration-300",
              isScrolled ? "text-ink-1" : "text-white/75 hover:text-white"
            )}>
              <ThemeToggle />
            </div>

            {/* User Actions — Premium */}
            <UserActions session={session} signOut={() => logout()} t={t} isScrolled={isScrolled} />
          </div>

          {/* Mobile Menu Toggle — Sophisticated Icon */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className={cn(
              "md:hidden w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300",
              isScrolled 
                ? "bg-surface-2 text-ink-1 hover:bg-surface-3" 
                : "bg-white/12 text-white hover:bg-white/20 hover:text-white"
            )}
            aria-label="Toggle menu"
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <MobileMenu
        isOpen={mobileMenuOpen} setIsOpen={setMobileMenuOpen}
        links={menuLinks} languages={languages} lang={lang}
        switchLang={switchLang} session={session}
        signOut={() => logout()} t={t}
      />
    </header>
  );
}

function CurrencySwitcher({
  currency, setCurrency, currencyOpen, setCurrencyOpen, isScrolled, currencyRef
}: {
  currency: string; setCurrency: (c: any) => void;
  currencyOpen: boolean; setCurrencyOpen: (v: boolean) => void;
  isScrolled: boolean; currencyRef: any;
}) {
  return (
    <div className="relative" ref={currencyRef}>
      <button
        onClick={() => setCurrencyOpen(!currencyOpen)}
        className={cn(
          "px-3 py-1.5 rounded-lg transition-all duration-300 text-xs font-semibold tracking-wide",
          isScrolled
            ? "text-ink-1 hover:text-ink-1 hover:bg-surface-2 font-semibold"
            : "text-white/75 hover:text-white hover:bg-white/12"
        )}
      >
        {currency}
      </button>
      {currencyOpen && (
        <div className={cn(
          "absolute right-0 mt-2 w-40 rounded-xl overflow-hidden z-[60] shadow-lg border",
          "bg-surface-0 dark:bg-ink-2 border-border-subtle"
        )}>
          {["MAD", "EUR", "USD"].map((c) => (
            <button
              key={c}
              onClick={() => { setCurrency(c as any); setCurrencyOpen(false); }}
              className={cn(
                "flex items-center justify-between w-full px-4 py-2.5 text-sm transition-all",
                currency === c 
                  ? "bg-gold/12 text-gold border-l-2 border-gold font-semibold" 
                  : "text-ink-2 hover:bg-surface-1 hover:text-ink-1"
              )}
            >
              <span>{c}</span>
              {currency === c && <span className="text-gold text-lg">●</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
