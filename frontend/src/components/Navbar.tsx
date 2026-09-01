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
import GlobalSearch from "./GlobalSearch";
import Link from "next/link";
import { Crown } from "lucide-react";

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
      setIsScrolled(latest > 50);
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

  const getNavLabel = (url: string, fallback: string) => {
    if (url === "/" || url === "") return t("nav_home") || fallback;
    if (url.startsWith("/fleet")) return t("nav_fleet") || fallback;
    if (url.startsWith("/services")) return t("nav_services") || fallback;
    if (url.startsWith("/pricing")) return t("nav_pricing") || fallback;
    if (url.startsWith("/zones")) return t("nav_zones") || fallback;
    if (url.startsWith("/locations")) return t("nav_locations") || fallback;
    if (url.startsWith("/offers")) return t("nav_offers") || fallback;
    if (url.startsWith("/about")) return t("nav_about") || fallback;
    if (url.startsWith("/faq")) return t("nav_faq") || fallback;
    if (url.startsWith("/contact")) return t("nav_contact") || fallback;
    return fallback;
  };

  const defaultLinks = [
    { label: t("nav_fleet"), url: "/fleet" },
    { label: t("nav_services"), url: "/services" },
    { label: t("nav_pricing"), url: "/pricing" },
    { label: t("nav_zones"), url: "/zones" },
    { label: t("nav_locations"), url: "/locations" },
    { label: t("nav_offers"), url: "/offers" },
    { label: t("nav_about"), url: "/about" },
    { label: t("nav_faq") || "FAQ", url: "/faq" },
    { label: t("nav_contact"), url: "/contact" }
  ];

  const rawLinks = agency.header_config?.menu_links && agency.header_config.menu_links.length > 0
    ? agency.header_config.menu_links
    : defaultLinks;

  const menuLinks = rawLinks.map(l => ({
    label: getNavLabel(l.url, l.label),
    url: l.url
  }));

  const languages: { code: "fr" | "en"; label: string }[] = [
    { code: "fr", label: "Français" },
    { code: "en", label: "English" }
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled ? "py-2 px-3 sm:px-6" : "py-3 px-6 bg-gradient-to-b from-black/60 via-black/20 to-transparent text-white"
      )}
    >
      <div
        className={cn(
          "transition-all duration-500 mx-auto",
          isScrolled
            ? "max-w-6xl rounded-full bg-slate-950/85 backdrop-blur-xl border border-white/10 shadow-2xl px-5 py-1.5 text-white"
            : "container"
        )}
      >
        <div className="flex items-center justify-between h-14">
          {/* Logo — Premium Typography */}
          <div className="flex items-center gap-3">
            <Logo />
          </div>

          {/* Nav Links — Center with animated underlines */}
          <NavLinks links={menuLinks} isScrolled={isScrolled} />

          {/* Right Actions — Premium Dropdowns & VIP CTA */}
          <div className="hidden md:flex items-center gap-2">
            {/* Global Search */}
            <GlobalSearch />

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

            {/* User Actions — Account / Profile */}
            <UserActions session={session} signOut={() => logout()} t={t} isScrolled={isScrolled} />

            {/* Quick VIP Reserve CTA Button */}
            <Link
              href="/fleet"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all duration-300 ml-1"
            >
              <Crown size={14} className="shrink-0" />
              <span>{t("nav_book") || "Réserver"}</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className={cn(
              "md:hidden w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border",
              isScrolled
                ? "bg-white/10 text-white border-white/15 hover:bg-white/20"
                : "bg-black/30 text-white border-white/20 hover:bg-black/50"
            )}
            aria-label="Toggle menu"
          >
            <Menu size={18} strokeWidth={1.75} />
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
            ? "text-slate-300 hover:text-white hover:bg-white/10"
            : "text-white/80 hover:text-white hover:bg-white/10"
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
