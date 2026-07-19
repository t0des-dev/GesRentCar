"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useVehicles } from "@/shared/hooks/useApi";
import { getImageUrl } from "@/shared/utils/image";
import ThemeSection from "./ThemeSection";

export default function LuxuryCollection() {
  const { data } = useVehicles({ per_page: 24 });
  const allVehicles = data?.data ?? [];
  const luxuryVehicles = allVehicles
    .filter((v: any) => (v.category || v.type || "").toLowerCase().includes("lux"))
    .slice(0, 4);

  if (luxuryVehicles.length === 0) return null;

  return (
    <section className="py-24 lg:py-32 bg-[var(--navy)] text-white relative overflow-hidden">
      {/* Top gold line */}
      <div className="absolute top-0 left-1/2 w-px h-[120px] bg-gradient-to-b from-[var(--gold)] to-transparent" />

      <div className="max-w-[var(--container)] mx-auto px-8 relative z-10">
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
            Luxury Collection
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="!text-white"
          >
            For the moments that call for more.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16 }}
            className="!text-white/65"
          >
            Flagship sedans and SUVs, reserved for clients who expect the best.
          </motion.p>
        </div>

        {/* Luxury Grid — 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {luxuryVehicles.map((v: any, idx: number) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
            >
              <Link
                href={`/fleet/${v.id}`}
                className="group relative block rounded-[18px] overflow-hidden aspect-[3/4] cursor-pointer outline-offset-4 focus-visible:outline-2 focus-visible:outline-[var(--gold)]"
              >
                {/* Image */}
                {v.image_url ? (
                  <img
                    src={getImageUrl(v.image_url) || ""}
                    alt={`${v.brand} ${v.model}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[var(--navy)] to-[var(--navy)]/80 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white/20">{v.brand?.[0]}</span>
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/94 via-transparent to-transparent" />

                {/* Label */}
                <div className="absolute bottom-[26px] left-[26px] z-10">
                  <span className="block text-[10.5px] tracking-[0.16em] uppercase text-white/60 mb-[5px]">
                    {v.brand}
                  </span>
                  <span className="font-[var(--font-sora)] text-[21px] font-bold text-white flex items-center gap-2">
                    {v.model}
                    <ArrowRight
                      size={17}
                      className="text-[var(--gold)] transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
