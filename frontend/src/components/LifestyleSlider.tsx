"use client";

import { useState, useEffect } from "react";
import { Play, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/shared/utils";
import { getImageUrl } from "@/shared/utils/image";
import type { Testimonial } from "@/types/storefront";

const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    user: "Elena G.",
    role: "CEO Tech",
    text: "Une expérience impeccable du début à la fin. La livraison à l'hôtel était ponctuelle et la voiture dans un état concours.",
    image: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=2400&auto=format&fit=crop",
  },
  {
    id: 2,
    user: "Marc A.",
    role: "Entrepreneur",
    text: "Louer chez Vectoria n'est pas une simple transaction, c'est accéder à un service de conciergerie automobile exceptionnel.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2400&auto=format&fit=crop",
  }
];

export function mapTestimonial(t: Testimonial, i: number) {
  return {
    id: i,
    user: t.name || "Client",
    role: t.role || "Client",
    text: t.content,
    image: t.image || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2400&auto=format&fit=crop"
  };
}

export default function LifestyleSlider({ content = {} }: { 
  content?: { 
    badge?: string; 
    heading?: string; 
    description?: string; 
    items?: Testimonial[] | { id: number; user: string; role: string; text: string; image: string }[] 
  } 
}) {
  const [current, setCurrent] = useState(0);

  const testimonials = (content?.items && content.items.length > 0)
    ? content.items.map((item: any, i: number) => 
        item.content ? mapTestimonial(item as Testimonial, i) : item
      )
    : DEFAULT_TESTIMONIALS;

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  const activeMoment = testimonials[current];

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="w-full md:w-1/3">
              <div className="inline-flex items-center gap-2 bg-white border border-slate-100 px-5 py-1.5 rounded-full mb-6">
                <Play size={14} className="text-primary" />
                <span className="text-xs font-semibold text-slate-500">{content?.badge || "Avis Clients"}</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">
                {content?.heading || "Ce que disent nos clients"}
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                {content?.description || "Découvrez les expériences de ceux qui nous ont fait confiance."}
              </p>
            </div>

            <div className="w-full md:w-2/3 space-y-6" key={current}>
              <div className="bg-white rounded-3xl border border-slate-100/80 p-8 md:p-10 shadow-sm">
                <Quote size={32} className="text-primary/20 mb-4" />
                <p className="text-xl font-medium text-slate-900 leading-relaxed mb-8 italic">
                  &ldquo;{activeMoment.text}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <img src={getImageUrl(activeMoment.image) || activeMoment.image} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{activeMoment.user}</p>
                    <p className="text-xs text-primary font-medium">{activeMoment.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {testimonials.length > 1 && (
            <div className="flex items-center justify-between mt-10 max-w-2xl ml-auto">
              <div className="flex gap-2">
                {testimonials.map((_: any, i: number) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1.5 transition-all duration-500 rounded-full",
                      i === current ? "w-8 bg-primary" : "w-1.5 bg-slate-200"
                    )}
                  />
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrent(prev => (prev - 1 + testimonials.length) % testimonials.length)}
                  className="w-10 h-10 rounded-full border border-slate-200 text-slate-500 flex items-center justify-center hover:bg-white hover:border-slate-300 transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setCurrent(prev => (prev + 1) % testimonials.length)}
                  className="w-10 h-10 rounded-full border border-slate-200 text-slate-500 flex items-center justify-center hover:bg-white hover:border-slate-300 transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
