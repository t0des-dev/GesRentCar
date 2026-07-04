"use client";

import { cn } from "@/shared/utils";
import { CreditCard, Route, Check } from "lucide-react";
import { BookingStepProps } from "@/types/booking";

export default function OptionsStep({ booking, update }: BookingStepProps) {
  return (
    <div className="space-y-8">
      {/* Options de paiement / Flexibilité */}
      <div>
        <div className="mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CreditCard size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-ink-1">Options de paiement</h3>
            <p className="text-sm text-ink-2">Choisissez le niveau de flexibilité pour votre réservation.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => update("flexibility", "best_price")}
            className={cn("relative overflow-hidden flex flex-col p-5 rounded-2xl border-2 transition-all text-left group", booking.flexibility === "best_price" ? "border-emerald-500 bg-emerald-50/50 shadow-sm" : "border-border bg-surface-0 hover:border-emerald-200")}
          >
            {booking.flexibility === "best_price" && (
              <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500 rounded-bl-full flex items-start justify-end p-2 text-white">
                <Check size={14} strokeWidth={3} />
              </div>
            )}
            <div className="mb-4">
              <p className="font-bold text-ink-1 text-lg mb-1">Meilleur prix</p>
              <ul className="text-sm text-ink-2 space-y-2 mt-3">
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>Annulation gratuite dans les 24 heures</span>
                </li>
              </ul>
            </div>
            <div className="mt-auto pt-4 border-t border-border/80">
              <span className="inline-block px-3 py-1 bg-surface-2 text-slate-600 font-semibold text-xs rounded-full uppercase tracking-wider">Inclus</span>
            </div>
          </button>

          <button 
            onClick={() => update("flexibility", "flexible")}
            className={cn("relative overflow-hidden flex flex-col p-5 rounded-2xl border-2 transition-all text-left group", booking.flexibility === "flexible" ? "border-emerald-500 bg-emerald-50/50 shadow-sm" : "border-border bg-surface-0 hover:border-emerald-200")}
          >
            {booking.flexibility === "flexible" && (
              <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500 rounded-bl-full flex items-start justify-end p-2 text-white">
                <Check size={14} strokeWidth={3} />
              </div>
            )}
            <div className="mb-4">
              <p className="font-bold text-ink-1 text-lg mb-1">Restez flexible</p>
              <ul className="text-sm text-ink-2 space-y-2 mt-3">
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>Annulation gratuite à tout moment avant la prise en charge</span>
                </li>
              </ul>
            </div>
            <div className="mt-auto pt-4 border-t border-border/80">
              <p className={cn("text-lg font-bold", booking.flexibility === "flexible" ? "text-emerald-600" : "text-ink-1")}>
                + 60 <span className="text-xs uppercase tracking-wider text-ink-3">DH / jour</span>
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Kilométrage */}
      <div>
        <div className="mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <Route size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-ink-1">Kilométrage</h3>
            <p className="text-sm text-ink-2">Définissez la limite kilométrique selon vos besoins.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => update("mileage", "limited")}
            className={cn("relative overflow-hidden flex flex-col p-5 rounded-2xl border-2 transition-all text-left group", booking.mileage === "limited" ? "border-blue-500 bg-blue-50/50 shadow-sm" : "border-border bg-surface-0 hover:border-blue-200")}
          >
            {booking.mileage === "limited" && (
              <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500 rounded-bl-full flex items-start justify-end p-2 text-white">
                <Check size={14} strokeWidth={3} />
              </div>
            )}
            <div className="mb-4">
              <p className="font-bold text-ink-1 text-lg mb-1">680 km</p>
              <ul className="text-sm text-ink-2 space-y-2 mt-3">
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-blue-500 shrink-0 mt-0.5" />
                  <span>+ 2 DH / pour chaque kilomètre supplémentaire</span>
                </li>
              </ul>
            </div>
            <div className="mt-auto pt-4 border-t border-border/80">
              <span className="inline-block px-3 py-1 bg-surface-2 text-slate-600 font-semibold text-xs rounded-full uppercase tracking-wider">Inclus</span>
            </div>
          </button>

          <button 
            onClick={() => update("mileage", "unlimited")}
            className={cn("relative overflow-hidden flex flex-col p-5 rounded-2xl border-2 transition-all text-left group", booking.mileage === "unlimited" ? "border-blue-500 bg-blue-50/50 shadow-sm" : "border-border bg-surface-0 hover:border-blue-200")}
          >
            {booking.mileage === "unlimited" && (
              <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500 rounded-bl-full flex items-start justify-end p-2 text-white">
                <Check size={14} strokeWidth={3} />
              </div>
            )}
            <div className="mb-4">
              <p className="font-bold text-ink-1 text-lg mb-1">Kilomètres illimités</p>
              <ul className="text-sm text-ink-2 space-y-2 mt-3">
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-blue-500 shrink-0 mt-0.5" />
                  <span>Tous les kilomètres sont inclus</span>
                </li>
              </ul>
            </div>
            <div className="mt-auto pt-4 border-t border-border/80">
              <p className={cn("text-lg font-bold", booking.mileage === "unlimited" ? "text-blue-600" : "text-ink-1")}>
                + 140 <span className="text-xs uppercase tracking-wider text-ink-3">DH / jour</span>
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
