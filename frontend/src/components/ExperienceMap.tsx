"use client";

import { Sparkles, MapPin, Users, Car } from "lucide-react";
import { cn } from "@/lib/utils";

const EXPERIENCES = [
  { city: "Casablanca", car: "Porsche 911", user: "Hamza B.", lat: "33.5731", lng: "-7.5898", top: "60%", left: "40%" },
  { city: "Marrakech", car: "Range Rover", user: "Sara K.", lat: "31.6295", lng: "-7.9811", top: "72%", left: "38%" },
  { city: "Tanger", car: "Mercedes Classe S", user: "Jean M.", lat: "35.7595", lng: "-5.8340", top: "40%", left: "48%" },
  { city: "Agadir", car: "Bentley Bentayga", user: "Youssef T.", lat: "30.4278", lng: "-9.5981", top: "85%", left: "30%" },
];

export default function ExperienceMap() {
  return (
    <section className="py-24 relative overflow-hidden bg-white">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Column: Text & Proof */}
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-3 bg-slate-900 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles size={14} className="text-primary" />
              Preuve Sociale en Direct
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              L'Expérience <span className="text-primary">Vectoria</span><br />
              Partout au Maroc.
            </h2>

            <p className="text-lg text-slate-500 leading-relaxed max-w-xl">
              Rejoignez le cercle restreint de nos clients qui redéfinissent le voyage premium. 
              Visualisez en temps réel les locations actives sur notre réseau.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-3 text-slate-400 mb-2">
                  <Users size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Actifs</span>
                </div>
                <p className="text-3xl font-black text-slate-900">42</p>
                <p className="text-xs text-slate-400 font-bold">Clients en route</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-3 text-slate-400 mb-2">
                  <Car size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Disponibles</span>
                </div>
                <p className="text-3xl font-black text-slate-900">18</p>
                <p className="text-xs text-slate-400 font-bold">Modèles d'exception</p>
              </div>
            </div>
          </div>

          {/* Right Column: The Interactive Map */}
          <div className="flex-1 w-full relative">
            <div className="relative bg-slate-900 rounded-[48px] p-8 shadow-2xl shadow-slate-900/40 overflow-hidden aspect-[4/5] md:aspect-square flex items-center justify-center border border-white/10">
              {/* Map SVG (Stylized Morocco) */}
              <svg viewBox="0 0 500 500" className="w-full h-full opacity-20 fill-white">
                <path d="M150,50 L350,50 L400,150 L380,250 L420,350 L350,450 L150,450 L100,350 L120,250 L80,150 Z" />
                {/* Add some dots for the map look */}
                <circle cx="200" cy="150" r="2" />
                <circle cx="250" cy="200" r="2" />
                <circle cx="180" cy="280" r="2" />
                <circle cx="220" cy="350" r="2" />
              </svg>

              {/* Pulsing Dots for Experiences */}
              {EXPERIENCES.map((exp, i) => (
                <div 
                  key={i} 
                  className="absolute animate-in fade-in zoom-in duration-1000 group"
                  style={{ top: exp.top, left: exp.left }}
                >
                  <div className="relative">
                    <div className="w-4 h-4 bg-primary rounded-full animate-ping absolute inset-0" />
                    <div className="w-4 h-4 bg-primary rounded-full relative z-10 border-2 border-white shadow-lg" />
                    
                    {/* Tooltip Card */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 bg-white rounded-2xl p-4 shadow-2xl opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 pointer-events-none z-20 border border-slate-100">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin size={12} className="text-primary" />
                        <span className="text-[9px] font-black uppercase text-slate-400">{exp.city}</span>
                      </div>
                      <p className="text-xs font-black text-slate-900 mb-1">{exp.car}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-slate-400">Client: {exp.user}</span>
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Legend overlay */}
              <div className="absolute top-8 left-8 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl">
                <span className="text-[9px] font-black text-white uppercase tracking-widest">Expériences Actives</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
