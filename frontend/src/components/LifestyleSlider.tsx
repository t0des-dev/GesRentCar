"use client";

import { Star } from "lucide-react";
import type { Testimonial } from "@/types/storefront";

const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    user: "Youssef B.",
    role: "Casablanca, Morocco · BMW 5 Series",
    text: "Effortless booking and the car was waiting exactly on time at the airport. Genuinely felt like a premium experience from start to finish.",
    image: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=2400&auto=format&fit=crop",
  },
  {
    id: 2,
    user: "Sophie L.",
    role: "Marrakech · Tucson SUV",
    text: "We rented an SUV for a family trip to Marrakech. Spotless car, transparent price, and the support team answered instantly on WhatsApp.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2400&auto=format&fit=crop",
  },
  {
    id: 3,
    user: "Nadia K.",
    role: "Rabat · Corporate Account",
    text: "Our company now books all business travel vehicles through AR7 Victoria Car. Reliable fleet, clean invoicing, zero surprises.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2400&auto=format&fit=crop",
  },
];

function GoogleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

import { useTranslation } from "@/shared/hooks/useTranslation";

export default function LifestyleSlider({ content = {} }: {
  content?: {
    badge?: string;
    heading?: string;
    description?: string;
    items?: Testimonial[] | { id: number; user: string; role: string; text: string; image: string }[]
  }
}) {
  const { t, lang } = useTranslation();

  const defaultTestimonials = [
    {
      id: 1,
      user: "Youssef B.",
      role: lang === "fr" ? "Casablanca, Maroc · BMW Série 5" : "Casablanca, Morocco · BMW 5 Series",
      text: lang === "fr"
        ? "Réservation fluide et véhicule impeccable qui m'attendait à l'aéroport à l'heure exacte. Une vraie expérience haut de gamme du début à la fin."
        : "Effortless booking and the car was waiting exactly on time at the airport. Genuinely felt like a premium experience from start to finish.",
      image: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=2400&auto=format&fit=crop",
    },
    {
      id: 2,
      user: "Sophie L.",
      role: lang === "fr" ? "Marrakech · SUV Tucson" : "Marrakech · Tucson SUV",
      text: lang === "fr"
        ? "Nous avons loué un SUV pour un voyage en famille à Marrakech. Voiture très propre, prix transparent et support WhatsApp ultra réactif."
        : "We rented an SUV for a family trip to Marrakech. Spotless car, transparent price, and the support team answered instantly on WhatsApp.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2400&auto=format&fit=crop",
    },
    {
      id: 3,
      user: "Nadia K.",
      role: lang === "fr" ? "Rabat · Compte Entreprise" : "Rabat · Corporate Account",
      text: lang === "fr"
        ? "Notre entreprise réserve désormais tous ses véhicules professionnels chez Vectoria. Flotte fiable, facturation claire et zéro mauvaise surprise."
        : "Our company now books all business travel vehicles through Vectoria. Reliable fleet, clean invoicing, zero surprises.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2400&auto=format&fit=crop",
    },
  ];

  const testimonials = (content?.items && content.items.length > 0 && content.items.some(i => (i as any).text && (i as any).text !== DEFAULT_TESTIMONIALS[0].text))
    ? content.items.map((item: any, i: number) => ({
        id: i,
        user: item.name || item.user || "Client",
        role: item.role || "",
        text: item.content || item.text || "",
        image: item.image || "",
      }))
    : defaultTestimonials;

  if (testimonials.length === 0) return null;

  const heading = content?.heading && content.heading !== "Ce que disent nos clients" && content.heading !== "Trusted by thousands of travelers."
    ? content.heading
    : t("testimonials_heading");

  return (
    <section className="py-28 bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 space-y-5">
          <div className="w-px h-8 bg-slate-900 mx-auto" />
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-sora), sans-serif" }}>
            {heading}
          </h2>
          <div className="flex items-center justify-center gap-2 pt-1">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm font-bold text-slate-900">4.9/5</span>
            <span className="text-sm text-slate-400">{t("testimonials_sub")}</span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t: any) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-7 flex flex-col justify-between hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300"
            >
              {/* Stars + Badge */}
              <div className="flex items-center justify-between mb-5">
                <Stars />
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                  <GoogleIcon />
                  <span>Google Review</span>
                </div>
              </div>

              {/* Text */}
              <p className="text-[14px] leading-relaxed text-slate-600 mb-8 flex-1">
                {t.text}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 shrink-0">
                  {t.image ? (
                    <img src={t.image} alt={t.user} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm font-bold text-slate-400">
                      {t.user?.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{t.user}</p>
                  <p className="text-[11px] text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
