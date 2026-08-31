"use client";

import { Tag, Calendar, Gift, Zap } from "lucide-react";
import { useAgency } from "@/hooks/useAgency";
import { useTranslation } from "@/shared/hooks/useTranslation";

export default function OffersPage() {
  const { t, lang } = useTranslation();
  const agency = useAgency();
  const cmsSpecialOffers = agency.special_offers || [];

  const defaultOffers = [
    {
      title: lang === 'en' ? "Early Bird Special" : "Offre Réservation Anticipée",
      discount: "15% OFF",
      desc: lang === 'en' ? "Book 30 days in advance and save on your rental." : "Réservez 30 jours à l'avance et économisez sur votre location.",
      code: "EARLY2026",
      icon: Calendar,
      color: "bg-blue-500",
    },
    {
      title: lang === 'en' ? "Weekend Escape" : "Escapade Weekend",
      discount: "20% OFF",
      desc: lang === 'en' ? "Great rates for all your getaways from Friday to Monday." : "Tarifs avantageux pour toutes vos escapades du vendredi au lundi.",
      code: "WEEKEND",
      icon: Zap,
      color: "bg-amber-500",
    },
    {
      title: lang === 'en' ? "VIP Long Stay" : "Longue Durée VIP",
      discount: "30% OFF",
      desc: lang === 'en' ? "Exceptional discount for any booking over 14 days." : "Remise exceptionnelle pour toute réservation supérieure à 14 jours.",
      code: "LONGSTAY",
      icon: Gift,
      color: "bg-purple-500",
    }
  ];

  const offersToRender = cmsSpecialOffers.length > 0
    ? cmsSpecialOffers.map((off, idx) => ({
        title: `${t("offers_promo")} ${off.category.toUpperCase()}`,
        discount: `-${off.discount}%`,
        desc: `${t("offers_promo")} ${t("offers_until")} ${off.end_date || '...'} ${t("offers_category")} ${off.category}.`,
        code: `PROMO-${off.category.toUpperCase()}`,
        icon: idx % 3 === 0 ? Calendar : idx % 3 === 1 ? Zap : Gift,
        color: idx % 3 === 0 ? "bg-blue-500" : idx % 3 === 1 ? "bg-amber-500" : "bg-purple-500",
      }))
    : defaultOffers;

  return (
    <main className="min-h-screen py-28 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-primary text-[10px] font-semibold uppercase tracking-[0.2em] mb-3">{t("offers_eyebrow")}</p>
          <h1 className="text-4xl md:text-6xl font-semibold text-slate-900 tracking-tighter mb-6">{t("offers_title")}</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            {t("offers_desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {offersToRender.map((offer) => {
            const Icon = offer.icon;
            return (
              <div key={offer.title} className="group relative bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <div className={`${offer.color} h-32 flex items-center justify-center text-white`}>
                  <Icon size={48} strokeWidth={1.5} />
                </div>
                <div className="p-8 text-center">
                  <div className="inline-block bg-primary/10 text-primary text-[10px] font-semibold px-3 py-1 rounded-full mb-4 uppercase">
                    {t("pricing_popular")}
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">{offer.title}</h2>
                  <div className="text-4xl font-semibold text-primary mb-4">{offer.discount}</div>
                  <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                    {offer.desc}
                  </p>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-dashed border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-slate-400">{t("offers_code_label")}</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-slate-50 rounded-xl font-mono font-semibold text-lg border border-slate-200">
                    {offer.code}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}


