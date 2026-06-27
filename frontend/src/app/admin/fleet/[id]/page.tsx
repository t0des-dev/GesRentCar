"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthGuard } from "@/modules/auth/hooks/useAuthGuard";
import api from "@/shared/services/client";
import { motion } from "framer-motion";
import { ArrowLeft, Car, Calendar as CalendarIcon, Wrench, ShieldAlert, Activity, DollarSign, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/shared/utils";
import { fmt } from "@/shared/utils/format";
import type { Vehicle } from "@/types/admin";
import type { Maintenance } from "@/types/admin";
import type { Reservation } from "@/types/admin";

export default function VehicleDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const { checking } = useAuthGuard("admin");
  const [vehicle, setVehicle] = useState<Vehicle & { reservations?: Reservation[]; maintenances?: Maintenance[]; commission_rate?: number; agent?: { name: string } } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      api.get(`/vehicles/${params.id}`)
        .then(res => setVehicle(res.data))
        .catch(err => {
          console.error(err);
          router.push('/admin/fleet');
        })
        .finally(() => setLoading(false));
    }
  }, [params.id, router]);

  if (checking || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-ink-3 font-black uppercase text-[10px] tracking-widest">Chargement du dashboard...</p>
      </div>
    );
  }

  if (!vehicle) return null;

  const totalRev = Number(vehicle.total_revenue || 0);
  const totalCost = Number(vehicle.total_maintenance_cost || 0);
  const roi = totalRev - totalCost;
  const isCollab = vehicle.type === 'collaborator';
  const collabCommission = isCollab ? totalRev * (Number(vehicle.commission_rate || 0) / 100) : 0;

  const events = [
    ...(vehicle.reservations || []).map(r => ({
      id: `res-${r.id}`,
      date: new Date(r.start_date),
      type: "reservation",
      title: `Réservation Réf: ${r.id}`,
      description: `${new Date(r.start_date).toLocaleDateString()} ➔ ${new Date(r.end_date).toLocaleDateString()}`,
      status: r.status,
      costOrRev: Number(r.total_price),
      isRevenue: true
    })),
    ...(vehicle.maintenances || []).map(m => ({
      id: `maint-${m.id}`,
      date: m.date ? new Date(m.date) : new Date(),
      type: "maintenance",
      title: `Entretien: ${m.type}`,
      description: m.description,
      status: "completed",
      costOrRev: Number(m.cost),
      isRevenue: false
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-12">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/fleet" className="w-10 h-10 rounded-full bg-surface-0 border-2 border-border flex items-center justify-center text-ink-2 hover:bg-surface-1 transition">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-3 mb-1">
            Dashboard Véhicule • <span className="text-primary">{vehicle.plate}</span>
          </p>
          <h1 className="text-3xl font-black text-ink-1">
            {vehicle.brand} <span className="italic text-primary">{vehicle.model}</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* COL 1: INFO & FINANCE */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          {/* VEHICLE CARD */}
          <div className="bg-surface-0 rounded-2xl border-2 border-border p-6 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <Car size={120} />
             </div>
             <div className="relative z-10">
               <span className={cn(
                 "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 inline-block",
                 vehicle.status === 'available' ? 'bg-emerald-100 text-emerald-700' :
                 vehicle.status === 'rented' ? 'bg-blue-100 text-blue-700' :
                 'bg-amber-100 text-amber-700'
               )}>
                 {vehicle.status}
               </span>
               <h2 className="text-2xl font-black text-ink-1 mb-6">{vehicle.plate}</h2>
               
               <div className="space-y-4">
                 <div className="flex justify-between items-center border-b border-border/50 pb-2">
                   <span className="text-xs font-bold text-ink-3 uppercase tracking-wider">Catégorie</span>
                   <span className="text-sm font-black text-ink-1">{vehicle.category}</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-border/50 pb-2">
                   <span className="text-xs font-bold text-ink-3 uppercase tracking-wider">Propriétaire</span>
                   <span className="text-sm font-black text-primary">{isCollab ? (vehicle.agent?.name || 'Collaborateur') : 'Interne (Vectoria)'}</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-border/50 pb-2">
                   <span className="text-xs font-bold text-ink-3 uppercase tracking-wider">Kilométrage</span>
                   <span className="text-sm font-black text-ink-1">{vehicle.mileage} KM</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-border/50 pb-2">
                   <span className="text-xs font-bold text-ink-3 uppercase tracking-wider">Carburant</span>
                   <span className="text-sm font-black text-ink-1">{vehicle.fuel_type}</span>
                 </div>
               </div>
             </div>
          </div>

          {/* FINANCE ROI CARD */}
          <div className="bg-surface-0 rounded-2xl border-2 border-border p-6 shadow-sm">
             <div className="flex items-center gap-2 mb-6">
               <Activity className="text-primary" size={20} />
               <h3 className="text-lg font-black text-ink-1">Rentabilité (ROI)</h3>
             </div>
             
             <div className="space-y-4">
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">Revenus Générés</span>
                  <span className="text-2xl font-black text-emerald-700">{fmt(totalRev)} DH</span>
                </div>
                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                  <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block mb-1">Coûts d'Entretien</span>
                  <span className="text-2xl font-black text-red-700">- {fmt(totalCost)} DH</span>
                </div>
                <div className="bg-surface-1 rounded-xl p-4 border border-border">
                  <span className="text-[10px] font-bold text-ink-3 uppercase tracking-wider block mb-1">Marge Nette Principale</span>
                  <span className={cn("text-3xl font-black", roi >= 0 ? "text-emerald-600" : "text-red-600")}>
                    {roi > 0 ? "+" : ""}{fmt(roi)} DH
                  </span>
                </div>

                {isCollab && (
                  <div className="bg-primary/10 rounded-xl p-4 border border-primary/20 mt-4">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">Commission Due ({vehicle.commission_rate}%)</span>
                    <span className="text-xl font-black text-primary">{fmt(collabCommission)} DH</span>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* COL 2 & 3: UNIFIED TIMELINE / ACTIVITY HISTORY */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          <div className="bg-surface-0 rounded-2xl border-2 border-border p-6 shadow-sm flex flex-col flex-1">
             <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
               <div className="flex items-center gap-2">
                 <Activity className="text-primary" size={20} />
                 <h3 className="text-lg font-black text-ink-1">Historique d'Activité Unifié</h3>
               </div>
               <div className="flex gap-2">
                 <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-bold">
                   {vehicle.reservations?.length || 0} Rés.
                 </span>
                 <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-lg text-xs font-bold">
                   {vehicle.maintenances?.length || 0} Ent.
                 </span>
               </div>
             </div>

             <div className="relative pl-6 border-l-2 border-border/60 space-y-8 ml-2 flex-1">
               {events.length > 0 ? (
                  events.map((evt) => {
                    const Icon = evt.type === "reservation" ? CalendarIcon : Wrench;
                    return (
                      <div key={evt.id} className="relative group">
                        {/* Timeline Bullet */}
                        <div className={cn(
                          "absolute -left-[35px] top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 bg-white transition-colors group-hover:scale-110",
                          evt.isRevenue ? "border-emerald-500 text-emerald-600" : "border-amber-500 text-amber-600"
                        )}>
                          <Icon size={10} strokeWidth={2.5} />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border bg-surface-1 hover:border-primary/30 transition-all">
                          <div className="mb-2 sm:mb-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-black uppercase text-ink-3">
                                {evt.date.toLocaleDateString()}
                              </span>
                              <span className={cn(
                                "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider",
                                evt.isRevenue ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                              )}>
                                {evt.type}
                              </span>
                            </div>
                            <h4 className="text-sm font-black text-ink-1">{evt.title}</h4>
                            <p className="text-xs text-ink-3 mt-1">{evt.description}</p>
                          </div>
                          
                          <div className="flex items-center gap-4 self-end sm:self-center">
                            {evt.type === "reservation" && (
                              <span className={cn(
                                "px-2 py-0.5 rounded text-[9px] font-bold uppercase",
                                evt.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                                evt.status === 'ongoing' ? 'bg-blue-50 text-blue-700' :
                                'bg-amber-50 text-amber-700'
                              )}>{evt.status}</span>
                            )}
                            <span className={cn(
                              "text-sm font-black",
                              evt.isRevenue ? "text-emerald-600" : "text-red-600"
                            )}>
                              {evt.isRevenue ? "+" : "-"}{fmt(evt.costOrRev)} DH
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
               ) : (
                 <div className="p-8 text-center text-ink-3 italic text-sm border-2 border-dashed border-border rounded-xl">
                   Aucune activité enregistrée pour ce véhicule.
                 </div>
               )}
             </div>

             <div className="mt-8 pt-6 border-t border-border flex justify-end">
               <button className="h-10 px-6 rounded-xl border-2 border-border text-ink-2 text-xs font-bold uppercase tracking-wider hover:bg-surface-1 flex items-center gap-2 transition cursor-pointer">
                 <ImageIcon size={14} /> Voir les constats & Dommages (OCR)
               </button>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
