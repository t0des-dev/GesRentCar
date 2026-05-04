"use client";

import { BookingState } from "@/types/booking";
import { useCurrency } from "@/hooks/useCurrency";
import { ShieldCheck, Info } from "lucide-react";

interface BookingSummaryProps {
  booking: BookingState;
  days: number;
  total: number;
  deposit: number;
  vehicle: any;
}

export default function BookingSummary({ booking, days, total, deposit, vehicle }: BookingSummaryProps) {
  const { convert } = useCurrency();

  return (
    <aside className="w-full lg:w-1/3 sticky top-32">
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden">
        {/* Header Preview */}
        <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">Récapitulatif</p>
          <h3 className="text-2xl font-black tracking-tight">Votre Sélection</h3>
        </div>

        <div className="p-8 space-y-8">
          {vehicle ? (
            <div className="flex items-center gap-6">
              <div className="w-24 h-20 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shrink-0">
                <img src={vehicle.img} alt={vehicle.model} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 leading-tight">{vehicle.brand}</h4>
                <p className="text-slate-400 font-bold text-xs uppercase">{vehicle.model}</p>
                <p className="text-primary font-black text-sm mt-1">{vehicle.price} DH <span className="text-[10px] opacity-60">/ jour</span></p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 text-slate-400 py-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-dashed border-slate-200">
                <Info size={20} />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest">Aucun véhicule choisi</p>
            </div>
          )}

          <div className="space-y-4 border-t border-slate-50 pt-8">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400 font-bold">Durée</span>
              <span className="font-black text-slate-900">{days} jour(s)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400 font-bold">Lieu</span>
              <span className="font-black text-slate-900">{booking.location || "—"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400 font-bold">Options VIP</span>
              <span className="font-black text-slate-900">{booking.options.length} sélectionnée(s)</span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-[32px] p-8 space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Total Net</span>
              <span className="text-2xl font-black text-slate-900">{total.toLocaleString()} DH</span>
            </div>
            <div className="h-px bg-slate-200" />
            <div className="flex justify-between items-center">
              <div>
                <span className="text-emerald-600 font-black text-xs uppercase tracking-widest block">Acompte (10%)</span>
                <span className="text-[9px] text-slate-400 font-bold">Garantie immédiate</span>
              </div>
              <span className="text-xl font-black text-emerald-600">{deposit.toLocaleString()} DH</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <ShieldCheck size={16} className="text-emerald-500" />
            <p className="text-[9px] font-bold uppercase tracking-[0.1em]">Paiement 100% sécurisé via SSL</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
