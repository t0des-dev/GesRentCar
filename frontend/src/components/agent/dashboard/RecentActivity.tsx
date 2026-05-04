"use client";

import { Calendar, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecentActivityProps {
  reservations: any[];
  loading: boolean;
}

export default function RecentActivity({ reservations, loading }: RecentActivityProps) {
  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] flex items-center gap-3">
          <Calendar size={14} className="text-primary" />
          Réservations Récentes
        </h3>
        <button className="text-[9px] font-black text-primary uppercase tracking-widest hover:border-b border-primary pb-1 transition-all">
          Tout voir
        </button>
      </div>
      
      <div className="bg-slate-50/50 rounded-[48px] border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-300 animate-pulse uppercase text-[10px] font-black tracking-widest">
            Chargement des données...
          </div>
        ) : reservations.length === 0 ? (
          <div className="p-20 text-center space-y-4">
            <Search size={48} className="text-slate-100 mx-auto" />
            <p className="text-slate-300 italic text-sm">Aucune activité enregistrée.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {reservations.slice(0, 5).map((r) => (
              <div key={r.id} className="p-6 flex items-center justify-between hover:bg-white transition-colors group">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center font-black text-xs text-slate-400 shadow-sm">
                    #{r.id?.toString().padStart(4, "0")}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-sm group-hover:text-primary transition-colors">
                      {r.vehicle ? `${r.vehicle.brand} ${r.vehicle.model}` : "Véhicule Premium"}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {r.start_date?.split('T')[0]} → {r.end_date?.split('T')[0]}
                    </p>
                  </div>
                </div>
                <div className={cn(
                  "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                  r.status === 'confirmed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                  r.status === 'pending' ? "bg-amber-50 text-amber-600 border-amber-100" :
                  r.status === 'pending_payment' || r.status === 'attente_paiement' ? "bg-blue-50 text-blue-600 border-blue-100" :
                  r.status === 'pending_partner' ? "bg-pink-50 text-pink-600 border-pink-100" :
                  "bg-slate-50 text-slate-400 border-slate-100"
                )}>
                  {r.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
