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

const DualCtaSection = dynamic(() => import("@/components/home/DualCtaSection"), { ssr: false });
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
const ExperienceSection = dynamic(() => import("@/components/home/ExperienceSection"));
const TrustBar = dynamic(() => import("@/components/home/TrustBar"), { ssr: false });
const LuxuryCollection = dynamic(() => import("@/components/home/LuxuryCollection"), { ssr: false });
const ServicesSection = dynamic(() => import("@/components/home/ServicesSection"), { ssr: false });
const ProcessSteps = dynamic(() => import("@/components/home/ProcessSteps"), { ssr: false });
const TestimonialsGrid = dynamic(() => import("@/components/home/TestimonialsGrid"), { ssr: false });
const FinalCta = dynamic(() => import("@/components/home/FinalCta"), { ssr: false });

import JsonLd from "@/components/SEO/JsonLd";

const SECTION_SKELETON_HEIGHTS: Record<string, string> = {
  hero: "h-screen",
  trust_bar: "h-24",
  stats: "h-40",
  featured: "h-[500px]",
  luxury: "h-[500px]",
  services: "h-[500px]",
  process: "h-[350px]",
  testimonials_grid: "h-[500px]",
  why_us: "h-[400px]",
  how_it_works: "h-[350px]",
  experience: "h-[500px]",
  testimonials: "h-[400px]",
  faq: "h-[500px]",
  cta_banner: "h-80",
  dual_cta: "h-[500px]",
  final_cta: "h-[400px]",
  concierge_banner: "h-64",
  map: "h-[400px]",
};

function SectionSkeleton({ id, className }: { id?: string; className?: string }) {
  const height = className ?? SECTION_SKELETON_HEIGHTS[id ?? ""] ?? "h-96";
  return (
    <div
      className={`bg-surface-2 animate-pulse rounded-2xl ${height}`}
      role="presentation"
      aria-hidden="true"
    />
  );
}

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

function getTomorrowString(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

function getStoredDateOrToday(key: string): string {
  const stored = localStorage.getItem(key);
  if (stored && stored >= getTodayString()) return stored;
  return getTodayString();
}

function getStoredDateOrTomorrow(key: string): string {
  const stored = localStorage.getItem(key);
  if (stored && stored >= getTodayString()) return stored;
  return getTomorrowString();
}

function getStoredTimeOrNow(key: string): string {
  const stored = localStorage.getItem(key);
  if (stored) return stored;
  const now = new Date();
  const m = now.getMinutes();
  const r = m < 30 ? 30 : 0;
  if (r === 0) now.setHours(now.getHours() + 1);
  now.setMinutes(r, 0, 0);
  return now.toTimeString().slice(0, 5);
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
    return getStoredDateOrToday("vrc_search_start");
  });
  const [endDate, setEndDate] = useState(() => {
    if (typeof window === "undefined") return "";
    return getStoredDateOrTomorrow("vrc_search_end");
  });
  const [startTime, setStartTime] = useState(() => {
    if (typeof window === "undefined") return "";
    return getStoredTimeOrNow("vrc_search_start_time");
  });
  const [scrollPercent, setScrollPercent] = useState(0);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollPercent(Math.round(latest * 100));
  });

  const sections = storefront.sections_config;
  const aboutText = lang === "en" ? storefront.about_text_en : storefront.about_text_fr;
  const STATS = storefront.stats_config.items || [];

  const currentOrder = useMemo(() => {
    if (Array.isArray(storefront.sections_order) && storefront.sections_order.length > 0) {
      return storefront.sections_order;
    }
    return [
      { id: "hero",              active: true },
      { id: "trust_bar",         active: true },
      { id: "featured",          active: true },
      { id: "luxury",            active: true },
      { id: "services",          active: true },
      { id: "process",           active: true },
      { id: "testimonials_grid", active: true },
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
      { id: "final_cta",         active: true },
      { id: "dual_cta",          active: true },
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
    localStorage.setItem("vrc_search_start_time", startTime);

    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (startDate) params.set("start_date", startDate);
    if (endDate) params.set("end_date", endDate);
    if (startTime) params.set("start_time", startTime);
    router.push(`/fleet?${params.toString()}`);
  }, [location, startDate, endDate, startTime, router]);

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
          startTime={startTime}
          setStartTime={setStartTime}
          onSearch={handleSearch}
          aboutText={aboutText}
          stats={STATS}
        />
      ),
      trust_bar: () => <TrustBar content={storefront.stats_config} />,
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
      luxury: () => <LuxuryCollection />,
      services: () => <ServicesSection />,
      process: () => <ProcessSteps />,
      testimonials_grid: () => <TestimonialsGrid />,
      testimonials: () => <LifestyleSlider content={storefront.sections_content.testimonials as any} />,
      map: () => <ExperienceMap content={storefront.sections_content.map} />,
      concierge_banner: () => <ConciergeBanner content={storefront.concierge_config} />,
      faq: () => (
        <FAQSection content={{ ...storefront.sections_content.faq, items: storefront.faq_config }} />
      ),
      how_it_works: () => <HowItWorks content={storefront.sections_content.how_it_works} />,
      final_cta: () => <FinalCta />,
      dual_cta: () => (
        <DualCtaSection
          promotion={storefront.sections_content.promotion_banner}
          cta={storefront.sections_content.cta_banner}
        />
      ),
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
                id={s.id}
                className="relative z-10 scroll-mt-20"
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
        startTime={startTime}
        setStartTime={setStartTime}
        onSearch={handleSearch}
      />
    </main>
  );
}
