"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { getImageUrl } from "@/lib/utils/image";

const DEFAULT_IMAGES = [
  {
    url: "/images/lifestyle/business.png",
    speed: 0.1,
    className: "col-span-6 h-[450px] mt-20"
  },
  {
    url: "/images/lifestyle/romance.png",
    speed: 0.2,
    className: "col-span-6 h-[550px]"
  },
  {
    url: "/images/lifestyle/adventure.png",
    speed: 0.15,
    className: "col-span-4 h-[400px] -mt-10"
  },
  {
    url: "https://images.unsplash.com/photo-1525609002752-ad9d9b9b4125?auto=format&fit=crop&q=80&w=800",
    speed: 0.25,
    className: "col-span-8 h-[500px]"
  }
];

function ParallaxImage({ url, speed, className }: { url: string; speed: number; className: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200 * speed * 5]);

  return (
    <div ref={ref} className={`relative overflow-hidden rounded-[48px] shadow-2xl ${className}`}>
      <motion.img
        style={{ y }}
        src={getImageUrl(url)}
        alt="Lifestyle"
        className="absolute inset-0 w-full h-[150%] object-cover scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
    </div>
  );
}

export default function LifestyleGallery({ config }: { config?: { title?: string, subtitle?: string, text?: string, images?: any[] } }) {
  const imagesToRender = (config?.images && config.images.length > 0) ? config.images : DEFAULT_IMAGES;

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-primary font-black text-xs uppercase tracking-[0.4em] mb-6">
              {config?.subtitle || "L'Expérience"}
            </p>
            <h2 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-tight mb-8">
              {config?.title || <>Bien plus qu'un <br /><span className="text-primary italic">simple trajet</span>.</>}
            </h2>
            <p className="text-slate-500 text-lg font-medium max-w-xl leading-relaxed">
              {config?.text || "Nous redéfinissons la mobilité de luxe en intégrant chaque voyage dans un style de vie d'exception. De la précision mécanique au confort absolu, chaque détail est une invitation à l'évasion."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="p-12 bg-slate-50 rounded-[64px] border border-slate-100 relative z-10">
              <div className="grid grid-cols-2 gap-8">
                 <div>
                    <h4 className="text-4xl font-black text-slate-900 mb-2">98%</h4>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recommandation</p>
                 </div>
                 <div>
                    <h4 className="text-4xl font-black text-slate-900 mb-2">24h</h4>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Service VIP</p>
                 </div>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/10 blur-3xl rounded-full" />
          </motion.div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {imagesToRender.map((img: any, i: number) => (
            <ParallaxImage key={i} {...img} />
          ))}
        </div>
      </div>
    </section>
  );
}
