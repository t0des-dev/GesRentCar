"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useVehicles } from "@/shared/hooks/useApi";
import { getImageUrl } from "@/shared/utils/image";

const FALLBACK_LUXURY = [
  { id: 1, brand: "BMW", model: "7 Series", image_url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800" },
  { id: 2, brand: "MERCEDES", model: "S-Class", image_url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800" },
  { id: 3, brand: "RANGE ROVER", model: "Vogue", image_url: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=800" },
  { id: 4, brand: "AUDI", model: "A8", image_url: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=800" },
];

interface LuxuryCollectionProps {
  content?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
  };
}

export default function LuxuryCollection({ content }: LuxuryCollectionProps) {
  const { data } = useVehicles({ per_page: 24 });
  const allVehicles = data?.data ?? [];
  const apiLuxury = allVehicles.filter((v: any) =>
    (v.category || v.type || "").toLowerCase().includes("lux")
  );

  const displayVehicles = apiLuxury.length >= 4 ? apiLuxury.slice(0, 4) : FALLBACK_LUXURY;

  return (
    <section className="py-24 lg:py-32 bg-[#121927] text-white relative overflow-hidden">
      {/* Top Vertical Accent Line */}
      <div className="w-px h-10 bg-[#c39a4d]/40 mx-auto mb-6" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Centered Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#c39a4d] mb-3 block"
          >
            {content?.eyebrow || "— LUXURY COLLECTION —"}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-3xl md:text-4xl lg:text-[42px] font-extrabold text-white leading-tight mb-4 tracking-tight font-[var(--font-sora)]"
          >
            {content?.title || "For the moments that call for more."}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16 }}
            className="text-slate-400 text-xs md:text-sm max-w-lg mx-auto font-medium"
          >
            {content?.subtitle || "Flagship sedans and SUVs, reserved for clients who expect the best."}
          </motion.p>
        </div>

        {/* 4 Luxury Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayVehicles.map((v: any, idx: number) => {
            const img = getImageUrl(v.image_url) || v.image_url || FALLBACK_LUXURY[idx % 4].image_url;
            return (
              <motion.div
                key={v.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
              >
                <Link
                  href={`/fleet/${v.id || 1}`}
                  className="group relative block bg-[#0b1019] rounded-[20px] overflow-hidden aspect-[4/5] border border-slate-800/80 shadow-2xl hover:border-[#c39a4d]/50 transition-all duration-500 cursor-pointer"
                >
                  {/* Car Image */}
                  <img
                    src={img}
                    alt={`${v.brand} ${v.model}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                  />

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1019] via-[#0b1019]/40 to-transparent" />

                  {/* Card Bottom Label & Brand */}
                  <div className="absolute bottom-5 left-5 right-5 z-10">
                    <span className="block text-[10px] font-extrabold tracking-widest uppercase text-slate-400 mb-1">
                      {v.brand}
                    </span>
                    <span className="font-[var(--font-sora)] text-lg font-bold text-white group-hover:text-[#c39a4d] transition-colors flex items-center justify-between">
                      <span>{v.model}</span>
                      <ChevronRight
                        size={16}
                        className="text-slate-400 group-hover:text-[#c39a4d] transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

