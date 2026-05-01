"use client";

import { useState, useEffect } from "react";
import { Play, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

const MOMENTS = [
  { 
    id: 1, 
    user: "Elena G.", 
    role: "CEO Tech", 
    text: "Une expérience impeccable du début à la fin. La livraison à l'hôtel était ponctuelle et la voiture dans un état concours.",
    image: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=2400&auto=format&fit=crop",
    video: "https://assets.mixkit.co/videos/preview/mixkit-luxury-car-driving-in-the-city-at-night-42407-large.mp4"
  },
  { 
    id: 2, 
    user: "Marc A.", 
    role: "Entrepreneur", 
    text: "Louer chez Vectoria n'est pas une simple transaction, c'est accéder à un service de conciergerie automobile exceptionnel.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2400&auto=format&fit=crop",
    video: "https://assets.mixkit.co/videos/preview/mixkit-white-luxury-car-parked-at-the-beach-at-sunset-42358-large.mp4"
  },
  { 
    id: 3, 
    user: "Yasmine K.", 
    role: "Influenceuse Luxe", 
    text: "Le choix des modèles est tout simplement unique au Maroc. La discrétion et le luxe à l'état pur.",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2400&auto=format&fit=crop",
    video: "https://assets.mixkit.co/videos/preview/mixkit-luxury-car-speeding-on-the-road-42410-large.mp4"
  }
];

export default function LifestyleSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % MOMENTS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="h-[700px] relative overflow-hidden bg-black">
      {/* Background Slides */}
      {MOMENTS.map((moment, i) => (
        <div 
          key={moment.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-20" />
          <img src={moment.image} className="w-full h-full object-cover scale-110 animate-slow-zoom" />
        </div>
      ))}

      {/* Content */}
      <div className="container mx-auto px-4 relative z-30 h-full flex flex-col justify-center">
        <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-left-12 duration-1000" key={current}>
          <div className="inline-flex items-center gap-3 bg-primary text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
            <Play size={14} fill="currentColor" />
            Vectoria Moments
          </div>

          <Quote size={60} className="text-primary/40" />
          
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight italic">
            "{MOMENTS[current].text}"
          </h2>

          <div className="flex items-center gap-6 pt-8">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-1">
              <img src={MOMENTS[current].image} className="w-full h-full object-cover rounded-xl" />
            </div>
            <div>
              <p className="text-xl font-black text-white">{MOMENTS[current].user}</p>
              <p className="text-sm font-bold text-primary uppercase tracking-widest">{MOMENTS[current].role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-12 right-12 z-40 flex items-center gap-6">
        <div className="flex gap-2">
          {MOMENTS.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1.5 transition-all duration-500 rounded-full bg-white",
                i === current ? "w-12 bg-primary" : "w-2 opacity-30"
              )}
            />
          ))}
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setCurrent(prev => (prev - 1 + MOMENTS.length) % MOMENTS.length)}
            className="w-14 h-14 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => setCurrent(prev => (prev + 1) % MOMENTS.length)}
            className="w-14 h-14 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
