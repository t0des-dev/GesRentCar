"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { LifestyleImage } from "@/types/storefront";

export const DEFAULT_GALLERY_IMAGES: LifestyleImage[] = [
  {
    url: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=800",
    speed: 0.1,
    className: "col-span-6 h-[450px] mt-20"
  },
  {
    url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800",
    speed: 0.2,
    className: "col-span-6 h-[550px]"
  },
  {
    url: "https://images.unsplash.com/photo-1535704882196-765e5fc62a53?auto=format&fit=crop&q=80&w=800",
    speed: 0.15,
    className: "col-span-4 h-[400px] -mt-10"
  },
  {
    url: "https://images.unsplash.com/photo-1525609002752-ad9d9b9b4125?auto=format&fit=crop&q=80&w=800",
    speed: 0.25,
    className: "col-span-8 h-[500px]"
  }
];

export const DEFAULT_GALLERY_STATS = [
  { value: "98%", label: "Recommandation" },
  { value: "24h", label: "Service VIP" }
];

function ParallaxImage({ url, speed, className }: { url: string; speed: number; className: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200 * speed * 5]);

  return (
    <div ref={ref} className={`relative overflow-hidden rounded-3xl ${className}`}>
      <motion.img
        style={{ y }}
        src={url}
        alt="Lifestyle"
        className="absolute inset-0 w-full h-[150%] object-cover scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
    </div>
  );
}

export default function LifestyleGallery({ content = {} }: { content?: { subtitle?: string; title?: string; text?: string; images?: LifestyleImage[]; stats?: { value: string; label: string }[] } }) {
  const imagesToRender = (content?.images && content.images.length > 0) ? content.images : DEFAULT_GALLERY_IMAGES;
  const statsToRender = (content?.stats && content.stats.length > 0) ? content.stats : DEFAULT_GALLERY_STATS;

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-primary font-semibold text-xs uppercase tracking-wider mb-4">
              {content?.subtitle || "L'Expérience"}
            </p>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-6">
              {content?.title || <>Bien plus qu'un <br /><span className="text-primary italic">simple trajet</span>.</>}
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed">
              {content?.text || "Nous redéfinissons la mobilité de luxe en intégrant chaque voyage dans un style de vie d'exception. De la précision mécanique au confort absolu, chaque détail est une invitation à l'évasion."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="p-10 bg-slate-50 rounded-3xl border border-slate-100 relative z-10">
              <div className="grid grid-cols-2 gap-6">
                {statsToRender.map((stat, i) => (
                  <div key={i}>
                    <h4 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h4>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {imagesToRender.map((img: LifestyleImage, i: number) => (
            <ParallaxImage key={i} url={img.url} speed={img.speed} className={img.className} />
          ))}
        </div>
      </div>
    </section>
  );
}
