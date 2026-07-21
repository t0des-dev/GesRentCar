"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, Plane, Building, Mountain, Waves, Sun } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 0.61, 0.36, 1] as const },
  }),
};

const categories = [
  { emoji: "🏖️", label: "Coastal" },
  { emoji: "🏔️", label: "Mountain" },
  { emoji: "🏜️", label: "Desert" },
  { emoji: "🏙️", label: "City" },
  { emoji: "🌊", label: "Beach" },
  { emoji: "🏛️", label: "Heritage" },
];

const destinations = [
  { name: "Casablanca", desc: "The economic capital — modern, vibrant, and cosmopolitan.", img: "https://d8j0ntlcm91z4.cloudfront.net/user_37ViyXy5wzTHehYko7ikpcrqfdW/hf_20260705_234944_9ce0a05a-2c90-460a-9b39-6fa93fd8007a.png", tags: ["City", "Business"], featured: true },
  { name: "Marrakech", desc: "The Red City — palaces, souks, and Atlas Mountain views.", img: "https://d8j0ntlcm91z4.cloudfront.net/user_37ViyXy5wzTHehYko7ikpcrqfdW/hf_20260705_234949_9433789d-ed38-4914-95cc-97fedb03bc17.png", tags: ["Heritage", "Mountain"], featured: true },
  { name: "Tangier", desc: "Gateway to Africa — Mediterranean charm and international flair.", img: "https://d8j0ntlcm91z4.cloudfront.net/user_37ViyXy5wzTHehYko7ikpcrqfdW/hf_20260705_234954_e58b6992-40f4-4373-a7ac-bbf3bdd34443.png", tags: ["Coastal", "City"], featured: true },
  { name: "Rabat", desc: "The capital — culture, history, and Atlantic coastline.", img: "https://d8j0ntlcm91z4.cloudfront.net/user_37ViyXy5wzTHehYko7ikpcrqfdW/hf_20260705_235029_8587618a-c824-4f83-9e0a-c58d7c888b33.png", tags: ["City", "Heritage"] },
  { name: "Agadir", desc: "Sun-drenched beaches and year-round warmth.", img: "https://d8j0ntlcm91z4.cloudfront.net/user_37ViyXy5wzTHehYko7ikpcrqfdW/hf_20260705_235023_6b301433-82be-4209-bb7f-3f2f6db250c7.png", tags: ["Beach", "Coastal"] },
  { name: "Fez", desc: "The spiritual heart — medieval medina and artisan culture.", img: "https://d8j0ntlcm91z4.cloudfront.net/user_37ViyXy5wzTHehYko7ikpcrqfdW/hf_20260705_235004_574a6f88-faa4-48e4-989e-df4482b1c266.png", tags: ["Heritage", "City"] },
];

export default function DestinationsPage() {
  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="relative min-h-[82vh] min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://d8j0ntlcm91z4.cloudfront.net/user_37ViyXy5wzTHehYko7ikpcrqfdW/hf_20260706_222730_73c4c460-1a9f-41d2-8cbc-dd7af1f780c7.png" alt="Moroccan landscape" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(100deg,rgba(15,20,38,0.82) 0%,rgba(15,20,38,0.5) 46%,rgba(15,20,38,0.22) 100%)" }} />
        </div>
        <div className="max-w-[1280px] mx-auto px-8 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-[660px]">
            <div className="inline-flex items-center gap-[10px] text-gold text-[12.5px] font-semibold uppercase tracking-[0.16em] mb-[26px]">
              <span className="w-[22px] h-[1px] bg-gold" /> Destinations
            </div>
            <h1 className="font-sora text-[clamp(36px,5vw,58px)] font-bold text-white leading-[1.12] tracking-[-0.02em] mb-[24px]">Explore Morocco&apos;s Finest Destinations</h1>
            <p className="text-[17px] leading-[1.65] text-white/82 max-w-[540px] mb-[40px]">From the Atlas Mountains to the Atlantic coast, discover every corner of Morocco in comfort and style with AR7 Victoria Car.</p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/fleet" className="inline-flex items-center justify-center gap-2 px-[30px] py-[16px] rounded-full font-sora font-semibold text-[15px] bg-gold text-navy transition-all hover:-translate-y-0.5">Choose Your Vehicle</Link>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-[30px] py-[16px] rounded-full font-sora font-semibold text-[15px] bg-transparent text-white border border-white/35 transition-all hover:bg-white/8 hover:-translate-y-0.5">Plan Your Trip</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORY FILTER */}
      <div className="max-w-[1440px] mx-auto px-10 relative z-20 -mt-[70px] mb-16">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div key={cat.label} initial="hidden" animate="visible" variants={fadeUp} custom={i} className="bg-white rounded-[16px] shadow-[0_24px_50px_-22px_rgba(22,33,62,0.25)] p-6 text-center cursor-pointer transition-all hover:-translate-y-1 border-[1.5px] border-transparent hover:border-gold">
              <div className="text-[26px] mb-2.5">{cat.emoji}</div>
              <b className="text-[12.5px] text-navy">{cat.label}</b>
            </motion.div>
          ))}
        </div>
      </div>

      {/* DESTINATIONS GRID */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto px-10">
          <div className="text-center mb-[52px] max-w-[640px] mx-auto">
            <div className="w-[1px] h-[36px] bg-gradient-to-b from-gold to-transparent mx-auto mb-[22px]" />
            <div className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-gold mb-[18px] justify-center">
              <span className="w-[22px] h-[1px] bg-gold" /> Popular Destinations
            </div>
            <h2 className="font-sora text-[clamp(26px,3.2vw,38px)] font-bold leading-[1.2] text-navy">Where will you drive next?</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[22px]">
            {destinations.map((d, i) => (
              <motion.div key={d.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className={`bg-white rounded-[18px] overflow-hidden border border-[rgba(29,29,31,0.09)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_45px_-20px_rgba(22,33,62,0.18)] ${d.featured ? "sm:col-span-2 lg:col-span-1" : ""}`}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={d.img} alt={d.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.025]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5">
                    <h3 className="font-sora text-[22px] font-bold text-white mb-1">{d.name}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-[14px] text-[#5b6472] mb-4">{d.desc}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {d.tags.map((t) => (
                        <span key={t} className="text-[11px] font-semibold text-navy bg-[#EEF2F6] px-3 py-1.5 rounded-full">{t}</span>
                      ))}
                    </div>
                    <Link href="/fleet" className="text-[13px] font-semibold text-gold hover:underline flex items-center gap-1">
                      Explore <span className="text-[11px]">→</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-[110px] bg-navy text-center relative overflow-hidden">
        <div className="absolute top-[-50%] left-1/2 w-[900px] h-[900px] -translate-x-1/2 bg-[radial-gradient(circle,rgba(194,161,91,0.14)_0%,transparent_70%)]" />
        <div className="max-w-[620px] mx-auto relative z-10 px-8">
          <h2 className="font-sora text-[clamp(30px,4vw,44px)] font-bold text-white leading-[1.15] mb-[18px]">Your Moroccan Adventure Starts Here</h2>
          <p className="text-white/68 text-[16.5px] mb-10">Choose your destination, pick your vehicle, and explore Morocco in style.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/fleet" className="inline-flex items-center justify-center gap-2 px-[34px] py-[18px] rounded-full font-sora font-semibold text-[15px] bg-gold text-navy transition-all hover:-translate-y-0.5">Reserve Your Vehicle</Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-[34px] py-[18px] rounded-full font-sora font-semibold text-[15px] bg-transparent text-white border border-white/35 transition-all hover:bg-white/8 hover:-translate-y-0.5">Plan Your Route</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
