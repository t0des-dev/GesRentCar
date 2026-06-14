"use client";

import { motion, Variants } from "framer-motion";
import type { LifestyleImage } from "@/types/storefront";
import { ArrowRight } from "lucide-react";

export const DEFAULT_GALLERY_IMAGES: LifestyleImage[] = [
  { url: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=800", speed: 0.1, className: "" },
  { url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800", speed: 0.2, className: "" },
  { url: "https://images.unsplash.com/photo-1535704882196-765e5fc62a53?auto=format&fit=crop&q=80&w=800", speed: 0.15, className: "" },
  { url: "https://images.unsplash.com/photo-1525609002752-ad9d9b9b4125?auto=format&fit=crop&q=80&w=800", speed: 0.25, className: "" }
];

export const DEFAULT_GALLERY_STATS = [
  { value: "98%", label: "Recommandation" },
  { value: "24h", label: "Service VIP" }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 80, damping: 20 }
  },
};

export default function LifestyleGallery({ content = {} }: { content?: { subtitle?: string; title?: string; text?: string; images?: LifestyleImage[]; stats?: { value: string; label: string }[] } }) {
  const imagesToRender = (content?.images && content.images.length > 0) ? content.images : DEFAULT_GALLERY_IMAGES;
  const statsToRender = (content?.stats && content.stats.length > 0) ? content.stats : DEFAULT_GALLERY_STATS;

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Premium Decorative Backgrounds */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5 auto-rows-[minmax(220px,auto)] md:auto-rows-[280px]"
        >
          {/* 1. Main Text Block - Glassmorphism */}
          <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-2 bg-white/70 backdrop-blur-xl border border-white/50 rounded-[2.5rem] p-10 md:p-16 flex flex-col justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
            {/* Inner glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />
            
            <p className="text-primary font-bold text-[10px] uppercase tracking-[0.25em] mb-6 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-primary/40 rounded-full" />
              {content?.subtitle || "L'Expérience"}
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-8 leading-[1.05]">
              {content?.title || <>Bien plus qu'un <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-600 italic font-serif">simple trajet</span>.</>}
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed font-medium mb-10 max-w-md">
              {content?.text || "Nous redéfinissons la mobilité de luxe en intégrant chaque voyage dans un style de vie d'exception. De la précision mécanique au confort absolu."}
            </p>
            
            <div className="mt-auto flex items-center gap-4 text-sm font-bold text-slate-900 uppercase tracking-widest group-hover:text-primary transition-colors cursor-pointer w-max">
              Découvrir la flotte
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 group-hover:translate-x-2 transition-all duration-300">
                <ArrowRight size={16} />
              </div>
            </div>
          </motion.div>

          {/* 2. Image 1 */}
          {imagesToRender[0] && (
            <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-2 rounded-[2.5rem] overflow-hidden relative group shadow-sm bg-slate-200 min-h-[300px] md:min-h-0 border border-slate-200/50">
               <img src={imagesToRender[0].url} alt="Gallery image 1" className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-700" />
            </motion.div>
          )}

          {/* 3. Stat 1 - Dark Premium */}
          {statsToRender[0] && (
            <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center relative overflow-hidden group shadow-xl">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />
               <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
               <h4 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 mb-2 relative z-10">{statsToRender[0].value}</h4>
               <p className="text-[10px] font-bold text-gold uppercase tracking-[0.25em] relative z-10">{statsToRender[0].label}</p>
            </motion.div>
          )}

          {/* 4. Image 2 */}
          {imagesToRender[1] && (
            <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1 rounded-[2.5rem] overflow-hidden relative group shadow-sm bg-slate-200 min-h-[250px] md:min-h-0 border border-slate-200/50">
               <img src={imagesToRender[1].url} alt="Gallery image 2" className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-700" />
            </motion.div>
          )}

          {/* 5. Image 3 (Wide) */}
          {imagesToRender[2] && (
            <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-1 rounded-[2.5rem] overflow-hidden relative group shadow-sm bg-slate-200 min-h-[250px] md:min-h-0 border border-slate-200/50">
               <img src={imagesToRender[2].url} alt="Gallery image 3" className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-700" />
            </motion.div>
          )}

          {/* 6. Stat 2 - Primary Accent */}
          {statsToRender[1] && (
            <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1 bg-gradient-to-br from-primary to-indigo-600 rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center relative overflow-hidden group shadow-lg shadow-primary/20">
               <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
               <h4 className="text-4xl md:text-5xl font-black text-white mb-2 relative z-10">{statsToRender[1].value}</h4>
               <p className="text-[10px] font-bold text-white/80 uppercase tracking-[0.25em] relative z-10">{statsToRender[1].label}</p>
            </motion.div>
          )}

          {/* 7. Image 4 */}
          {imagesToRender[3] && (
            <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1 rounded-[2.5rem] overflow-hidden relative group shadow-sm bg-slate-200 min-h-[250px] md:min-h-0 border border-slate-200/50">
               <img src={imagesToRender[3].url} alt="Gallery image 4" className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-700" />
            </motion.div>
          )}

          {/* Render extra images dynamically if the user adds more in CMS */}
          {imagesToRender.slice(4).map((img, i) => (
            <motion.div variants={itemVariants} key={`img-${i}`} className="md:col-span-1 md:row-span-1 rounded-[2.5rem] overflow-hidden relative group shadow-sm bg-slate-200 min-h-[250px] md:min-h-0 border border-slate-200/50">
              <img src={img.url} alt={`Gallery extra ${i}`} className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-700" />
            </motion.div>
          ))}
          
          {/* Render extra stats dynamically if the user adds more in CMS */}
          {statsToRender.slice(2).map((stat, i) => (
            <motion.div variants={itemVariants} key={`stat-${i}`} className="md:col-span-1 md:row-span-1 bg-white/70 backdrop-blur-xl border border-white/50 rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h4 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-600 mb-2">{stat.value}</h4>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em]">{stat.label}</p>
            </motion.div>
          ))}

        </motion.div>
      </div>
    </section>
  );
}
