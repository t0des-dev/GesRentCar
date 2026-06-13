"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState, useMemo, Suspense, type ReactNode } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

import { useVehicles } from "@/hooks/useApi";
import { useTranslation } from "@/hooks/useTranslation";
import { useAgency } from "@/hooks/useAgency";

import HeroSection from "@/components/home/HeroSection";
import StickyBookingBar from "@/components/home/StickyBookingBar";
import PromotionBanner from "@/components/PromotionBanner";

const VibeSelector = dynamic(() => import("@/components/VibeSelector"), { ssr: false });
const LifestyleGallery = dynamic(() => import("@/components/LifestyleGallery"), { ssr: false });
const StatsSection = dynamic(() => import("@/components/home/StatsSection"));
const WhyUsSection = dynamic(() => import("@/components/home/WhyUsSection"));
const FeaturedVehicles = dynamic(() => import("@/components/home/FeaturedVehicles"));
const LifestyleSlider = dynamic(() => import("@/components/LifestyleSlider"), { ssr: false });
const ExperienceMap = dynamic(() => import("@/components/ExperienceMap"), { ssr: false });
const ConciergeBanner = dynamic(() => import("@/components/ConciergeBanner"), { ssr: false });
const FAQSection = dynamic(() => import("@/components/FAQSection"), { ssr: false });
const HowItWorks = dynamic(() => import("@/components/home/HowItWorks"));
const CtaBanner = dynamic(() => import("@/components/home/CtaBanner"));
const VehicleComparator = dynamic(() => import("@/components/VehicleComparator"), { ssr: false });
const ExperienceSection = dynamic(() => import("@/components/home/ExperienceSection"));

function SectionSkeleton({ className = "h-96" }: { className?: string }) {
  return <div className={`bg-slate-100 animate-pulse rounded-2xl ${className}`} role="presentation" aria-hidden="true" />;
}

export default function HomeClient() {
  const router = useRouter();
  const { t, lang } = useTranslation();
  const agency = useAgency();
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

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
    vibe_selector: true, lifestyle_gallery: true, faq: true, concierge_banner: true,
    experience: true
  };

  const aboutText = lang === 'ar' ? agency.about_text_ar : (lang === 'en' ? agency.about_text_en : agency.about_text_fr);

  const statsConfig = agency.stats_config || {};
  const STATS = useMemo(() => [
    { value: statsConfig.value_1 || "2,400+", label: statsConfig.label_1 || t("stat_clients") },
    { value: statsConfig.value_2 || "80+",    label: statsConfig.label_2 || t("stat_fleet") },
    { value: statsConfig.value_3 || "15",     label: statsConfig.label_3 || t("stat_exp") },
    { value: statsConfig.value_4 || "24/7",   label: statsConfig.label_4 || t("stat_support") },
  ], [statsConfig, t]);

  const content = (agency.sections_content as any) || {
    hero: {}, why_us: {}, vibe: {}, lifestyle: {}, faq: {}
  };

  const SECTION_MAP: Record<string, () => ReactNode> = {
    hero: () => (
      <HeroSection
        agency={agency} content={content.hero}
        location={location} setLocation={setLocation}
        startDate={startDate} setStartDate={setStartDate}
        endDate={endDate} setEndDate={setEndDate}
        onSearch={handleSearch} aboutText={aboutText} stats={STATS}
      />
    ),
    experience: () => <ExperienceSection />,
    stats: () => sections.stats ? <StatsSection stats={STATS} /> : null,
    vibe_selector: () => sections.vibe_selector ? <VibeSelector config={content.vibe} /> : null,
    lifestyle_gallery: () => sections.lifestyle_gallery ? <LifestyleGallery content={content.lifestyle} /> : null,
    why_us: () => sections.why_us ? <WhyUsSection agency={agency} content={content.why_us} aboutText={aboutText} /> : null,
    featured: () => sections.featured ? <FeaturedVehicles vehicles={featuredVehicles} loading={isLoading} /> : null,
    testimonials: () => sections.testimonials ? <LifestyleSlider /> : null,
    map: () => sections.map ? <ExperienceMap content={content.map} /> : null,
    concierge_banner: () => sections.concierge_banner ? <ConciergeBanner /> : null,
    faq: () => sections.faq ? <FAQSection /> : null,
    how_it_works: () => <HowItWorks config={content.how_it_works} />,
    cta_banner: () => <CtaBanner />,
  };

  const currentOrder: { id: string; active: boolean }[] = agency.sections_order || [
    { id: "hero", active: true },
    { id: "experience", active: true },
    { id: "vibe_selector", active: true },
    { id: "lifestyle_gallery", active: true },
    { id: "stats", active: true },
    { id: "why_us", active: false },
    { id: "featured", active: true },
    { id: "testimonials", active: true },
    { id: "map", active: true },
    { id: "concierge_banner", active: true },
    { id: "faq", active: true },
    { id: "how_it_works", active: true },
    { id: "cta_banner", active: true },
  ];

  return (
    <main className="min-h-screen overflow-x-hidden">
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-primary z-[100] origin-left"
        style={{ scaleX }}
        role="progressbar"
        aria-valuenow={Math.round(scrollYProgress.get() * 100)}
        aria-label="Progression"
      />
      <Suspense fallback={<SectionSkeleton className="h-screen" />}>
        {currentOrder.filter((s) => s.active !== false).map((s) => (
          <Suspense key={s.id} fallback={<SectionSkeleton />}>
            {SECTION_MAP[s.id]?.()}
          </Suspense>
        ))}
      </Suspense>
      <StickyBookingBar
        location={location} setLocation={setLocation}
        startDate={startDate} setStartDate={setStartDate}
        endDate={endDate} setEndDate={setEndDate}
        onSearch={handleSearch}
      />
      <PromotionBanner />
      <VehicleComparator />
    </main>
  );
}
