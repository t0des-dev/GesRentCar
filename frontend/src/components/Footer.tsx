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
    <footer className="bg-[var(--charcoal)] text-white/75 pt-22 pb-8 relative overflow-hidden">
      <div className="max-w-[var(--container)] mx-auto px-8 relative z-10">

        {/* Main Grid — 5 Column Layout (theme style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">

          {/* Column 1: Brand & Tagline */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <span className="font-[var(--font-sora)] font-extrabold text-[21px] text-white tracking-tight">
                Vectoria <span className="text-[var(--gold)]">Rent</span>
              </span>
            </Link>

            <p className="text-[14px] text-white/55 max-w-[280px] leading-relaxed">
              {agency.agency_slogan || "Premium car rental across Morocco — modern fleet, transparent pricing, and service you can trust."}
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 mt-5">
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
                    className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/80 hover:border-[var(--gold)] hover:bg-[var(--gold)]/10 transition-all duration-300"
                    aria-label={platform}
                  >
                    {Icon ? <Icon size={15} /> : <span className="text-xs font-bold uppercase">{platform[0]}</span>}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Fleet */}
          <div className="flex flex-col gap-5">
            <h5 className="font-[var(--font-sora)] text-[13.5px] text-white uppercase tracking-[0.08em]">Fleet</h5>
            <nav className="flex flex-col gap-3.5">
              {[
                { href: "/fleet?category=Economique", label: "Economy" },
                { href: "/fleet?category=Compacte", label: "Compact" },
                { href: "/fleet?category=SUV", label: "SUV" },
                { href: "/fleet?category=Luxe", label: "Luxury" },
                { href: "/fleet?category=Utilitaire", label: "Utility" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-[14px] text-white/60 hover:text-[var(--gold)] transition-colors duration-300"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Company */}
          <div className="flex flex-col gap-5">
            <h5 className="font-[var(--font-sora)] text-[13.5px] text-white uppercase tracking-[0.08em]">Company</h5>
            <nav className="flex flex-col gap-3.5">
              {[
                { href: "/about", label: t("nav_about") || "About" },
                { href: "/faq", label: "FAQ" },
                { href: "/contact", label: t("nav_contact") || "Contact" },
                { href: "/locations", label: t("nav_locations") || "Locations" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-[14px] text-white/60 hover:text-[var(--gold)] transition-colors duration-300"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 4: Legal */}
          <div className="flex flex-col gap-5">
            <h5 className="font-[var(--font-sora)] text-[13.5px] text-white uppercase tracking-[0.08em]">Legal</h5>
            <nav className="flex flex-col gap-3.5">
              {[
                { href: "/terms", label: "Terms of Service" },
                { href: "/privacy", label: "Privacy Policy" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-[14px] text-white/60 hover:text-[var(--gold)] transition-colors duration-300"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 5: Contact */}
          <div className="flex flex-col gap-5">
            <h5 className="font-[var(--font-sora)] text-[13.5px] text-white uppercase tracking-[0.08em]">Contact</h5>
            <div className="flex flex-col gap-3.5">
              {footer.phone && (
                <div className="flex items-center gap-2.5 text-[14px] text-white/60">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4 text-[var(--gold)] flex-shrink-0">
                    <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.7A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.7a2 2 0 01-.5 2.1L8 9.7a16 16 0 006 6l1.2-1.2a2 2 0 012.1-.5c.9.3 1.8.5 2.7.6a2 2 0 011.7 2z" />
                  </svg>
                  <a href={`tel:${footer.phone}`} className="hover:text-[var(--gold)] transition-colors">
                    {footer.phone}
                  </a>
                </div>
              )}
              {footer.email && (
                <div className="flex items-center gap-2.5 text-[14px] text-white/60">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4 text-[var(--gold)] flex-shrink-0">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 6l-10 7L2 6" />
                  </svg>
                  <a href={`mailto:${footer.email}`} className="hover:text-[var(--gold)] transition-colors">
                    {footer.email}
                  </a>
                </div>
              )}
              {footer.address && (
                <div className="flex items-start gap-2.5 text-[14px] text-white/60">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4 text-[var(--gold)] flex-shrink-0 mt-0.5">
                    <path d="M12 21s7-6.4 7-11.5A7 7 0 105 9.5C5 14.6 12 21 12 21z" />
                    <circle cx="12" cy="9.5" r="2.5" />
                  </svg>
                  <span>{footer.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10 text-[13px] text-white/40">
          <span>© {new Date().getFullYear()} {agency.agency_name || "Vectoria Rent Car"}. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-[var(--gold)] transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-[var(--gold)] transition-colors">Privacy</Link>
            <Link href="/sitemap.xml" className="hover:text-[var(--gold)] transition-colors">Sitemap</Link>
          </div>
          <div className="flex items-center gap-2.5">
            {["Visa", "Mastercard", "CMI", "Cash"].map((card) => (
              <span key={card} className="flex items-center gap-1.5 px-3 py-1.5 border border-white/15 rounded-md text-[11.5px] font-semibold text-white/50">
                {card}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
