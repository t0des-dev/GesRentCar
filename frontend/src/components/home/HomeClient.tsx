"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState, useMemo, Suspense, useCallback, type ReactNode } from "react";
import { motion, useScroll, useSpring, useMotionValueEvent } from "framer-motion";

import { useVehicles } from "@/shared/hooks/useApi";
import { useTranslation } from "@/shared/hooks/useTranslation";
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
const ConciergeBanner = dynamic(() => import("@/modules/ai/components/ConciergeBanner"), { ssr: false });
const FAQSection = dynamic(() => import("@/components/FAQSection"), { ssr: false });
const HowItWorks = dynamic(() => import("@/components/home/HowItWorks"));
const CtaBanner = dynamic(() => import("@/components/home/CtaBanner"));
const VehicleComparator = dynamic(() => import("@/modules/fleet/components/VehicleComparator"), { ssr: false });
const ExperienceSection = dynamic(() => import("@/components/home/ExperienceSection"));

import JsonLd from "@/components/SEO/JsonLd";

const SECTION_SKELETON_HEIGHTS: Record<string, string> = {
  hero: "h-screen",
  stats: "h-40",
  featured: "h-[500px]",
  why_us: "h-[400px]",
  how_it_works: "h-[350px]",
  experience: "h-[500px]",
  testimonials: "h-[400px]",
  faq: "h-[500px]",
  cta_banner: "h-80",
  concierge_banner: "h-64",
  map: "h-[400px]",
  comparator: "h-[500px]",
};

function SectionSkeleton({ id, className }: { id?: string; className?: string }) {
  const height = className ?? SECTION_SKELETON_HEIGHTS[id ?? ""] ?? "h-96";
  return (
    <div
      className={`bg-slate-100 animate-pulse rounded-2xl ${height}`}
      role="presentation"
      aria-hidden="true"
    />
  );
}

export default function HomeClient() {
  const router = useRouter();
  const { t, lang } = useTranslation();
  const storefront = useStorefront();
  const [location, setLocation] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("vrc_search_location") || "";
  });
  const [startDate, setStartDate] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("vrc_search_start") || "";
  });
  const [endDate, setEndDate] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("vrc_search_end") || "";
  });
  const [scrollPercent, setScrollPercent] = useState(0);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollPercent(Math.round(latest * 100));
  });

  const sections = storefront.sections_config;
  const aboutText = lang === "ar" ? storefront.about_text_ar : lang === "en" ? storefront.about_text_en : storefront.about_text_fr;
  const STATS = storefront.stats_config.items || [];

  const currentOrder = useMemo(() => {
    if (Array.isArray(storefront.sections_order) && storefront.sections_order.length > 0) {
      return storefront.sections_order;
    }
    return [
      { id: "hero",              active: true },
      { id: "featured",          active: true },
      { id: "why_us",            active: true },
      { id: "how_it_works",      active: true },
      { id: "experience",        active: !!sections.experience },
      { id: "stats",             active: !!sections.stats },
      { id: "testimonials",      active: !!sections.testimonials },
      { id: "concierge_banner",  active: !!sections.concierge_banner },
      { id: "lifestyle_gallery", active: false },
      { id: "vibe_selector",     active: false },
      { id: "map",               active: false },
      { id: "faq",               active: !!sections.faq },
      { id: "comparator",        active: !!sections.comparator },
      { id: "cta_banner",        active: true },
    ];
  }, [storefront.sections_order, sections]);

  const featuredActive = useMemo(
    () => currentOrder.some((s) => s.id === "featured" && s.active !== false),
    [currentOrder]
  );

  const { data: apiData, isLoading } = useVehicles({ per_page: 24 }, { enabled: featuredActive });
  const featuredVehicles = apiData?.data ?? [];

  const handleSearch = useCallback(() => {
    localStorage.setItem("vrc_search_location", location);
    localStorage.setItem("vrc_search_start", startDate);
    localStorage.setItem("vrc_search_end", endDate);

    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (startDate) params.set("start_date", startDate);
    if (endDate) params.set("end_date", endDate);
    router.push(`/fleet?${params.toString()}`);
  }, [location, startDate, endDate, router]);

  const sectionMap = useMemo<Record<string, () => ReactNode>>(
    () => ({
      hero: () => (
        <HeroSection
          agency={storefront}
          content={storefront.sections_content.hero}
          location={location}
          setLocation={setLocation}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          onSearch={handleSearch}
          aboutText={aboutText}
          stats={STATS}
        />
      ),
      experience: () => <ExperienceSection content={storefront.sections_content.experience} />,
      stats: () => <StatsSection content={storefront.stats_config} />,
      vibe_selector: () => <VibeSelector content={storefront.sections_content.vibe} />,
      lifestyle_gallery: () => <LifestyleGallery content={storefront.sections_content.lifestyle} />,
      why_us: () => <WhyUsSection content={storefront.sections_content.why_us} />,
      featured: () => (
        <FeaturedVehicles
          vehicles={featuredVehicles}
          loading={isLoading}
          content={storefront.sections_content.featured_vehicles}
        />
      ),
      testimonials: () => <LifestyleSlider content={storefront.sections_content.testimonials as any} />,
      map: () => <ExperienceMap content={storefront.sections_content.map} />,
      concierge_banner: () => <ConciergeBanner content={storefront.concierge_config} />,
      faq: () => (
        <FAQSection content={{ ...storefront.sections_content.faq, items: storefront.faq_config }} />
      ),
      how_it_works: () => <HowItWorks content={storefront.sections_content.how_it_works} />,
      cta_banner: () => <CtaBanner content={storefront.sections_content.cta_banner} />,
      comparator: () => <VehicleComparator content={storefront.sections_content.comparator} />,
    }),
    [storefront, location, startDate, endDate, handleSearch, aboutText, STATS, featuredVehicles, isLoading]
  );

  const activeSections = useMemo(
    () => currentOrder.filter((s) => s.active !== false),
    [currentOrder]
  );

  return (
    <main className="min-h-screen overflow-x-hidden">
      <JsonLd agency={storefront as any} />
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-primary z-[100] origin-left"
        style={{ scaleX }}
        role="progressbar"
        aria-valuenow={scrollPercent}
        aria-label="Progression"
      />
      <Suspense fallback={<SectionSkeleton id="hero" />}>
        {activeSections.map((s) => (
          <Suspense key={s.id} fallback={<SectionSkeleton id={s.id} />}>
            {s.id === "hero" ? (
              sectionMap[s.id]?.()
            ) : (
              <motion.div
                className="relative z-10"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                {sectionMap[s.id]?.()}
              </motion.div>
            )}
          </Suspense>
        ))}
      </Suspense>
      <StickyBookingBar
        content={storefront.sections_content.sticky_booking}
        location={location}
        setLocation={setLocation}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onSearch={handleSearch}
      />
      <PromotionBanner content={storefront.sections_content.promotion_banner} />
    </main>
  );
}
