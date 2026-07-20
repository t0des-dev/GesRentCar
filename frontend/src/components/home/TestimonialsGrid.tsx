"use client";

import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    text: "Effortless booking and the car was waiting exactly on time at the airport. Genuinely felt like a premium experience from start to finish.",
    name: "Youssef B.",
    detail: "Casablanca, Morocco · BMW 5 Series",
    avatar: "https://ui-avatars.com/api/?name=Youssef+B&background=4f46e5&color=ffffff&bold=true&size=128",
  },
  {
    text: "We rented an SUV for a family trip to Marrakech. Spotless car, transparent price, and the support team answered instantly on WhatsApp.",
    name: "Sophie L.",
    detail: "Marrakech · Tucson SUV",
    avatar: "https://ui-avatars.com/api/?name=Sophie+L&background=059669&color=ffffff&bold=true&size=128",
  },
  {
    text: "Our company now books all business travel vehicles through Vectoria. Reliable fleet, clean invoicing, zero surprises.",
    name: "Nadia K.",
    detail: "Rabat · Corporate Account",
    avatar: "https://ui-avatars.com/api/?name=Nadia+K&background=d97706&color=ffffff&bold=true&size=128",
  },
];

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
      <path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9c-.3 1.4-1 2.5-2.2 3.3v2.7h3.6c2.1-1.9 3.2-4.7 3.2-8z" />
      <path fill="#34A853" d="M12 23c3 0 5.4-1 7.2-2.7l-3.6-2.7c-1 .7-2.2 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.3v2.8C4.1 20.6 7.8 23 12 23z" />
      <path fill="#FBBC05" d="M6 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V6.9H2.3C1.5 8.5 1 10.2 1 12s.5 3.5 1.3 5.1L6 14.3z" />
      <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2C17.4 2.1 15 1 12 1 7.8 1 4.1 3.4 2.3 6.9L6 9.7c.9-2.5 3.2-4.3 6-4.3z" />
    </svg>
  );
}

export default function TestimonialsGrid() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-[var(--container)] mx-auto px-8">
        {/* Section Head — centered */}
        <div className="section-head section-head-center">
          <div className="section-mark section-mark-center" />
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="eyebrow-theme"
            style={{ justifyContent: "center" }}
          >
            Testimonials
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
          >
            Trusted by thousands of travelers.
          </motion.h2>
          {/* Overall rating */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16 }}
            className="flex items-center justify-center gap-2.5 mt-3.5 text-[14.5px] text-[#5b6472] font-medium"
          >
            <span className="text-[var(--gold)] text-[15px] tracking-[2px]">★★★★★</span>
            <b className="text-[var(--navy)] font-[var(--font-sora)]">4.9/5</b>
            <span>based on 2,400+ verified customers</span>
          </motion.div>
        </div>

        {/* Testimonials Grid — 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="bg-white rounded-[18px] p-9 border border-[var(--line)]"
            >
              {/* Top: stars + Google badge */}
              <div className="flex items-center justify-between mb-5">
                <span className="text-[var(--gold)] text-[14px] tracking-[2px]">★★★★★</span>
                <span className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#8a8f98]">
                  <GoogleLogo />
                  Google Review
                </span>
              </div>

              {/* Text */}
              <p className="text-[15px] text-[#3d4249] mb-7 leading-[1.7]">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Person */}
              <div className="flex items-center gap-3.5">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-[var(--gold)]/[0.14]"
                />
                <div>
                  <b className="block text-[14.5px] text-[var(--navy)]">{t.name}</b>
                  <span className="text-[12.5px] text-[#8a8f98]">{t.detail}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
