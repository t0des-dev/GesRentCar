"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, Mountain, Wind, ChevronRight } from "lucide-react";
import type { ElementType } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/utils/image";
import type { LifestyleItem } from "@/types/storefront";

const ICON_MAP: Record<string, ElementType> = {
  ShieldCheck, Wind, Mountain, Zap
};

const DEFAULT_VIBES: (LifestyleItem & { color: string })[] = [
  {
    id: "business",
    title: "Business Elite",
    subtitle: "Prestige & Stratégie",
    icon: "ShieldCheck",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=800",
    color_from: "primary",
    color_via: "primary",
    color: "from-primary/80 via-primary/60 to-transparent",
    lifestyle: "business"
  },
  {
    id: "romance",
    title: "Grand Tourisme",
    subtitle: "Émotion & Liberté",
    icon: "Wind",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800",
    color_from: "rose-500",
    color_via: "orange-500",
    color: "from-rose-500/80 via-orange-500/60 to-transparent",
    lifestyle: "romance"
  },
  {
    id: "aventure",
    title: "Wild Adventure",
    subtitle: "Puissance & Exploration",
    icon: "Mountain",
    image: "https://images.unsplash.com/photo-1535704882196-765e5fc62a53?auto=format&fit=crop&q=80&w=800",
    color_from: "emerald-600",
    color_via: "teal-600",
    color: "from-emerald-600/80 via-teal-600/60 to-transparent",
    lifestyle: "adventure"
  },
  {
    id: "family",
    title: "Family First",
    subtitle: "Confort & Partage",
    icon: "Zap",
    image: "https://images.unsplash.com/photo-1549113294-313d8bc63a4c?auto=format&fit=crop&q=80&w=800",
    color_from: "gold",
    color_via: "gold",
    color: "from-gold/80 via-gold/60 to-transparent",
    lifestyle: "family"
  }
];

interface VibeSelectorProps {
  content?: {
    eyebrow?: string;
    items?: LifestyleItem[];
    cta_text?: string;
  };
}

export default function VibeSelector({ content }: VibeSelectorProps) {
  const router = useRouter();

  const vibes = content?.items?.length
    ? content.items.map((item) => ({
        ...item,
        Icon: ICON_MAP[item.icon] || ShieldCheck,
        color: `from-[${item.color_from}]/80 via-[${item.color_via}]/60 to-transparent`
      }))
    : DEFAULT_VIBES.map((item) => ({
        ...item,
        Icon: ICON_MAP[item.icon] || ShieldCheck
      }));

  return (
    <section className="py-32 bg-surface-0 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-primary/5 pointer-events-none" />
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-24 max-w-3xl mx-auto space-y-6">
          
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="section-eyebrow mx-auto"
          >
            {content?.eyebrow || "Expérience Sur Mesure"}
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08, duration: 0.6 }}
            className="display-lg text-ink-1 leading-tight"
          >
            Quelle est votre <span className="text-gold">vibe</span> aujourd'hui ?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16, duration: 0.6 }}
            className="body-feature text-ink-2 leading-relaxed"
          >
            Choisissez l'émotion qui guidera votre prochain voyage. Nous nous occupons du reste.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {vibes.map((vibe, index) => (
            <motion.div
              key={vibe.id}
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              whileHover={{ y: -8 }}
              onClick={() => router.push(`/fleet?lifestyle=${vibe.lifestyle}`)}
              className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-gold/20 transition-all duration-500 border-2 border-transparent hover:border-gold/40"
            >
              <img
                src={getImageUrl(vibe.image)}
                alt={vibe.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-ink-1/80 via-ink-1/30 to-transparent group-hover:from-ink-1/90 group-hover:via-ink-1/40 transition-all duration-500" />
              
              <div className={cn(
                "absolute inset-0 bg-gradient-to-t opacity-50 group-hover:opacity-60 transition-opacity duration-500", 
                vibe.color
              )} />

              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                <motion.div 
                  className="mb-6 w-16 h-16 rounded-xl bg-white/15 backdrop-blur-xl border border-white/30 flex items-center justify-center transition-all duration-500 shadow-lg shadow-gold/20"
                  whileHover={{ scale: 1.15, rotate: 12 }}
                >
                  <vibe.Icon size={28} />
                </motion.div>
                
                <h3 className="text-2xl font-bold tracking-tight mb-2 leading-tight font-serif">
                  {vibe.title}
                </h3>
                
                <p className="text-white/85 font-medium text-sm mb-8">
                  {vibe.subtitle}
                </p>
                
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 translate-x-0 group-hover:translate-x-2 transition-all duration-500">
                  <span>{content?.cta_text || "Explorer"}</span>
                  <ChevronRight size={14} strokeWidth={3} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
