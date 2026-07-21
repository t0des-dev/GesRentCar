"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Plane,
  Calendar,
  Building2,
  Crown,
  Heart,
  Globe,
  CheckCircle2,
  CreditCard,
  Shield,
  Users,
  Clock,
  MapPin,
  Headphones,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 0.61, 0.36, 1] as const },
  }),
};

const pillars = [
  { icon: Users, title: "Individuals & Families", desc: "Airport delivery, flexible rentals, luxury occasions." },
  { icon: Building2, title: "Businesses & Teams", desc: "Corporate mobility, invoicing, dedicated support." },
  { icon: Globe, title: "Travelers & Expats", desc: "Long-term plans, nationwide partner coverage." },
];

const services = [
  {
    num: "01", icon: Plane, title: "Airport Delivery",
    desc: "Reserve your vehicle before landing and have it ready at the airport upon your arrival.",
    benefits: ["Flight monitoring", "Meet & Greet", "Fast delivery", "No waiting"],
    img: "https://d8j0ntlcm91z4.cloudfront.net/user_37ViyXy5wzTHehYko7ikpcrqfdW/hf_20260710_084059_5c134fcd-ae1b-4480-8d6d-fe86c1420af9.png",
    reverse: false,
  },
  {
    num: "02", icon: Calendar, title: "Long-Term Rental",
    desc: "Flexible monthly rental plans for professionals, expatriates and businesses.",
    benefits: ["Better pricing", "Flexible duration", "Dedicated support", "Fleet upgrades"],
    img: "https://d8j0ntlcm91z4.cloudfront.net/user_37ViyXy5wzTHehYko7ikpcrqfdW/hf_20260710_084104_2f1b9c00-ec11-411f-b816-fe7b735f0d1f.png",
    reverse: true,
  },
  {
    num: "03", icon: Building2, title: "Corporate Mobility",
    desc: "Tailored mobility solutions for companies requiring reliable transportation.",
    benefits: ["Business invoicing", "Dedicated account manager", "Multiple vehicles", "Priority support"],
    img: "https://d8j0ntlcm91z4.cloudfront.net/user_37ViyXy5wzTHehYko7ikpcrqfdW/hf_20260710_084109_103cc7c2-ddb6-4b81-b8fd-e4c8a11845dc.png",
    reverse: false,
  },
  {
    num: "04", icon: Crown, title: "Luxury Collection",
    desc: "Premium vehicles for executives, VIP guests and special occasions.",
    benefits: ["BMW", "Mercedes", "Range Rover", "Audi"],
    img: "https://d8j0ntlcm91z4.cloudfront.net/user_37ViyXy5wzTHehYko7ikpcrqfdW/hf_20260705_235034_619b7dbe-138a-47c0-99bc-2bc4b809db95.png",
    reverse: true,
  },
  {
    num: "05", icon: Heart, title: "Wedding & Special Events",
    desc: "Luxury transportation for weddings, ceremonies and exclusive events.",
    benefits: ["Elegant vehicles", "Professional presentation", "Flexible scheduling"],
    img: "https://d8j0ntlcm91z4.cloudfront.net/user_37ViyXy5wzTHehYko7ikpcrqfdW/hf_20260710_084113_3a3eec71-7582-446f-b216-38d5ffb8bd0a.png",
    reverse: false,
  },
  {
    num: "06", icon: Globe, title: "Partner Fleet Network",
    desc: "AR7 works with carefully selected rental partners across Morocco. Every partner follows AR7 quality standards, and every vehicle is inspected before delivery.",
    benefits: ["Larger fleet", "More availability", "Nationwide coverage", "Same quality standards"],
    img: "https://d8j0ntlcm91z4.cloudfront.net/user_37ViyXy5wzTHehYko7ikpcrqfdW/hf_20260709_082429_831bf7af-bc21-4476-94b9-568702fa4dc9.png",
    reverse: true,
  },
];

const whyCards = [
  { icon: CreditCard, title: "Transparent Pricing", desc: "Clear quotes, no hidden fees." },
  { icon: Shield, title: "Inspected Vehicles", desc: "Every vehicle meets AR7 standards." },
  { icon: Clock, title: "24/7 Support", desc: "Always available when you need us." },
  { icon: MapPin, title: "Nationwide Coverage", desc: "15+ cities across Morocco." },
  { icon: Plane, title: "Airport Delivery", desc: "Ready when you land." },
  { icon: Headphones, title: "Dedicated Manager", desc: "For corporate accounts." },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="relative h-[420px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://d8j0ntlcm91z4.cloudfront.net/user_37ViyXy5wzTHehYko7ikpcrqfdW/hf_20260705_234846_ddb46cb6-92fc-4bea-84c5-66c6286c6d41.png" alt="Premium sedan on a Moroccan coastal road" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(100deg,rgba(15,20,38,0.85) 0%,rgba(15,20,38,0.6) 48%,rgba(15,20,38,0.3) 100%)" }} />
        </div>
        <div className="max-w-[1280px] mx-auto px-8 relative z-10 pt-[60px]">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-[640px]">
            <div className="inline-flex items-center gap-[10px] text-gold text-[12px] font-semibold uppercase tracking-[0.16em] mb-[18px]">
              <span className="w-[22px] h-[1px] bg-gold" /> Our Services
            </div>
            <h1 className="font-sora text-[clamp(28px,3.8vw,42px)] font-bold text-white leading-[1.18] mb-4">Premium Mobility Solutions for Every Journey</h1>
            <p className="text-[15.5px] text-white/80 max-w-[540px] mb-[30px]">From airport transfers to corporate fleets, AR7 Victoria Car offers tailored rental solutions designed for individuals, businesses and travelers across Morocco.</p>
            <div className="flex gap-[14px] flex-wrap">
              <Link href="/fleet" className="inline-flex items-center justify-center gap-2 px-[30px] py-[16px] rounded-full font-sora font-semibold text-[15px] bg-gold text-navy transition-all hover:-translate-y-0.5">Explore Our Fleet</Link>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-[30px] py-[16px] rounded-full font-sora font-semibold text-[15px] bg-transparent text-white border border-white/35 transition-all hover:bg-white/8 hover:-translate-y-0.5">Contact Our Team</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="py-[120px]">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-[56px] items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <div className="w-[1px] h-[36px] bg-gradient-to-b from-gold to-transparent mb-[22px]" />
              <div className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-gold mb-[18px]">
                <span className="w-[22px] h-[1px] bg-gold" /> Services Overview
              </div>
              <h2 className="font-sora text-[clamp(24px,2.8vw,32px)] font-bold leading-[1.24] text-navy mb-[18px]">More than daily rentals — a mobility partner.</h2>
              <p className="text-[15.5px] text-[#5b6472] mb-4">Every customer arrives with a different need: a business trip that can&apos;t afford delays, a family vacation that needs flexibility, or a company that needs reliable transportation at scale. AR7 Victoria Car builds a solution around each of these profiles.</p>
              <p className="text-[15.5px] text-[#5b6472]">Whether it&apos;s a single airport pickup or a fleet of vehicles for your team, the same standard of care applies — transparent pricing, inspected vehicles, and support whenever you need it.</p>
            </motion.div>
            <div className="flex flex-col gap-4">
              {pillars.map((p, i) => (
                <motion.div key={p.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="flex items-start gap-[18px] p-5 bg-white border border-[rgba(29,29,31,0.09)] rounded-[14px] hover:border-gold transition-all">
                  <div className="w-[46px] h-[46px] rounded-[13px] bg-[rgba(194,161,91,0.14)] flex items-center justify-center shrink-0">
                    <p.icon size={21} className="text-gold" />
                  </div>
                  <div>
                    <b className="block font-sora text-[15px] text-navy mb-1">{p.title}</b>
                    <span className="text-[13px] text-[#8a8f98]">{p.desc}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES LIST */}
      <section className="py-[120px] bg-white">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="w-[1px] h-[36px] bg-gradient-to-b from-gold to-transparent mb-[22px]" />
          <div className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-gold mb-[18px]">
            <span className="w-[22px] h-[1px] bg-gold" /> Main Services
          </div>
          <h2 className="font-sora text-[clamp(26px,3.2vw,38px)] font-bold leading-[1.2] text-navy mb-[56px]">Six ways we get you moving.</h2>

          <div className="flex flex-col gap-0">
            {services.map((s, i) => (
              <motion.div key={s.num} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className={`grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-center py-[60px] ${i > 0 ? "border-t border-[rgba(29,29,31,0.09)]" : ""}`}>
                <div className={`rounded-[18px] overflow-hidden aspect-[4/3] relative shadow-[0_1px_0_rgba(29,29,31,0.09)] ${s.reverse ? "lg:order-2" : ""}`}>
                  <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
                  <span className="absolute top-5 left-5 bg-gold text-navy text-[11px] font-bold uppercase tracking-[0.04em] px-3 py-1.5 rounded-full font-sora">{s.num}</span>
                </div>
                <div className={s.reverse ? "lg:order-1" : ""}>
                  <div className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-gold mb-4">
                    <span className="w-[22px] h-[1px] bg-gold" /> Service {s.num}
                  </div>
                  <h3 className="font-sora text-[clamp(22px,2.6vw,28px)] font-bold leading-[1.22] text-navy mb-[18px]">{s.title}</h3>
                  <p className="text-[15px] text-[#5b6472] mb-6">{s.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {s.benefits.map((b) => (
                      <span key={b} className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-navy bg-[#EEF2F6] px-3.5 py-[7px] rounded-full">
                        <CheckCircle2 size={12} className="text-gold" /> {b}
                      </span>
                    ))}
                  </div>
                  <Link href="/fleet" className="inline-flex items-center justify-center gap-2 px-[30px] py-[16px] rounded-full font-sora font-semibold text-[15px] bg-navy text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgba(22,33,62,0.5)]">
                    Get Started
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="py-[120px]">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center mb-[56px] max-w-[640px] mx-auto">
            <div className="w-[1px] h-[36px] bg-gradient-to-b from-gold to-transparent mx-auto mb-[22px]" />
            <div className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-gold mb-[18px] justify-center">
              <span className="w-[22px] h-[1px] bg-gold" /> Why Choose Our Services
            </div>
            <h2 className="font-sora text-[clamp(26px,3.2vw,36px)] font-bold leading-[1.2] text-navy">Every service, backed by the same standard.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[22px]">
            {whyCards.map((c, i) => (
              <motion.div key={c.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="bg-white rounded-[18px] p-[30px_26px] border border-[rgba(29,29,31,0.09)] transition-all hover:border-gold hover:-translate-y-1 hover:shadow-[0_20px_45px_-20px_rgba(22,33,62,0.18)]">
                <div className="w-[46px] h-[46px] rounded-[13px] bg-[rgba(194,161,91,0.14)] flex items-center justify-center mb-[18px]">
                  <c.icon size={21} className="text-gold" />
                </div>
                <h4 className="font-sora text-[15px] font-bold text-navy mb-2">{c.title}</h4>
                <p className="text-[13px] text-[#8a8f98]">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-[110px] bg-navy text-center relative overflow-hidden">
        <div className="absolute top-[-50%] left-1/2 w-[900px] h-[900px] -translate-x-1/2 bg-[radial-gradient(circle,rgba(194,161,91,0.14)_0%,transparent_70%)]" />
        <div className="max-w-[620px] mx-auto relative z-10 px-8">
          <h2 className="font-sora text-[clamp(30px,4vw,44px)] font-bold text-white leading-[1.15] mb-[18px]">Ready to Get Moving?</h2>
          <p className="text-white/68 text-[16.5px] mb-10">Choose your vehicle, pick your dates, and let us handle the rest.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/fleet" className="inline-flex items-center justify-center gap-2 px-[34px] py-[18px] rounded-full font-sora font-semibold text-[15px] bg-gold text-navy transition-all hover:-translate-y-0.5">Reserve Your Vehicle</Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-[34px] py-[18px] rounded-full font-sora font-semibold text-[15px] bg-transparent text-white border border-white/35 transition-all hover:bg-white/8 hover:-translate-y-0.5">Contact Sales</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
