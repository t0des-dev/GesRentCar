"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { useAgency } from "@/hooks/useAgency";
import { Globe, Menu, X, CarFront, User, Crown, ChevronDown, Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { lang, switchLang, t } = useTranslation();
  const agency = useAgency();
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
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
    { label: t("nav_about"), url: "/about" }
  ];

  // Colors
  const textColor = (isScrolled || !transparentHero) ? "text-foreground" : "text-white";
  const hoverColor = (isScrolled || !transparentHero) ? "hover:text-primary" : "hover:text-secondary";

  const languages = [
    { code: "fr", label: "Français" },
    { code: "en", label: "English" },
    { code: "ar", label: "العربية" }
  ];

  const currentLangLabel = languages.find(l => l.code === lang)?.label || "Français";

  return (
    <header
      className={cn(
        sticky ? "fixed top-0 w-full z-50" : "relative w-full",
        "transition-all duration-500",
        (isScrolled || !transparentHero)
          ? "glass border-b border-border/50 shadow-lg py-3"
          : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-br from-primary to-blue-600 text-white p-2.5 rounded-xl group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/50 transition-all duration-300">
            <CarFront size={22} className="group-hover:animate-pulse" />
          </div>
          <span className={cn("text-2xl font-black tracking-tight transition-colors", textColor)}>
            {agency.agency_name?.split(' ')[0] || "Vectoria"}<span className="text-gradient-gold">{agency.agency_name?.split(' ')[1] || "Rent"}</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-semibold">
          {menuLinks.map((link: any, i: number) => (
            <Link key={i} href={link.url} className={cn("text-sm transition-all hover:-translate-y-0.5", textColor, hoverColor)}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-5">
          {/* Custom Dropdown Language Switcher */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 text-xs font-black uppercase tracking-widest",
                (isScrolled || !transparentHero)
                  ? "bg-muted/50 border-border/50 text-foreground hover:bg-muted"
                  : "bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-md"
              )}
            >
              <Globe size={14} className={cn("transition-transform duration-500", langOpen ? "rotate-180" : "rotate-0")} />
              {lang}
              <ChevronDown size={12} className={cn("transition-transform duration-300", langOpen ? "rotate-180" : "rotate-0")} />
            </button>

            <AnimatePresence>
              {langOpen && (
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
                          switchLang(l.code as any);
                          setLangOpen(false);
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

          <Link
            href="/login"
            className={cn("text-sm font-bold transition-colors flex items-center gap-2", textColor, hoverColor)}
          >
            <User size={18} />
            {t("nav_login")}
          </Link>
          <Link
            href="/booking"
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-bold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg hover:shadow-primary/40 hover:-translate-y-1 glow-primary flex items-center gap-2"
          >
            <Crown size={16} className="text-secondary" />
            {t("nav_book")}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className={cn("md:hidden p-2 rounded-xl transition-colors", (isScrolled || !transparentHero) ? "bg-muted/50 text-foreground" : "bg-black/20 text-white backdrop-blur-sm")}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 w-full glass border-b border-border shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col px-4 py-6 gap-2">
              {menuLinks.map((link: any, i: number) => (
                <Link key={i} href={link.url} className="text-foreground font-bold py-3 px-4 rounded-xl hover:bg-primary/10 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
              
              <div className="mt-4 p-4 glass rounded-3xl border border-white/10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4 ml-2">Sélectionner la langue</p>
                <div className="grid grid-cols-3 gap-2">
                  {languages.map((l) => (
                    <button 
                      key={l.code} 
                      onClick={() => { switchLang(l.code as any); setMobileMenuOpen(false); }}
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

              <Link href="/booking" className="bg-primary text-center text-white px-5 py-4 rounded-2xl font-black uppercase tracking-widest mt-6 shadow-xl glow-primary flex justify-center items-center gap-3 active:scale-95 transition-transform" onClick={() => setMobileMenuOpen(false)}>
                <Crown size={20} className="text-secondary" />
                {t("nav_book")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
