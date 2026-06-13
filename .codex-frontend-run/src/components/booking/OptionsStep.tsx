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
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center">
          <Shield className="text-amber-500" size={18} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Services Exclusifs</h3>
          <p className="text-sm text-slate-500">Sublimez votre séjour avec notre conciergerie privée.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {MOCK_OPTIONS.map((opt) => {
          const isSelected = booking.options.includes(opt.id);
          const Icon = opt.icon;
          return (
            <button key={opt.id} onClick={() => {
              update("options", isSelected ? booking.options.filter(o => o !== opt.id) : [...booking.options, opt.id]);
            }} className={cn("relative overflow-hidden flex flex-col p-5 rounded-2xl border-2 transition-all text-left group", isSelected ? "border-amber-500 bg-amber-500/5 shadow-sm" : "border-slate-100 bg-white hover:border-amber-200")}>
              
              {isSelected && (
                <div className="absolute top-0 right-0 w-12 h-12 bg-amber-500 rounded-bl-full flex items-start justify-end p-2 text-white">
                  <Check size={14} strokeWidth={3} />
                </div>
              )}

              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-200", isSelected ? "bg-amber-500 text-white" : "bg-slate-50 text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600")}>
                <Icon size={24} />
              </div>
              
              <div className="mb-auto">
                <p className="font-semibold text-slate-900 mb-1">{opt.label}</p>
                <p className="text-sm text-slate-500 leading-relaxed pr-4">{opt.desc}</p>
              </div>
              
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between">
                <p className={cn("text-lg font-bold", isSelected ? "text-amber-600" : "text-slate-900")}>
                  +{opt.price.toLocaleString()} <span className="text-xs uppercase tracking-wider text-slate-400">{opt.type === "per_day" ? "DH/jour" : "DH (forfait)"}</span>
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
