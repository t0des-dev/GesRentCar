"use client";

import { cn } from "@/lib/utils";
import { Shield, User, Plane, FileText, Check, Info } from "lucide-react";
import { BookingStepProps } from "@/types/booking";

const MOCK_OPTIONS = [
  { id: "chauffeur", label: "Chauffeur Privé", price: 1500, type: "per_day", icon: User, desc: "Un chauffeur bilingue et discret à votre entière disposition 24/7." },
  { id: "airport_vip", label: "Accueil Aéroport VIP", price: 500, type: "fixed", icon: Plane, desc: "Service Meet & Greet au terminal avec coupe-file prioritaire." },
  { id: "champagne", label: "Service Champagne", price: 1200, type: "fixed", icon: FileText, desc: "Bouteille Moët & Chandon servie bien fraîche à la remise des clés." },
  { id: "vip_insure", label: "Assurance Platinium", price: 300, type: "per_day", icon: Shield, desc: "Couverture totale sans franchise, assistance 0km incluse." },
];

export default function OptionsStep({ booking, update }: BookingStepProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
          <Shield className="text-amber-500" size={20} />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900">Services Exclusifs</h3>
          <p className="text-sm text-slate-500 font-medium">Sublimez votre séjour avec notre conciergerie privée.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_OPTIONS.map((opt) => {
          const isSelected = booking.options.includes(opt.id);
          const Icon = opt.icon;
          return (
            <button key={opt.id} onClick={() => {
              update("options", isSelected ? booking.options.filter(o => o !== opt.id) : [...booking.options, opt.id]);
            }} className={cn("relative overflow-hidden flex flex-col p-6 rounded-[28px] border-2 transition-all text-left group", isSelected ? "border-amber-500 bg-amber-500/5 shadow-xl shadow-amber-500/10" : "border-slate-100 bg-white hover:border-amber-200 hover:shadow-lg")}>
              
              {isSelected && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500 rounded-bl-[100px] flex items-start justify-end p-3 text-white">
                  <Check size={16} strokeWidth={4} />
                </div>
              )}

              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300", isSelected ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30" : "bg-slate-50 text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600")}>
                <Icon size={28} />
              </div>
              
              <div className="mb-auto">
                <p className="text-lg font-black text-slate-900 mb-1">{opt.label}</p>
                <p className="text-sm font-medium text-slate-500 leading-relaxed pr-6">{opt.desc}</p>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-end justify-between">
                <p className={cn("text-xl font-black", isSelected ? "text-amber-600" : "text-slate-900")}>
                  +{opt.price.toLocaleString()} <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{opt.type === "per_day" ? "DH/jour" : "DH (forfait)"}</span>
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
