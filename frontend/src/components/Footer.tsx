"use client";

import Link from "next/link";
import { CarFront, Globe, Heart, MessageCircle, MapPin, Phone, Mail, ArrowRight, Share2, Music } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useAgency } from "@/hooks/useAgency";
import { useState } from "react";
import { Button } from "@/shared/ui/button";

export default function Footer() {
  const { t } = useTranslation();
  const agency = useAgency();
  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const footer = agency.footer_config || {};
  const social = footer.social_links || {};

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setSubscribeStatus("loading");
    try {
      // Newsletter subscription logic here
      await new Promise(r => setTimeout(r, 1000)); // Simulate API call
      setSubscribeStatus("success");
      setEmail("");
      setTimeout(() => setSubscribeStatus("idle"), 3000);
    } catch {
      setSubscribeStatus("error");
      setTimeout(() => setSubscribeStatus("idle"), 3000);
    }
  };

  return (
    <footer className="bg-surface-0 border-t border-border/20 mt-auto relative overflow-hidden">
      {/* Gradient line separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="container mx-auto px-6 lg:px-8 py-16 lg:py-20 relative z-10">
        
        {/* Main Grid — 5 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">

          {/* Column 1: Brand & Tagline */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center text-white font-bold text-lg tracking-wider">
                V
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-ink-1">
                  {agency.agency_name || "Vectoria Rent"}
                </span>
                <span className="text-xs text-gold font-semibold tracking-widest uppercase">Luxury Mobility</span>
              </div>
            </Link>

            {/* Tagline — Serif */}
            <p className="text-sm leading-relaxed text-ink-3 max-w-sm subtitle-serif">
              {agency.agency_slogan || "L'expérience ultime du voyage en véhicules de prestige."}
            </p>

            {/* Social Icons — Gold on Hover */}
            <div className="flex gap-2 mt-2">
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center text-ink-3 hover:bg-gold hover:text-white transition-all duration-300 group"
                  aria-label="Facebook"
                >
                  <Globe size={16} className="group-hover:scale-110 transition-transform" />
                </a>
              )}
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center text-ink-3 hover:bg-gold hover:text-white transition-all duration-300 group"
                  aria-label="Instagram"
                >
                  <Heart size={16} className="group-hover:scale-110 transition-transform" />
                </a>
              )}
              {social.whatsapp && (
                <a href={`https://wa.me/${social.whatsapp}`} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center text-ink-3 hover:bg-gold hover:text-white transition-all duration-300 group"
                  aria-label="WhatsApp"
                >
                  <MessageCircle size={16} className="group-hover:scale-110 transition-transform" />
                </a>
              )}
              {social.tiktok && (
                <a href={social.tiktok} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center text-ink-3 hover:bg-gold hover:text-white transition-all duration-300 group"
                  aria-label="TikTok"
                >
                  <Music size={16} className="group-hover:scale-110 transition-transform" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="flex flex-col gap-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-ink-1">Explorer</h3>
            <nav className="flex flex-col gap-3">
              {[
                { href: "/fleet", label: t("nav_fleet") || "Flotte" },
                { href: "/locations", label: t("nav_locations") || "Localités" },
                { href: "/about", label: t("nav_about") || "À Propos" },
                { href: "/contact", label: t("nav_contact") || "Contact" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-ink-3 hover:text-gold transition-colors duration-300 flex items-center gap-2 group font-medium"
                >
                  <span className="w-1.5 h-1.5 bg-gold/40 group-hover:bg-gold rounded-full transition-all" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Legal */}
          <div className="flex flex-col gap-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-ink-1">Légal</h3>
            <nav className="flex flex-col gap-3">
              {[
                { href: "/privacy", label: "Confidentialité" },
                { href: "/terms", label: "Conditions" },
                { href: "/cookies", label: "Cookies" },
                { href: "/accessibility", label: "Accessibilité" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-ink-3 hover:text-gold transition-colors duration-300 flex items-center gap-2 group font-medium"
                >
                  <span className="w-1.5 h-1.5 bg-gold/40 group-hover:bg-gold rounded-full transition-all" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 4 & 5: Contact & Newsletter */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Contact Info */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-ink-1">Contact Direct</h3>
              {footer.address && (
                <div className="flex items-start gap-3 text-sm text-ink-3">
                  <MapPin size={18} className="text-gold shrink-0 mt-0.5" />
                  <span className="font-medium">{footer.address}</span>
                </div>
              )}
              {footer.phone && (
                <div className="flex items-center gap-3 text-sm text-ink-3">
                  <Phone size={18} className="text-gold shrink-0" />
                  <a href={`tel:${footer.phone}`} className="font-medium hover:text-gold transition-colors">
                    {footer.phone}
                  </a>
                </div>
              )}
              {footer.email && (
                <div className="flex items-center gap-3 text-sm text-ink-3">
                  <Mail size={18} className="text-gold shrink-0" />
                  <a href={`mailto:${footer.email}`} className="font-medium hover:text-gold transition-colors">
                    {footer.email}
                  </a>
                </div>
              )}
            </div>

            {/* Newsletter Premium */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-ink-1">Newsletter Premium</h3>
              <p className="text-xs text-ink-3 leading-relaxed">Recevez nos offres exclusives et nouvelles arrivées.</p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="flex-1 bg-surface-1 border border-border rounded-lg px-3 py-2.5 text-sm text-ink-1 placeholder:text-ink-4 focus:border-gold focus:shadow-lg focus:shadow-gold/10 focus:outline-none transition-all duration-300"
                />
                <Button 
                  variant="gold" 
                  size="sm"
                  type="submit"
                  disabled={subscribeStatus === "loading"}
                  className="w-fit"
                >
                  <ArrowRight size={14} />
                </Button>
              </form>
              {subscribeStatus === "success" && (
                <p className="text-xs text-emerald-600 font-medium">✓ Merci de votre inscription !</p>
              )}
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border/40 to-transparent my-8" />

        {/* Copyright & Legal */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-ink-3">
          <p className="font-medium">
            © {new Date().getFullYear()} {agency.agency_name || "Vectoria Rent Car"}. 
            <span className="text-ink-4"> Tous droits réservés.</span>
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
            {[
              { href: "/privacy", label: "Confidentialité" },
              { href: "/terms", label: "Conditions" },
              { href: "/cookies", label: "Cookies" },
              { href: "/accessibility", label: "Accessibilité" },
            ].map(({ href, label }) => (
              <Link 
                key={href} 
                href={href} 
                className="hover:text-gold transition-colors duration-300 font-medium"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
