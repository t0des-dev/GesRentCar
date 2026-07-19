"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function FinalCta() {
  return (
    <section className="py-24 lg:py-32 bg-[var(--navy)] text-center relative overflow-hidden">
      {/* Radial gold glow */}
      <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-[radial-gradient(circle,rgba(194,161,91,0.14)_0%,transparent_70%)]" />

      <div className="max-w-[var(--container)] mx-auto px-8 relative z-10">
        <div className="max-w-[620px] mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="!text-white text-[clamp(32px,4.4vw,50px)] leading-[1.15] mb-5"
          >
            Ready to hit the road?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-white/68 text-[17.5px] mb-11"
          >
            Reserve your vehicle today and experience premium car rental the way it should be.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16 }}
            className="flex gap-4.5 justify-center flex-wrap"
          >
            <Link
              href="/fleet"
              className="btn-theme btn-theme-gold py-[19px] px-[38px] text-[15.5px]"
            >
              Reserve your vehicle
            </Link>
            <a
              href="tel:+212500000000"
              className="btn-theme btn-theme-outline py-[19px] px-[38px] text-[15.5px]"
            >
              Call +212 5 00 00 00 00
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
