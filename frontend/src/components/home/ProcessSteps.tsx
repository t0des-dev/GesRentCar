"use client";

import { motion } from "framer-motion";

const STEPS = [
  { num: "01", title: "Choose Vehicle", desc: "Filter by category and compare specs instantly." },
  { num: "02", title: "Book Online", desc: "Reserve in under two minutes, no hidden fees." },
  { num: "03", title: "Pickup", desc: "Collect at the airport or one of our city locations." },
  { num: "04", title: "Drive", desc: "Unlimited mileage, 24/7 roadside assistance." },
  { num: "05", title: "Return", desc: "Drop off and go — we handle the rest." },
];

interface ProcessStepsProps {
  content?: {
    badge?: string;
    title?: string;
    steps?: { num: string; title: string; desc: string }[];
  };
}

export default function ProcessSteps({ content }: ProcessStepsProps) {
  const stepsList = content?.steps?.length ? content.steps : STEPS;

  return (
    <section className="py-24 lg:py-32 bg-[var(--light-gray)]">
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
            {content?.badge || "How It Works"}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
          >
            {content?.title || "Five steps from booking to the open road."}
          </motion.h2>
        </div>

        {/* Process Track — dynamic columns with connecting line */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-[27px] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[rgba(194,161,91,0.4)] to-transparent" />

          {stepsList.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="text-center relative"
            >
              <div className="w-[54px] h-[54px] rounded-full bg-white border border-[var(--gold)]/[0.14] flex items-center justify-center mx-auto mb-5 relative z-10 font-[var(--font-sora)] font-bold text-[var(--gold)] text-[16px]">
                {step.num}
              </div>
              <h4 className="text-[15.5px] font-bold text-[var(--navy)] mb-2">{step.title}</h4>
              <p className="text-[13px] text-[#6b7280] leading-[1.6]">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
