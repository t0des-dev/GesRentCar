"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, ArrowRight, Clock } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useAgency } from "@/hooks/useAgency";
import { useState } from "react";
import { Button } from "@/shared/ui/button";

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

function TiktokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  );
}

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

const SOCIAL_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  tiktok: TiktokIcon,
  whatsapp: WhatsAppIcon,
};

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
      await new Promise(r => setTimeout(r, 1000));
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
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="container mx-auto px-6 lg:px-8 py-16 lg:py-20 relative z-10">

        {/* Main Grid — 4 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">

          {/* Column 1: Brand & Tagline */}
          <div className="flex flex-col gap-4">
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

            <p className="text-sm leading-relaxed text-ink-3 max-w-sm subtitle-serif">
              {agency.agency_slogan || "L&apos;expérience ultime du voyage en véhicules de prestige."}
            </p>

            {/* Social Icons */}
            <div className="flex gap-2 mt-2">
              {Object.entries(social).map(([platform, url]) => {
                if (!url || typeof url !== "string") return null;
                const Icon = SOCIAL_ICONS[platform];
                const href = platform === "whatsapp" ? `https://wa.me/${url}` : url;
                return (
                  <a
                    key={platform}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center text-ink-3 hover:bg-gold hover:text-white transition-all duration-300 group"
                    aria-label={platform}
                  >
                    {Icon ? <Icon size={16} /> : <span className="text-xs font-bold uppercase">{platform[0]}</span>}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="flex flex-col gap-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-ink-1">Explorer</h3>
            <nav className="flex flex-col gap-3">
              {[
                { href: "/fleet", label: t("nav_fleet") || "Flotte" },
                { href: "/locations", label: t("nav_locations") || "Agences" },
                { href: "/about", label: t("nav_about") || "À Propos" },
                { href: "/#faq", label: t("nav_faq") || "FAQ" },
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

          {/* Column 3: Hours & Legal */}
          <div className="flex flex-col gap-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-ink-1">Horaires</h3>
            <div className="flex flex-col gap-3 text-sm text-ink-3">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gold shrink-0" />
                <span className="font-medium">Lun - Sam: 9h00 - 19h00</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-ink-4 shrink-0" />
                <span className="font-medium text-ink-4">Dim: Fermé</span>
              </div>
            </div>

            <div className="h-px bg-border/40 my-1" />

            <nav className="flex flex-col gap-3">
              {[
                { href: "/privacy", label: "Confidentialité" },
                { href: "/terms", label: "Conditions générales" },
                { href: "/cookies", label: "Politique cookies" },
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

          {/* Column 4: Contact & Newsletter */}
          <div className="flex flex-col gap-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-ink-1">Contact</h3>
            <div className="flex flex-col gap-3">
              {footer.address && (
                <div className="flex items-start gap-3 text-sm text-ink-3">
                  <MapPin size={16} className="text-gold shrink-0 mt-0.5" />
                  <span className="font-medium">{footer.address}</span>
                </div>
              )}
              {footer.phone && (
                <div className="flex items-center gap-3 text-sm text-ink-3">
                  <Phone size={16} className="text-gold shrink-0" />
                  <a href={`tel:${footer.phone}`} className="font-medium hover:text-gold transition-colors">
                    {footer.phone}
                  </a>
                </div>
              )}
              {footer.email && (
                <div className="flex items-center gap-3 text-sm text-ink-3">
                  <Mail size={16} className="text-gold shrink-0" />
                  <a href={`mailto:${footer.email}`} className="font-medium hover:text-gold transition-colors">
                    {footer.email}
                  </a>
                </div>
              )}
            </div>

            {/* Newsletter */}
            <div className="flex flex-col gap-3 mt-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-ink-1">Newsletter</h3>
              <p className="text-xs text-ink-3 leading-relaxed">Offres exclusives et nouvelles arrivées.</p>
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

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-ink-3">
          <p className="font-medium">
            © {new Date().getFullYear()} {agency.agency_name || "Vectoria Rent Car"}.
            <span className="text-ink-4"> Tous droits réservés.</span>
          </p>
          <div className="flex items-center gap-4">
            <span className="text-ink-4">Paiement sécurisé</span>
            <div className="flex items-center gap-2 opacity-50">
              {["Visa", "MC", "CMI"].map((card) => (
                <div key={card} className="px-2 py-1 bg-surface-2 rounded text-[8px] font-bold text-ink-4 uppercase border border-border">
                  {card}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
