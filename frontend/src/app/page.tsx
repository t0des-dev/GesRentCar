"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight, Calendar, MapPin, Car, Loader2, Sparkles,
  ShieldCheck, HeadphonesIcon, Crown, Star, CheckCircle2,
} from "lucide-react";
import { useVehicles } from "@/hooks/useApi";
import { useTranslation } from "@/hooks/useTranslation";
import { useAgency } from "@/hooks/useAgency";
import VehicleCard from "@/components/VehicleCard";
import ExperienceMap from "@/components/ExperienceMap";
import VehicleComparator from "@/components/VehicleComparator";
import LifestyleSlider from "@/components/LifestyleSlider";

export default function Home() {
  const router = useRouter();
  const { t, lang } = useTranslation();
  const agency = useAgency();
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: apiData, isLoading } = useVehicles({ per_page: 3 });
  const featuredVehicles = apiData?.data ?? [];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location)  params.append("location", location);
    if (startDate) params.append("start_date", startDate);
    if (endDate)   params.append("end_date", endDate);
    router.push(`/fleet?${params.toString()}`);
  };

  const sections = agency.sections_config || { featured: true, stats: true, why_us: true, testimonials: true, map: true };
  const heroImage = agency.hero_image_url || "https://images.unsplash.com/photo-1503377215949-b98377627166?q=80&w=2400&auto=format&fit=crop";
  
  const aboutText = lang === 'ar' ? agency.about_text_ar : (lang === 'en' ? agency.about_text_en : agency.about_text_fr);

  const statsConfig = agency.stats_config || {};
  const STATS = [
    { value: statsConfig.value_1 || "2,400+", label: statsConfig.label_1 || t("stat_clients") || "Clients satisfaits" },
    { value: statsConfig.value_2 || "80+",    label: statsConfig.label_2 || t("stat_fleet") || "Véhicules premium" },
    { value: statsConfig.value_3 || "15",     label: statsConfig.label_3 || t("stat_exp") || "Années d'expérience" },
    { value: statsConfig.value_4 || "24/7",   label: statsConfig.label_4 || t("stat_support") || "Support disponible" },
  ];

  return (
    <main className="flex min-h-screen flex-col bg-background">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Luxury Car"
            className="w-full h-full object-cover object-center animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-background" />
        </div>

        <div className="container relative z-10 mx-auto px-4 pt-20">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2.5 rounded-full text-white text-[10px] font-black uppercase tracking-[0.4em] mb-8 animate-fade-in-up">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#2563eb]" />
                {agency.agency_name || "Vectoria"} Premium 2026
              </div>

              <h1 className="text-6xl md:text-[110px] font-black text-white tracking-tighter mb-8 animate-fade-in-up [animation-delay:100ms] leading-[0.9]">
                {t("hero_title")}<br />
                <span className="text-gradient-gold drop-shadow-[0_0_40px_rgba(251,191,36,0.3)]">
                  {agency.agency_name || "Vectoria"}
                </span>
              </h1>

              <p className="text-lg md:text-2xl text-slate-300 max-w-xl mb-12 font-medium animate-fade-in-up [animation-delay:200ms] leading-relaxed opacity-80">
                {aboutText || t("hero_subtitle")}
              </p>
              
              {sections.stats && (
                <div className="hidden lg:flex items-center gap-12 animate-fade-in-up [animation-delay:300ms]">
                  {STATS.slice(0, 3).map((stat, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <span className="text-3xl font-black text-white tracking-tighter">{stat.value}</span>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-black">{stat.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="w-full lg:w-[480px] animate-fade-in-up [animation-delay:400ms]">
              <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[var(--radius,48px)] p-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <h2 className="text-white font-black text-2xl mb-10 flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                    <Sparkles size={24} className="text-primary" />
                  </div>
                  Réserver un véhicule
                </h2>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">Lieu de prise en charge</label>
                    <div className="flex items-center bg-black/40 border border-white/5 rounded-3xl px-6 py-5 text-white focus-within:border-primary/50 transition-all group/field">
                      <MapPin size={20} className="text-primary mr-4 group-focus-within/field:scale-110 transition-transform" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Aéroport, Hôtel, Ville..."
                        className="bg-transparent border-none focus:outline-none text-sm w-full font-bold placeholder:text-slate-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">Départ</label>
                      <div className="flex items-center bg-black/40 border border-white/5 rounded-3xl px-6 py-5 text-white focus-within:border-primary/50 transition-all">
                        <Calendar size={18} className="text-primary mr-3" />
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="bg-transparent border-none focus:outline-none text-xs font-bold w-full [color-scheme:dark]"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">Retour</label>
                      <div className="flex items-center bg-black/40 border border-white/5 rounded-3xl px-6 py-5 text-white focus-within:border-primary/50 transition-all">
                        <Calendar size={18} className="text-primary mr-3" />
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="bg-transparent border-none focus:outline-none text-xs font-bold w-full [color-scheme:dark]"
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleSearch}
                    className="w-full bg-primary hover:bg-blue-600 text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-2xl shadow-primary/40 active:scale-95 flex items-center justify-center gap-3 group/btn"
                  >
                    Explorer la flotte
                    <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform duration-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────────────── */}
      {sections.stats && (
        <section className="bg-primary py-10 transition-colors duration-500">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {STATS.map((s) => (
                <div key={s.label} className="text-center text-primary-foreground">
                  <p className="text-4xl md:text-5xl font-black mb-1">{s.value}</p>
                  <p className="text-sm text-white/70 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURES ────────────────────────────────────────────────────────── */}
      {sections.why_us && (
        <section className="py-32 bg-background relative overflow-hidden">
          <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-32 w-96 h-96 bg-secondary/8 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-24">
              <p className="text-primary font-black text-xs uppercase tracking-[0.2em] mb-4">Nos Engagements</p>
              <h2 className="text-4xl md:text-5xl font-black mb-4">{t("features_title")}</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">{t("features_subtitle")}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Crown, title: t("feat_fleet_title"), desc: t("feat_fleet_desc"), delay: "0ms" },
                { icon: HeadphonesIcon, title: t("feat_support_title"), desc: t("feat_support_desc"), delay: "100ms" },
                { icon: ShieldCheck, title: t("feat_chauffeur_title"), desc: t("feat_chauffeur_desc"), delay: "200ms" },
              ].map(({ icon: Icon, title, desc, delay }) => (
                <div
                  key={title}
                  style={{ animationDelay: delay, borderRadius: 'var(--radius, 24px)' }}
                  className="card-premium p-10 group animate-fade-in-up"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-8
                                  group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:glow-primary
                                  transition-all duration-300">
                    <Icon size={30} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED FLEET ───────────────────────────────────────────────── */}
      {sections.featured && (
        <section className="py-32 bg-secondary/5 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="text-center mb-24">
              <p className="text-primary font-black text-xs uppercase tracking-[0.2em] mb-4">Notre Collection</p>
              <h2 className="text-4xl md:text-5xl font-black mb-4">{t("featured_vehicles")}</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Des berlines élégantes aux SUV spacieux — tous parfaitement entretenus pour une expérience sans compromis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {isLoading ? (
                <div className="col-span-3 flex justify-center py-16">
                  <Loader2 size={48} className="animate-spin text-primary opacity-60" />
                </div>
              ) : featuredVehicles.length > 0 ? (
                featuredVehicles.map((v) => (
                  <VehicleCard
                    key={v.id}
                    id={v.id}
                    brand={v.brand}
                    model={v.model}
                    type={v.category || v.type}
                    price={v.price_per_day}
                    seats={(v as any).seats ?? 5}
                    fuel={v.fuel_type || (v as any).fuel || "Diesel"}
                    transmission={v.transmission || "Automatique"}
                    imageUrl={v.image_url ?? undefined}
                    dynamicPrice={v.dynamic_price}
                    dynamicReason={v.dynamic_reason}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-16 text-muted-foreground">
                  <Car size={56} className="mx-auto mb-4 opacity-20" />
                  <p className="font-medium">Aucun véhicule vedette disponible pour le moment.</p>
                </div>
              )}
            </div>

            <div className="text-center mt-16">
              <Link
                href="/fleet"
                className="inline-flex items-center gap-3 px-10 py-4 rounded-full border-2 border-primary
                           text-primary font-bold hover:bg-primary hover:text-primary-foreground
                           hover:shadow-lg hover:shadow-primary/30 transition-all group"
              >
                {t("btn_catalog")}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── LIFESTYLE SLIDER ─────────────────────────────────────────────── */}
      {sections.testimonials && <LifestyleSlider />}

      {/* ── EXPERIENCE MAP ─────────────────────────────────────────────────── */}
      {sections.map && <ExperienceMap />}

      {/* ── VEHICLE COMPARATOR ─────────────────────────────────────────────── */}
      <VehicleComparator />

      {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-24">
            <p className="text-primary font-black text-xs uppercase tracking-[0.2em] mb-4">Simple & Rapide</p>
            <h2 className="text-4xl md:text-5xl font-black mb-4">{t("how_it_works")}</h2>
            <div className="w-16 h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="hidden md:block absolute top-12 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-0.5 bg-gradient-to-r from-primary via-secondary to-primary opacity-30 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              {[
                { num: "01", title: t("step_1_title"), desc: t("step_1_desc") },
                { num: "02", title: t("step_2_title"), desc: t("step_2_desc") },
                { num: "03", title: t("step_3_title"), desc: t("step_3_desc") },
              ].map(({ num, title, desc }) => (
                <div key={num} className="flex flex-col items-center text-center group">
                  <div className="w-24 h-24 rounded-full border-2 border-primary/30 bg-background flex items-center justify-center
                                  text-3xl font-black text-primary mb-8 shadow-lg
                                  group-hover:border-primary group-hover:glow-primary group-hover:scale-110
                                  transition-all duration-300">
                    {num}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{title}</h3>
                  <p className="text-muted-foreground leading-relaxed max-w-xs">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────────────────────────── */}
      <section className="py-32 bg-primary relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Prêt pour la route ?
          </h2>
          <p className="text-white/70 max-w-lg mx-auto mb-10 text-lg">
            Réservez votre véhicule de rêve en quelques minutes et commencez votre aventure.
          </p>
          <Link
            href="/fleet"
            className="inline-flex items-center gap-3 bg-white text-primary px-10 py-4 rounded-full font-bold
                       hover:bg-secondary hover:text-secondary-foreground hover:shadow-2xl
                       transition-all duration-300 group"
          >
            Voir la flotte
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

    </main>
  );
}
