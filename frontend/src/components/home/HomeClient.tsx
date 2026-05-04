"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";

// Hooks
import { useVehicles } from "@/hooks/useApi";
import { useTranslation } from "@/hooks/useTranslation";
import { useAgency } from "@/hooks/useAgency";

// Critical Components (Direct Import)
import HeroSection from "@/components/home/HeroSection";
import PromotionBanner from "@/components/PromotionBanner";

// Below the Fold / Heavy Components (Dynamic Import)
const VibeSelector = dynamic(() => import("@/components/VibeSelector"), { ssr: false });
const LifestyleGallery = dynamic(() => import("@/components/LifestyleGallery"), { ssr: false });
const StatsSection = dynamic(() => import("@/components/home/StatsSection"), { ssr: false });
const WhyUsSection = dynamic(() => import("@/components/home/WhyUsSection"), { ssr: false });
const FeaturedVehicles = dynamic(() => import("@/components/home/FeaturedVehicles"), { ssr: false });
const LifestyleSlider = dynamic(() => import("@/components/LifestyleSlider"), { ssr: false });
const ExperienceMap = dynamic(() => import("@/components/ExperienceMap"), { ssr: false });
const ConciergeBanner = dynamic(() => import("@/components/ConciergeBanner"), { ssr: false });
const FAQSection = dynamic(() => import("@/components/FAQSection"), { ssr: false });
const HowItWorks = dynamic(() => import("@/components/home/HowItWorks"), { ssr: false });
const CtaBanner = dynamic(() => import("@/components/home/CtaBanner"), { ssr: false });
const VehicleComparator = dynamic(() => import("@/components/VehicleComparator"), { ssr: false });

export default function HomeClient() {
  const router = useRouter();
  const { t, lang } = useTranslation();
  const agency = useAgency();
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const { data: apiData, isLoading } = useVehicles({ per_page: 3 });
  const featuredVehicles = apiData?.data ?? [];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location)  params.append("location", location);
    if (startDate) params.append("start_date", startDate);
    if (endDate)   params.append("end_date", endDate);
    router.push(`/fleet?${params.toString()}`);
  };

  const sections = agency.sections_config || { 
    featured: true, stats: true, why_us: true, testimonials: true, map: true,
    vibe_selector: true, lifestyle_gallery: true, faq: true, concierge_banner: true
  };
  
  const aboutText = lang === 'ar' ? agency.about_text_ar : (lang === 'en' ? agency.about_text_en : agency.about_text_fr);

  const statsConfig = agency.stats_config || {};
  const STATS = useMemo(() => [
    { value: statsConfig.value_1 || "2,400+", label: statsConfig.label_1 || t("stat_clients") || "Clients satisfaits" },
    { value: statsConfig.value_2 || "80+",    label: statsConfig.label_2 || t("stat_fleet") || "Véhicules premium" },
    { value: statsConfig.value_3 || "15",     label: statsConfig.label_3 || t("stat_exp") || "Années d'expérience" },
    { value: statsConfig.value_4 || "24/7",   label: statsConfig.label_4 || t("stat_support") || "Support disponible" },
  ], [statsConfig, t]);

  const content = (agency.sections_content as any) || {
    hero: {}, why_us: {}, vibe: {}, lifestyle: {}, faq: {}
  };

  const renderSection = (id: string) => {
    switch (id) {
      case "hero":
        return (
          <HeroSection 
            key="hero" agency={agency} content={content.hero}
            location={location} setLocation={setLocation}
            startDate={startDate} setStartDate={setStartDate}
            endDate={endDate} setEndDate={setEndDate}
            onSearch={handleSearch} aboutText={aboutText} stats={STATS}
          />
        );
      case "stats":
        return sections.stats && <StatsSection key="stats" stats={STATS} />;
      case "vibe_selector":
        return sections.vibe_selector && <VibeSelector key="vibe" config={content.vibe} />;
      case "lifestyle_gallery":
        return sections.lifestyle_gallery && <LifestyleGallery key="lifestyle" config={content.lifestyle} />;
      case "why_us":
        return sections.why_us && <WhyUsSection key="why_us" agency={agency} content={content.why_us} />;
      case "featured":
        return sections.featured && <FeaturedVehicles key="featured" vehicles={featuredVehicles} loading={isLoading} />;
      case "testimonials":
        return sections.testimonials && <LifestyleSlider key="testimonials" />;
      case "map":
        return sections.map && <ExperienceMap key="map" />;
      case "concierge_banner":
        return sections.concierge_banner && <ConciergeBanner key="concierge" />;
      case "faq":
        return sections.faq && <FAQSection key="faq" />;
      case "how_it_works":
        return <HowItWorks key="how_it_works" />;
      case "cta_banner":
        return <CtaBanner key="cta_banner" />;
      default:
        return null;
    }
  };

  const currentOrder = agency.sections_order || [
    { id: "hero", active: true },
    { id: "vibe_selector", active: true },
    { id: "lifestyle_gallery", active: true },
    { id: "stats", active: true },
    { id: "why_us", active: true },
    { id: "featured", active: true },
    { id: "testimonials", active: true },
    { id: "map", active: true },
    { id: "concierge_banner", active: true },
    { id: "faq", active: true },
    { id: "how_it_works", active: true },
    { id: "cta_banner", active: true }
  ];

  return (
    <main className="min-h-screen overflow-x-hidden">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-primary z-[100] origin-left" style={{ scaleX }} />
      <AnimatePresence mode="wait">
        {currentOrder.filter(s => s.active !== false).map(s => renderSection(s.id))}
      </AnimatePresence>
      <PromotionBanner />
      <VehicleComparator />
    </main>
  );
}
