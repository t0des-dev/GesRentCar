"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState, useMemo, Suspense, type ReactNode } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

import { useVehicles } from "@/hooks/useApi";
import { useTranslation } from "@/hooks/useTranslation";
import { useStorefront } from "@/hooks/useStorefront";

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

import JsonLd from "@/components/SEO/JsonLd";
import { useEffect } from "react";

function SectionSkeleton({ className = "h-96" }: { className?: string }) {
  return <div className={`bg-slate-100 animate-pulse rounded-2xl ${className}`} role="presentation" aria-hidden="true" />;
}

export default function HomeClient() {
  const router = useRouter();
  const { t, lang } = useTranslation();
  const storefront = useStorefront();
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const savedLocation = localStorage.getItem('vrc_search_location');
    const savedStart = localStorage.getItem('vrc_search_start');
    const savedEnd = localStorage.getItem('vrc_search_end');
    if (savedLocation) setLocation(savedLocation);
    if (savedStart) setStartDate(savedStart);
    if (savedEnd) setEndDate(savedEnd);
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  const { data: apiData, isLoading } = useVehicles({ per_page: 3 });
  const featuredVehicles = apiData?.data ?? [];

  const handleSearch = () => {
    localStorage.setItem('vrc_search_location', location);
    localStorage.setItem('vrc_search_start', startDate);
    localStorage.setItem('vrc_search_end', endDate);
    
    const params = new URLSearchParams();
    if (location)  params.append("location", location);
    if (startDate) params.append("start_date", startDate);
    if (endDate)   params.append("end_date", endDate);
    router.push(`/fleet?${params.toString()}`);
  };

  const sections = storefront.sections_config;
  const aboutText = lang === 'ar' ? storefront.about_text_ar : (lang === 'en' ? storefront.about_text_en : storefront.about_text_fr);

  const STATS = useMemo(() => [
    { value: storefront.stats_config.value_1, label: storefront.stats_config.label_1 },
    { value: storefront.stats_config.value_2, label: storefront.stats_config.label_2 },
    { value: storefront.stats_config.value_3, label: storefront.stats_config.label_3 },
    { value: storefront.stats_config.value_4, label: storefront.stats_config.label_4 },
  ], [storefront.stats_config]);

  const SECTION_MAP: Record<string, () => ReactNode> = {
    hero: () => (
      <HeroSection
        agency={storefront} content={storefront.sections_content.hero}
        location={location} setLocation={setLocation}
        startDate={startDate} setStartDate={setStartDate}
        endDate={endDate} setEndDate={setEndDate}
        onSearch={handleSearch} aboutText={aboutText} stats={STATS}
      />
    ),
    experience: () => <ExperienceSection content={storefront.sections_content.experience} />,
    stats: () => <StatsSection stats={STATS} />,
    vibe_selector: () => <VibeSelector content={storefront.sections_content.vibe} />,
    lifestyle_gallery: () => <LifestyleGallery content={storefront.sections_content.lifestyle} />,
    why_us: () => <WhyUsSection content={storefront.sections_content.why_us} />,
    featured: () => <FeaturedVehicles vehicles={featuredVehicles} loading={isLoading} content={storefront.sections_content.featured_vehicles} />,
    testimonials: () => <LifestyleSlider content={storefront.sections_content.testimonials} />,
    map: () => <ExperienceMap content={storefront.sections_content.map} />,
    concierge_banner: () => <ConciergeBanner content={storefront.concierge_config} />,
    faq: () => <FAQSection content={{ ...storefront.sections_content.faq, items: storefront.faq_config }} />,
    how_it_works: () => <HowItWorks content={storefront.sections_content.how_it_works} />,
    cta_banner: () => <CtaBanner content={storefront.sections_content.cta_banner} />,
    comparator: () => <VehicleComparator content={storefront.sections_content.comparator} />,
  };

  const currentOrder = Array.isArray(storefront.sections_order) && storefront.sections_order.length > 0
    ? storefront.sections_order
    : [
        { id: "hero", active: true },
        { id: "experience", active: true },
        { id: "vibe_selector", active: !!sections.vibe_selector },
        { id: "lifestyle_gallery", active: !!sections.lifestyle_gallery },
        { id: "stats", active: !!sections.stats },
        { id: "why_us", active: !!sections.why_us },
        { id: "featured", active: !!sections.featured },
        { id: "testimonials", active: !!sections.testimonials },
        { id: "map", active: !!sections.map },
        { id: "concierge_banner", active: !!sections.concierge_banner },
        { id: "faq", active: !!sections.faq },
        { id: "how_it_works", active: true },
        { id: "cta_banner", active: true },
        { id: "comparator", active: !!sections.comparator },
      ];

  return (
    <main className="min-h-screen overflow-x-hidden">
      <JsonLd agency={storefront} />
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-primary z-[100] origin-left"
        style={{ scaleX }}
        role="progressbar"
        aria-valuenow={Math.round(scrollYProgress.get() * 100)}
        aria-label="Progression"
      />
      <Suspense fallback={<SectionSkeleton className="h-screen" />}>
        {currentOrder.filter((s) => s.active !== false).map((s, i) => (
          <Suspense key={s.id} fallback={<SectionSkeleton />}>
            {s.id === 'hero' ? (
                SECTION_MAP[s.id]?.()
            ) : (
                <motion.div
                  className={i === 1 ? "-mt-16 md:-mt-24 lg:-mt-32 relative z-10" : "relative z-10"}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  {SECTION_MAP[s.id]?.()}
                </motion.div>
            )}
          </Suspense>
        ))}
      </Suspense>
      <StickyBookingBar
        content={storefront.sections_content.sticky_booking}
        location={location} setLocation={setLocation}
        startDate={startDate} setStartDate={setStartDate}
        endDate={endDate} setEndDate={setEndDate}
        onSearch={handleSearch}
      />
      <PromotionBanner content={storefront.sections_content.promotion_banner} />
    </main>
  );
}
