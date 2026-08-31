"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { Check, X, Car, Fuel, Users, Shield, Clock, MapPin } from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function PricingPage() {
  const { t, lang } = useTranslation();

  const categories = [
    {
      name: lang === 'en' ? t("pricing_cat_economy") : "Économique",
      categorySlug: "economique",
      price: 250,
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?auto=format&fit=crop&q=80&w=600",
      features: [t("pricing_feat_ac"), t("pricing_feat_bluetooth"), t("pricing_feat_seats_4"), t("pricing_feat_gps")],
      excluded: [t("pricing_excl_premium_insurance"), t("pricing_excl_baby_seat")],
      color: "from-emerald-500 to-emerald-600",
    },
    {
      name: lang === 'en' ? t("pricing_cat_standard") : "Standard",
      categorySlug: "standard",
      price: 400,
      image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=600",
      features: [t("pricing_feat_ac"), t("pricing_feat_bluetooth"), t("pricing_feat_seats_5"), t("pricing_feat_gps"), t("pricing_feat_rear_cam")],
      excluded: [t("pricing_excl_premium_insurance")],
      color: "from-blue-500 to-blue-600",
      popular: true,
    },
    {
      name: lang === 'en' ? t("pricing_cat_suv") : "SUV",
      categorySlug: "suv",
      price: 600,
      image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=600",
      features: [t("pricing_feat_ac"), t("pricing_feat_bluetooth"), t("pricing_feat_seats_7"), t("pricing_feat_gps"), t("pricing_feat_cam_360"), t("pricing_feat_panoramic")],
      excluded: [],
      color: "from-violet-500 to-violet-600",
    },
    {
      name: lang === 'en' ? t("pricing_cat_luxury") : "Luxe",
      categorySlug: "luxe",
      price: 1000,
      image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600",
      features: [t("pricing_feat_dual_ac"), t("pricing_feat_leather"), t("pricing_feat_seats_5"), t("pricing_feat_gps_premium"), t("pricing_feat_cam_360"), t("pricing_feat_panoramic"), t("pricing_feat_premium_sound")],
      excluded: [],
      color: "from-amber-500 to-amber-600",
    },
  ];

  const extras = [
    { name: t("pricing_extra_driver"), price: "500 MAD / " + t("quickview_day") },
    { name: t("pricing_extra_baby_seat"), price: "50 MAD / " + t("quickview_day") },
    { name: t("pricing_extra_gps"), price: "30 MAD / " + t("quickview_day") },
    { name: t("pricing_extra_insurance_full"), price: "100 MAD / " + t("quickview_day") },
    { name: t("pricing_extra_fuel"), price: "50 MAD" },
  ];

  return (
    <main className="min-h-screen">
      <section className="relative pt-32 pb-20 bg-[#16213E] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-3xl">
            <p className="text-gold text-xs font-black uppercase tracking-[0.3em] mb-4">{t("pricing_eyebrow")}</p>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
              {t("pricing_title")}
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              {t("pricing_subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className={`relative bg-white rounded-3xl border overflow-hidden hover:shadow-xl transition-all ${
                  cat.popular ? "border-primary ring-2 ring-primary/20 scale-[1.02]" : "border-slate-100"
                }`}
              >
                {cat.popular && (
                  <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    {t("pricing_popular")}
                  </div>
                )}
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black text-slate-900 mb-1">{cat.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-black text-[#16213E]">{cat.price}</span>
                    <span className="text-sm text-slate-400 font-medium">MAD {t("pricing_per_day")}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {cat.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-slate-600">
                        <Check size={14} className="text-emerald-500 shrink-0" /> {f}
                      </li>
                    ))}
                    {cat.excluded.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-slate-400">
                        <X size={14} className="text-slate-300 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/fleet?category=${cat.categorySlug}`}
                    className={`block text-center py-3 rounded-2xl font-bold text-sm transition-all ${
                      cat.popular
                        ? "bg-[#16213E] text-white hover:scale-105"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {t("btn_catalog")}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <p className="text-gold text-xs font-black uppercase tracking-[0.3em] mb-3">Extras</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{t("pricing_extras_title")}</h2>
          </motion.div>
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-100 overflow-hidden">
            {extras.map((extra, i) => (
              <div key={i} className={`flex items-center justify-between px-6 py-4 ${i < extras.length - 1 ? "border-b border-slate-50" : ""}`}>
                <span className="font-semibold text-slate-700">{extra.name}</span>
                <span className="text-sm font-bold text-gold">{extra.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#16213E]">
        <div className="container mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl font-black text-white tracking-tight mb-4">{t("pricing_cta_title")}</h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">{t("pricing_cta_desc")}</p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-gold text-[#16213E] px-8 py-4 rounded-full font-bold hover:scale-105 transition-all">
              {t("pricing_cta_button")}
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

