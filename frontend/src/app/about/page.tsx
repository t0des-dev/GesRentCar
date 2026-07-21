"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  CreditCard,
  MapPin,
  Clock,
  ShieldCheck,
  Car,
  Users,
  Award,
  CheckCircle2,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 0.61, 0.36, 1] as const },
  }),
};

const values = [
  { icon: Heart, title: "Premium Experience", desc: "Every touchpoint designed around comfort and confidence." },
  { icon: CreditCard, title: "Transparency", desc: "Clear pricing, no hidden fees, no surprises at pickup." },
  { icon: MapPin, title: "Reliable Mobility", desc: "Available where and when you need it, across Morocco." },
  { icon: ShieldCheck, title: "High Standards", desc: "Every vehicle inspected and maintained to the same standard." },
];

const stats = [
  { num: "500+", label: "Vehicles", icon: Car },
  { num: "25+", label: "Trusted Partners", icon: Users },
  { num: "15+", label: "Cities Covered", icon: MapPin },
  { num: "2,400+", label: "Reservations", icon: Award },
  { num: "24/7", label: "Customer Support", icon: Clock },
  { num: "4.9/5", label: "Customer Rating", icon: Award },
];

const features = [
  { icon: CreditCard, title: "Transparent Pricing" },
  { icon: MapPin, title: "Airport Delivery" },
  { icon: Clock, title: "24/7 Assistance" },
  { icon: ShieldCheck, title: "Secure Booking" },
  { icon: Car, title: "Modern Fleet" },
  { icon: Award, title: "Certified Partners" },
  { icon: Users, title: "Premium Customer Service" },
  { icon: CheckCircle2, title: "Flexible Rental Solutions" },
];

const processSteps = [
  { num: "01", title: "Choose Vehicle", desc: "Browse the fleet and compare specs in seconds." },
  { num: "02", title: "Reserve", desc: "Confirm your dates and details online." },
  { num: "03", title: "Confirmation", desc: "Instant or partner-verified — you'll always know." },
  { num: "04", title: "Vehicle Delivery", desc: "Pick up at the airport or your chosen location." },
  { num: "05", title: "Enjoy Your Journey", desc: "Unlimited mileage, 24/7 support along the way." },
];

const testimonials = [
  { name: "Youssef B.", city: "Casablanca", text: "Effortless booking and the car was waiting exactly on time at the airport. Genuinely premium from start to finish.", img: "https://d8j0ntlcm91z4.cloudfront.net/user_37ViyXy5wzTHehYko7ikpcrqfdW/hf_20260706_100639_47cc9be8-658d-44d6-a28b-cb0e911f09b2.png" },
  { name: "Sophie L.", city: "Marrakech", text: "We rented an SUV for a family trip to Marrakech. Spotless car, transparent price, instant WhatsApp support.", img: "https://d8j0ntlcm91z4.cloudfront.net/user_37ViyXy5wzTHehYko7ikpcrqfdW/hf_20260706_100643_a60a1bb7-a788-49b6-b88e-8ef78d9f39ff.png" },
  { name: "Nadia K.", city: "Rabat", text: "Our company books all business travel through AR7 now. Reliable fleet, clean invoicing, zero surprises.", img: "https://d8j0ntlcm91z4.cloudfront.net/user_37ViyXy5wzTHehYko7ikpcrqfdW/hf_20260706_100646_65efbb8d-e13b-4d25-9c18-eef7fc12c8b6.png" },
  { name: "Karim T.", city: "Tangier", text: "The partner-verified booking felt just as premium as an instant one — clear updates the whole way through.", img: "https://d8j0ntlcm91z4.cloudfront.net/user_37ViyXy5wzTHehYko7ikpcrqfdW/hf_20260706_100639_47cc9be8-658d-44d6-a28b-cb0e911f09b2.png" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[78vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://d8j0ntlcm91z4.cloudfront.net/user_37ViyXy5wzTHehYko7ikpcrqfdW/hf_20260708_233823_2cb847de-8c44-4df3-8b9f-b0dd7912ca17.png"
            alt="Premium sedan overlooking Morocco"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(100deg, rgba(15,20,38,0.82) 0%, rgba(15,20,38,0.58) 46%, rgba(15,20,38,0.28) 100%)" }} />
        </div>

        <div className="max-w-[1280px] mx-auto px-8 relative z-10 py-40">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-[660px]">
            <div className="eyebrow font-sora">
              <span className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-gold mb-[18px]">
                <span className="w-[22px] h-[1px] bg-gold" />
                About AR7 Victoria Car
              </span>
            </div>
            <h1 className="font-sora text-[clamp(36px,5vw,54px)] font-bold text-white leading-[1.16] tracking-[-0.02em] mb-6">
              Driven by <em className="not-italic text-gold">Excellence.</em> Trusted Across Morocco.
            </h1>
            <p className="text-[17.5px] leading-[1.65] text-white/82 max-w-[560px] mb-10">
              AR7 Victoria Car was built on a simple idea: renting a premium vehicle should feel as effortless and trustworthy as the journey it enables. From Casablanca to Marrakech, we combine a modern fleet, transparent pricing, and a certified partner network to deliver the same premium standard, every time.
            </p>
            <Link href="/fleet" className="inline-flex items-center justify-center gap-2 px-[30px] py-[16px] rounded-full font-sora font-semibold text-[15px] bg-gold text-navy transition-all hover:-translate-y-0.5">
              Explore Our Fleet
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── OUR VISION ───────────────────────────────────────────────── */}
      <section className="py-[120px]">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-start">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <div className="w-[1px] h-[36px] bg-gradient-to-b from-gold to-transparent mb-[22px]" />
              <div className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-gold mb-[18px]">
                <span className="w-[22px] h-[1px] bg-gold" />
                Our Vision
              </div>
              <h2 className="font-sora text-[clamp(26px,3vw,34px)] font-bold leading-[1.2] text-navy mb-5">
                Why AR7 Victoria Car exists.
              </h2>
              <p className="text-[15.5px] leading-[1.65] text-[#5b6472] mb-5">
                We believe premium mobility shouldn&apos;t be complicated. AR7 Victoria Car exists to give travelers, businesses, and families across Morocco a rental experience built on clarity, consistency, and care — the same standard whether you&apos;re picking up a compact car or a flagship sedan.
              </p>
              <p className="text-[15.5px] leading-[1.65] text-[#5b6472]">
                Every decision we make, from the vehicles we add to the fleet to the partners we work with, is guided by one question: would we trust this experience ourselves?
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-[18px]">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className="bg-white border border-[rgba(29,29,31,0.09)] rounded-[14px] p-[26px_22px] transition-all hover:border-gold hover:-translate-y-[3px]"
                >
                  <div className="w-[42px] h-[42px] rounded-[12px] bg-[rgba(194,161,91,0.14)] flex items-center justify-center mb-4">
                    <v.icon size={20} className="text-gold" />
                  </div>
                  <h4 className="font-sora text-[14.5px] font-bold text-navy mb-[6px]">{v.title}</h4>
                  <p className="text-[12.5px] text-[#8a8f98] leading-[1.5]">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── AR7 IN NUMBERS ──────────────────────────────────────────── */}
      <section className="py-[120px] bg-navy text-white relative overflow-hidden">
        <div className="absolute top-[-40%] left-1/2 w-[800px] h-[800px] -translate-x-1/2 bg-[radial-gradient(circle,rgba(194,161,91,0.12)_0%,transparent_70%)]" />
        <div className="max-w-[1280px] mx-auto px-8 relative z-10">
          <div className="text-center mb-[56px] max-w-[640px] mx-auto">
            <div className="w-[1px] h-[36px] bg-gradient-to-b from-gold to-transparent mx-auto mb-[22px]" />
            <div className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-gold mb-[18px] justify-center">
              <span className="w-[22px] h-[1px] bg-gold" />
              AR7 in Numbers
            </div>
            <h2 className="font-sora text-[clamp(28px,3.4vw,40px)] font-bold leading-[1.18] text-white mb-4">
              A fleet and a network built on scale.
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="text-center p-2"
              >
                <div className="w-[44px] h-[44px] rounded-[12px] bg-[rgba(194,161,91,0.14)] flex items-center justify-center mx-auto mb-[18px]">
                  <s.icon size={20} className="text-gold" />
                </div>
                <div className="font-sora text-[clamp(26px,2.6vw,34px)] font-bold text-white mb-2 tracking-[-0.01em]">{s.num}</div>
                <div className="text-[12.5px] text-white/60">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FLEET & PARTNER NETWORK ─────────────────────────────────── */}
      <section className="py-[120px]">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="rounded-[18px] overflow-hidden aspect-[4/3] shadow-[0_1px_0_rgba(29,29,31,0.09)]">
              <img
                src="https://d8j0ntlcm91z4.cloudfront.net/user_37ViyXy5wzTHehYko7ikpcrqfdW/hf_20260709_082429_831bf7af-bc21-4476-94b9-568702fa4dc9.png"
                alt="Fleet of modern rental vehicles"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
              <div className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-gold mb-4">
                <span className="w-[22px] h-[1px] bg-gold" />
                Our Fleet &amp; Partner Network
              </div>
              <h2 className="font-sora text-[clamp(24px,3vw,32px)] font-bold leading-[1.22] text-navy mb-[18px]">
                One standard, whether the vehicle is ours or a partner&apos;s.
              </h2>
              <p className="text-[15px] text-[#5b6472] mb-6">
                AR7 Victoria Car combines company-owned vehicles with a carefully selected network of partner agencies across Morocco — giving you a wider range of vehicles without compromising on quality.
              </p>
              <div className="flex flex-col gap-[14px]">
                {[
                  "Every vehicle is inspected before it reaches you.",
                  "Every partner agency follows AR7's quality standards.",
                  "You receive the same premium experience, regardless of the vehicle's owner.",
                ].map((text) => (
                  <div key={text} className="flex items-start gap-3 text-[14.5px] text-[#3d4249]">
                    <CheckCircle2 size={19} className="text-gold shrink-0 mt-[1px]" />
                    {text}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE AR7 ──────────────────────────────────────────── */}
      <section className="py-[120px] bg-white">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center mb-[56px] max-w-[640px] mx-auto">
            <div className="w-[1px] h-[36px] bg-gradient-to-b from-gold to-transparent mx-auto mb-[22px]" />
            <div className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-gold mb-[18px] justify-center">
              <span className="w-[22px] h-[1px] bg-gold" />
              Why Choose AR7
            </div>
            <h2 className="font-sora text-[clamp(28px,3.4vw,40px)] font-bold leading-[1.18] text-navy mb-4">
              Every detail, built around your confidence.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[22px]">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="bg-white rounded-[18px] p-[32px_26px] border border-[rgba(29,29,31,0.09)] transition-all duration-300 hover:border-gold hover:-translate-y-1 hover:shadow-[0_20px_45px_-20px_rgba(22,33,62,0.18)]"
              >
                <div className="w-[48px] h-[48px] rounded-[13px] bg-[rgba(194,161,91,0.14)] flex items-center justify-center mb-5">
                  <f.icon size={22} className="text-gold" />
                </div>
                <h4 className="font-sora text-[15px] font-bold text-navy">{f.title}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUALITY COMMITMENT ──────────────────────────────────────── */}
      <section className="py-[120px]">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-gold mb-4">
                <span className="w-[22px] h-[1px] bg-gold" />
                Quality Commitment
              </div>
              <h2 className="font-sora text-[clamp(24px,3vw,32px)] font-bold leading-[1.22] text-navy mb-[18px]">
                Every vehicle, prepared like it&apos;s the only one.
              </h2>
              <p className="text-[15px] text-[#5b6472] mb-6">
                Before any vehicle reaches you — company-owned or partner — it passes through the same quality process, so the standard never depends on who happens to own the car.
              </p>
              <div className="flex flex-col gap-[14px]">
                {[
                  "Regular maintenance on every vehicle in the fleet.",
                  "Professional cleaning before every handover.",
                  "Full technical inspections for safety and reliability.",
                  "Premium presentation, every single pickup.",
                ].map((text) => (
                  <div key={text} className="flex items-start gap-3 text-[14.5px] text-[#3d4249]">
                    <CheckCircle2 size={19} className="text-gold shrink-0 mt-[1px]" />
                    {text}
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="order-1 lg:order-2 rounded-[18px] overflow-hidden aspect-[4/3] shadow-[0_1px_0_rgba(29,29,31,0.09)]">
              <img
                src="https://d8j0ntlcm91z4.cloudfront.net/user_37ViyXy5wzTHehYko7ikpcrqfdW/hf_20260709_082432_55ff02cb-e10d-4490-b635-31f141524031.png"
                alt="Professional detailing of a luxury vehicle"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────── */}
      <section className="py-[120px] bg-[#EEF2F6]">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center mb-[56px] max-w-[640px] mx-auto">
            <div className="w-[1px] h-[36px] bg-gradient-to-b from-gold to-transparent mx-auto mb-[22px]" />
            <div className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-gold mb-[18px] justify-center">
              <span className="w-[22px] h-[1px] bg-gold" />
              How It Works
            </div>
            <h2 className="font-sora text-[clamp(26px,3.2vw,36px)] font-bold leading-[1.2] text-navy">
              A simple journey, from search to the open road.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative">
            <div className="absolute top-[27px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-[rgba(194,161,91,0.4)] to-transparent hidden lg:block" />
            {processSteps.map((step, i) => (
              <motion.div
                key={step.num}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="text-center relative"
              >
                <div className="w-[54px] h-[54px] rounded-full bg-white border border-[rgba(194,161,91,0.14)] flex items-center justify-center mx-auto mb-5 relative z-10 font-sora font-bold text-gold text-[16px]">
                  {step.num}
                </div>
                <h4 className="font-sora text-[15.5px] font-bold text-navy mb-[9px]">{step.title}</h4>
                <p className="text-[13px] text-[#6b7280] leading-[1.6]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────── */}
      <section className="py-[120px] bg-white">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center mb-[56px] max-w-[640px] mx-auto">
            <div className="w-[1px] h-[36px] bg-gradient-to-b from-gold to-transparent mx-auto mb-[22px]" />
            <div className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-gold mb-[18px] justify-center">
              <span className="w-[22px] h-[1px] bg-gold" />
              Customer Testimonials
            </div>
            <h2 className="font-sora text-[clamp(28px,3.4vw,40px)] font-bold leading-[1.18] text-navy mb-4">
              Trusted by thousands across Morocco.
            </h2>
            <div className="flex items-center justify-center gap-[10px] text-[14.5px] text-[#5b6472] font-medium">
              <span className="text-gold tracking-[2px]">★★★★★</span>
              <span className="font-sora font-bold text-navy">4.9/5</span> — Based on 2,400+ verified reservations
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[22px]">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="bg-white rounded-[18px] p-[28px_26px] border border-[rgba(29,29,31,0.09)]"
              >
                <div className="text-gold text-[13px] tracking-[2px] mb-[14px]">★★★★★</div>
                <p className="text-[13.5px] text-[#3d4249] leading-[1.65] mb-5">{t.text}</p>
                <div className="flex items-center gap-3">
                  <img src={t.img} alt={t.name} className="w-[40px] h-[40px] rounded-full object-cover border-2 border-[rgba(194,161,91,0.14)]" />
                  <div>
                    <div className="font-sora text-[13.5px] font-bold text-navy">{t.name}</div>
                    <div className="text-[11.5px] text-[#8a8f98]">{t.city}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────── */}
      <section className="py-[110px] bg-navy text-center relative overflow-hidden">
        <div className="absolute top-[-50%] left-1/2 w-[900px] h-[900px] -translate-x-1/2 bg-[radial-gradient(circle,rgba(194,161,91,0.14)_0%,transparent_70%)]" />
        <div className="max-w-[620px] mx-auto relative z-10 px-8">
          <h2 className="font-sora text-[clamp(32px,4.4vw,50px)] font-bold text-white leading-[1.15] mb-5">
            Ready to Experience Premium Car Rental?
          </h2>
          <p className="text-white/68 text-[17.5px] mb-11">
            Join thousands of travelers who trust AR7 Victoria Car for every journey across Morocco.
          </p>
          <div className="flex gap-[18px] justify-center flex-wrap">
            <Link href="/fleet" className="inline-flex items-center justify-center gap-2 px-[38px] py-[19px] rounded-full font-sora font-semibold text-[15.5px] bg-gold text-navy transition-all hover:-translate-y-0.5">
              Reserve Your Vehicle
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-[38px] py-[19px] rounded-full font-sora font-semibold text-[15.5px] bg-transparent text-white border border-white/35 transition-all hover:bg-white/8 hover:-translate-y-0.5">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
