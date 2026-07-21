"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Crown, ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 0.61, 0.36, 1] as const },
  }),
};

const luxuryCars = [
  { brand: "BMW", model: "7 Series", category: "Flagship Sedan", price: "1,450", img: "https://d8j0ntlcm91z4.cloudfront.net/user_37ViyXy5wzTHehYko7ikpcrqfdW/hf_20260705_234959_602a69e1-5744-4046-a0c2-7a10e3caf2be.png", badge: "Flagship" },
  { brand: "Mercedes-Benz", model: "S-Class", category: "Executive Sedan", price: "1,680", img: "https://d8j0ntlcm91z4.cloudfront.net/user_37ViyXy5wzTHehYko7ikpcrqfdW/hf_20260705_235004_574a6f88-faa4-48e4-989e-df4482b1c266.png", badge: "Executive" },
  { brand: "Range Rover", model: "Sport", category: "Luxury SUV", price: "1,890", img: "https://d8j0ntlcm91z4.cloudfront.net/user_37ViyXy5wzTHehYko7ikpcrqfdW/hf_20260705_235034_619b7dbe-138a-47c0-99bc-2bc4b809db95.png", badge: "SUV" },
  { brand: "Audi", model: "A6", category: "Premium Sedan", price: "980", img: "https://d8j0ntlcm91z4.cloudfront.net/user_37ViyXy5wzTHehYko7ikpcrqfdW/hf_20260705_235009_73e2f63e-7e81-4bb2-b6ba-fb9fa8f3426b.png", badge: "Premium" },
];

export default function LuxuryPage() {
  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="relative min-h-[88vh] min-h-[640px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://d8j0ntlcm91z4.cloudfront.net/user_37ViyXy5wzTHehYko7ikpcrqfdW/hf_20260705_235034_619b7dbe-138a-47c0-99bc-2bc4b809db95.png" alt="Luxury vehicle fleet" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(6,10,22,0.55) 0%,rgba(6,10,22,0.35) 40%,rgba(6,10,22,0.85) 100%)" }} />
        </div>
        <div className="max-w-[1280px] mx-auto px-8 relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-[760px] mx-auto">
            <div className="inline-flex items-center gap-[10px] text-gold text-[12.5px] font-semibold uppercase tracking-[0.2em] mb-7 justify-center">
              <span className="w-[26px] h-[1px] bg-gold" />
              Exclusive Collection
              <span className="w-[26px] h-[1px] bg-gold" />
            </div>
            <h1 className="font-sora text-[clamp(38px,5.6vw,64px)] font-bold text-white leading-[1.12] tracking-[-0.02em] mb-[26px]">The Luxury Collection</h1>
            <p className="text-[17px] leading-[1.7] text-white/82 max-w-[600px] mx-auto mb-[42px]">Handpicked flagship vehicles for those who demand the highest standards of comfort, performance, and prestige across Morocco.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/fleet" className="inline-flex items-center justify-center gap-2 px-[30px] py-[16px] rounded-full font-sora font-semibold text-[15px] bg-gold text-navy transition-all hover:-translate-y-0.5">Explore Fleet</Link>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-[30px] py-[16px] rounded-full font-sora font-semibold text-[15px] bg-transparent text-white border border-white/35 transition-all hover:bg-white/8 hover:-translate-y-0.5">Concierge Service</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* LUXURY CARS */}
      <section className="py-[120px]">
        <div className="max-w-[1440px] mx-auto px-10">
          <div className="text-center mb-[56px] max-w-[640px] mx-auto">
            <div className="w-[1px] h-[36px] bg-gradient-to-b from-gold to-transparent mx-auto mb-[22px]" />
            <div className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-gold mb-[18px] justify-center">
              <span className="w-[22px] h-[1px] bg-gold" /> Our Collection
            </div>
            <h2 className="font-sora text-[clamp(26px,3.2vw,38px)] font-bold leading-[1.2] text-navy mb-4">Flagship vehicles, curated for excellence.</h2>
            <p className="text-[16px] text-[#5b6472]">Each vehicle in our luxury collection has been handpicked for its exceptional comfort, cutting-edge technology, and timeless design.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[22px]">
            {luxuryCars.map((car, i) => (
              <motion.div key={car.model} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="bg-white rounded-[18px] overflow-hidden border-top-2 border-transparent transition-all hover:-translate-y-1 hover:shadow-[0_20px_45px_-20px_rgba(22,33,62,0.18)] hover:border-t-2 hover:border-t-gold group">
                <div className="relative aspect-[6/5] bg-[#EEF2F6] overflow-hidden">
                  <img src={car.img} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
                  <span className="absolute top-4 left-4 bg-gold text-navy text-[10.5px] font-bold uppercase tracking-[0.04em] px-3 py-1.5 rounded-full">{car.badge}</span>
                </div>
                <div className="p-[32px_30px_34px]">
                  <div className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-gold mb-[9px]">{car.category}</div>
                  <h3 className="font-sora text-[23px] font-bold text-navy mb-5">{car.brand} {car.model}</h3>
                  <div className="flex items-baseline gap-1.5 mb-6">
                    <span className="font-sora text-[26px] font-bold text-navy">{car.price}</span>
                    <span className="text-[13px] text-[#8a8f98]">MAD / day</span>
                  </div>
                  <Link href="/fleet" className="flex items-center justify-center gap-2 w-full py-4 rounded-full font-sora font-semibold text-[14.5px] bg-navy text-white transition-all hover:bg-navy/90">
                    Reserve Now <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONCIERGE CTA */}
      <section className="py-[110px] bg-navy text-center relative overflow-hidden">
        <div className="absolute top-[-50%] left-1/2 w-[900px] h-[900px] -translate-x-1/2 bg-[radial-gradient(circle,rgba(194,161,91,0.14)_0%,transparent_70%)]" />
        <div className="max-w-[620px] mx-auto relative z-10 px-8">
          <div className="w-[50px] h-[50px] rounded-full bg-[rgba(194,161,91,0.14)] flex items-center justify-center mx-auto mb-6">
            <Crown size={24} className="text-gold" />
          </div>
          <h2 className="font-sora text-[clamp(30px,4vw,44px)] font-bold text-white leading-[1.15] mb-[18px]">Need a Dedicated Concierge?</h2>
          <p className="text-white/68 text-[16.5px] mb-10">Our luxury concierge team can help you choose the perfect vehicle for your trip, arrange delivery, and handle every detail.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="https://wa.me/212500000000" className="inline-flex items-center justify-center gap-2 px-[34px] py-[18px] rounded-full font-sora font-semibold text-[15px] bg-gold text-navy transition-all hover:-translate-y-0.5">Contact Concierge</a>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-[34px] py-[18px] rounded-full font-sora font-semibold text-[15px] bg-transparent text-white border border-white/35 transition-all hover:bg-white/8 hover:-translate-y-0.5">Call Us</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
