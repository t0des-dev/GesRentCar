"use client";

import Link from "next/link";
import { CarFront, Globe, Share2, Send, Mail, Phone, MapPin, ArrowRight, Camera, MessageCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAgency } from "@/hooks/useAgency";

export default function Footer() {
  const { t } = useTranslation();
  const agency = useAgency();

  const footer = agency.footer_config || {};
  const social = footer.social_links || {};

  return (
    <footer className="bg-card border-t border-border mt-auto relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 pt-20 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
          
          {/* Brand & About */}
          <div className="flex flex-col gap-5 lg:col-span-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="bg-gradient-to-br from-primary to-blue-600 text-white p-2.5 rounded-xl group-hover:scale-105 group-hover:shadow-lg transition-all duration-300">
                <CarFront size={22} />
              </div>
              <span className="text-2xl font-black tracking-tight text-foreground">
                {agency.agency_name?.split(' ')[0] || "Vectoria"}<span className="text-gradient-gold">{agency.agency_name?.split(' ')[1] || "Rent"}</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground pr-4">
              {agency.agency_slogan || "L'expérience ultime de confort et de performance. Nous mettons à votre disposition une flotte premium adaptée à chaque voyage."}
            </p>
            <div className="flex gap-3 mt-2">
              {social.facebook && (
                <a href={social.facebook} target="_blank" className="w-10 h-10 rounded-full bg-muted/50 border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all">
                  <Globe size={18} />
                </a>
              )}
              {social.instagram && (
                <a href={social.instagram} target="_blank" className="w-10 h-10 rounded-full bg-muted/50 border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all">
                  <Camera size={18} />
                </a>
              )}
              {social.whatsapp && (
                <a href={`https://wa.me/${social.whatsapp}`} target="_blank" className="w-10 h-10 rounded-full bg-muted/50 border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all">
                  <MessageCircle size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4 lg:col-span-2 lg:ml-auto">
            <h3 className="text-foreground font-bold text-lg mb-2">Liens Utiles</h3>
            <Link href="/fleet" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
              <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-secondary" />
              {t("nav_fleet")}
            </Link>
            <Link href="/locations" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
              <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-secondary" />
              {t("nav_locations")}
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
              <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-secondary" />
              Conditions
            </Link>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-5 lg:col-span-3">
            <h3 className="text-foreground font-bold text-lg mb-2">Nous Contacter</h3>
            {footer.address && (
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin size={18} className="text-secondary shrink-0 mt-0.5" />
                <span>{footer.address}</span>
              </div>
            )}
            {footer.phone && (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone size={18} className="text-secondary shrink-0" />
                <span>{footer.phone}</span>
              </div>
            )}
            {footer.email && (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail size={18} className="text-secondary shrink-0" />
                <span>{footer.email}</span>
              </div>
            )}
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-4 lg:col-span-3">
            <h3 className="text-foreground font-bold text-lg mb-2">Newsletter VIP</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Abonnez-vous pour recevoir des offres exclusives.
            </p>
            <form className="flex w-full group relative" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Votre adresse email" 
                className="bg-background border border-border rounded-xl px-4 py-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <button className="absolute right-1 top-1 bottom-1 bg-primary hover:bg-primary/90 text-white px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center glow-primary">
                <Send size={16} />
              </button>
            </form>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground/60">
          <p>© {new Date().getFullYear()} {agency.agency_name || "VectoriaRentCar"}. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/sitemap" className="hover:text-primary transition-colors">Plan du site</Link>
            <Link href="/cookies" className="hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
