"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Car,
  CalendarCheck,
  ShieldCheck,
  CreditCard,
  MapPin,
  Plane,
  MessageCircle,
  Clock,
  Shield,
  Users,
  Headphones,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 0.61, 0.36, 1] as const },
  }),
};

const steps = [
  { num: "01", title: "Choose Your Vehicle", desc: "Browse our fleet and select the vehicle that best fits your needs — Luxury, SUV, Economy or Business.", tags: ["Luxury", "SUV", "Economy", "Business"] },
  { num: "02", title: "Select Your Rental Details", desc: "Choose your pickup location, dates, and times. If airport delivery is selected, provide your flight information so we can monitor it." },
  { num: "03", title: "Reservation Request", desc: "After selecting your vehicle, submit your reservation request. At this stage, no commitment is required until availability has been verified." },
  { num: "04", title: "Confirmation", desc: "AR7 fleet vehicles confirm instantly after deposit. Partner vehicles are confirmed once availability is verified by our team." },
  { num: "05", title: "Secure Your Booking", desc: "Pay the 30% deposit online to secure your reservation. The remaining 70% is payable at vehicle pickup." },
  { num: "06", title: "Vehicle Delivery", desc: "Pick up your vehicle at the airport counter or city office. Our team will walk you through the handover." },
  { num: "07", title: "Enjoy Your Journey", desc: "Drive with confidence — unlimited mileage, 24/7 roadside assistance, and a dedicated support line." },
];

const whyCards = [
  { icon: CreditCard, title: "Transparent Pricing", desc: "Clear quotes, no hidden fees." },
  { icon: Shield, title: "Inspected Vehicles", desc: "Every vehicle meets AR7 standards." },
  { icon: Clock, title: "24/7 Support", desc: "Always available when you need us." },
  { icon: MapPin, title: "Nationwide Coverage", desc: "15+ cities across Morocco." },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="relative h-[400px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://d8j0ntlcm91z4.cloudfront.net/user_37ViyXy5wzTHehYko7ikpcrqfdW/hf_20260706_222730_73c4c460-1a9f-41d2-8cbc-dd7af1f780c7.png" alt="Premium sedan driving through Morocco" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(100deg,rgba(15,20,38,0.85) 0%,rgba(15,20,38,0.6) 50%,rgba(15,20,38,0.32) 100%)" }} />
        </div>
        <div className="max-w-[1280px] mx-auto px-8 relative z-10 pt-[60px]">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-[620px]">
            <div className="inline-flex items-center gap-[10px] text-gold text-[12px] font-semibold uppercase tracking-[0.16em] mb-[18px]">
              <span className="w-[22px] h-[1px] bg-gold" /> How It Works
            </div>
            <h1 className="font-sora text-[clamp(28px,3.8vw,42px)] font-bold text-white leading-[1.18] mb-4">Renting a Vehicle Has Never Been Easier</h1>
            <p className="text-[15.5px] text-white/80 max-w-[520px] mb-[30px]">Discover our simple reservation process designed to provide complete transparency from vehicle selection to pickup.</p>
            <div className="flex gap-[14px] flex-wrap">
              <Link href="/fleet" className="inline-flex items-center justify-center gap-2 px-[30px] py-[16px] rounded-full font-sora font-semibold text-[15px] bg-gold text-navy transition-all hover:-translate-y-0.5">Browse Our Fleet</Link>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-[30px] py-[16px] rounded-full font-sora font-semibold text-[15px] bg-transparent text-white border border-white/35 transition-all hover:bg-white/8 hover:-translate-y-0.5">Contact Our Team</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="py-[120px] bg-white">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="w-[1px] h-[36px] bg-gradient-to-b from-gold to-transparent mb-[22px]" />
          <div className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-gold mb-[18px]">
            <span className="w-[22px] h-[1px] bg-gold" /> Reservation Journey
          </div>
          <h2 className="font-sora text-[clamp(26px,3.2vw,36px)] font-bold leading-[1.2] text-navy mb-[56px]">Seven steps, zero uncertainty.</h2>

          <div className="flex flex-col gap-0 max-w-[800px]">
            {steps.map((step, i) => (
              <motion.div key={step.num} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="grid grid-cols-[64px_1fr] gap-7 relative pb-14 last:pb-0">
                {i < steps.length - 1 && <div className="absolute left-[31px] top-16 bottom-0 w-[1px] bg-[rgba(29,29,31,0.09)]" />}
                <div className="w-[64px] h-[64px] rounded-full bg-white border-[1.5px] border-[rgba(194,161,91,0.14)] flex items-center justify-center font-sora font-bold text-gold text-[20px] relative z-10 shrink-0">
                  {step.num}
                </div>
                <div className="pt-2">
                  <h3 className="font-sora text-[20px] font-bold text-navy mb-[10px]">{step.title}</h3>
                  <p className="text-[14.5px] text-[#5b6472] max-w-[640px] mb-4">{step.desc}</p>
                  {step.tags && (
                    <div className="flex flex-wrap gap-2">
                      {step.tags.map((t) => (
                        <span key={t} className="text-[11.5px] font-semibold text-navy bg-[#EEF2F6] px-3.5 py-[7px] rounded-full">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY DIFFERENT */}
      <section className="py-[120px]">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center mb-[56px] max-w-[640px] mx-auto">
            <div className="w-[1px] h-[36px] bg-gradient-to-b from-gold to-transparent mx-auto mb-[22px]" />
            <div className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-gold mb-[18px] justify-center">
              <span className="w-[22px] h-[1px] bg-gold" /> Why AR7
            </div>
            <h2 className="font-sora text-[clamp(26px,3.2vw,36px)] font-bold leading-[1.2] text-navy">Every step, built around your confidence.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[22px]">
            {whyCards.map((c, i) => (
              <motion.div key={c.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="bg-white rounded-[18px] p-[30px_24px] border border-[rgba(29,29,31,0.09)] transition-all hover:border-gold hover:-translate-y-1 hover:shadow-[0_20px_45px_-20px_rgba(22,33,62,0.18)]">
                <div className="w-[46px] h-[46px] rounded-[13px] bg-[rgba(194,161,91,0.14)] flex items-center justify-center mb-[18px]">
                  <c.icon size={21} className="text-gold" />
                </div>
                <h4 className="font-sora text-[14.5px] font-bold text-navy">{c.title}</h4>
                <p className="text-[13px] text-[#8a8f98] mt-1">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SUPPORT PANEL */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="bg-navy rounded-[18px] p-[56px_48px] text-center relative overflow-hidden">
            <div className="absolute top-[-60%] left-1/2 w-[700px] h-[700px] -translate-x-1/2 bg-[radial-gradient(circle,rgba(194,161,91,0.14)_0%,transparent_70%)]" />
            <div className="relative z-10">
              <h2 className="font-sora text-[clamp(24px,3vw,32px)] font-bold text-white mb-3">Need Help with Your Reservation?</h2>
              <p className="text-white/65 text-[15px] mb-8 max-w-[480px] mx-auto">Our team is available 24/7 to guide you through every step of the process.</p>
              <div className="flex gap-[14px] justify-center flex-wrap">
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-[30px] py-[16px] rounded-full font-sora font-semibold text-[15px] bg-gold text-navy transition-all hover:-translate-y-0.5">Contact Us</Link>
                <a href="https://wa.me/212500000000" className="inline-flex items-center justify-center gap-2 px-[30px] py-[16px] rounded-full font-sora font-semibold text-[15px] bg-transparent text-white border border-white/35 transition-all hover:bg-white/8 hover:-translate-y-0.5"><MessageCircle size={16} /> WhatsApp</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-[110px] bg-navy text-center relative overflow-hidden">
        <div className="absolute top-[-50%] left-1/2 w-[900px] h-[900px] -translate-x-1/2 bg-[radial-gradient(circle,rgba(194,161,91,0.14)_0%,transparent_70%)]" />
        <div className="max-w-[640px] mx-auto relative z-10 px-8">
          <h2 className="font-sora text-[clamp(30px,4vw,44px)] font-bold text-white leading-[1.15] mb-[18px]">Ready to Hit the Road?</h2>
          <p className="text-white/68 text-[16.5px] mb-10">Reserve your perfect vehicle today and experience premium car rental the way it should be.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/fleet" className="inline-flex items-center justify-center gap-2 px-[34px] py-[18px] rounded-full font-sora font-semibold text-[15px] bg-gold text-navy transition-all hover:-translate-y-0.5">Reserve Your Vehicle</Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-[34px] py-[18px] rounded-full font-sora font-semibold text-[15px] bg-transparent text-white border border-white/35 transition-all hover:bg-white/8 hover:-translate-y-0.5">Call +212 5 00 00 00 00</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
