"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthGuard } from "@/modules/auth/hooks/useAuthGuard";
import api from "@/shared/services/client";
import { motion } from "framer-motion";
import { ArrowLeft, Car, Calendar as CalendarIcon, Wrench, ShieldAlert, Activity, DollarSign, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/shared/utils";

export default function VehicleDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const { checking } = useAuthGuard("admin");
  const [vehicle, setVehicle] = useState<any>(null);
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
                  <span className="text-2xl font-black text-emerald-700">{totalRev.toLocaleString()} DH</span>
                </div>
                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                  <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block mb-1">Coûts d'Entretien</span>
                  <span className="text-2xl font-black text-red-700">- {totalCost.toLocaleString()} DH</span>
                </div>
                <div className="bg-surface-1 rounded-xl p-4 border border-border">
                  <span className="text-[10px] font-bold text-ink-3 uppercase tracking-wider block mb-1">Marge Nette Principale</span>
                  <span className={cn("text-3xl font-black", roi >= 0 ? "text-emerald-600" : "text-red-600")}>
                    {roi > 0 ? "+" : ""}{roi.toLocaleString()} DH
                  </span>
                </div>

                {isCollab && (
                  <div className="bg-primary/10 rounded-xl p-4 border border-primary/20 mt-4">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">Commission Due ({vehicle.commission_rate}%)</span>
                    <span className="text-xl font-black text-primary">{collabCommission.toLocaleString()} DH</span>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* COL 2 & 3: TIMELINE & MAINTENANCE */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* GANTT / RESERVATIONS */}
          <div className="bg-surface-0 rounded-2xl border-2 border-border p-6 shadow-sm flex-1">
             <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2">
                 <CalendarIcon className="text-primary" size={20} />
                 <h3 className="text-lg font-black text-ink-1">Calendrier des Réservations</h3>
               </div>
               <span className="px-3 py-1 bg-surface-1 text-ink-2 rounded text-xs font-bold">
                 {vehicle.reservations?.length || 0} Réservations
               </span>
             </div>

             <div className="space-y-3">
               {vehicle.reservations && vehicle.reservations.length > 0 ? (
                 vehicle.reservations.map((res: any) => (
                   <div key={res.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border bg-surface-1 hover:border-primary/30 transition-colors">
                     <div className="mb-2 sm:mb-0">
                       <span className="text-[10px] font-bold uppercase text-ink-3 block mb-1">
                         {new Date(res.start_date).toLocaleDateString()} ➔ {new Date(res.end_date).toLocaleDateString()}
                       </span>
                       <span className="text-sm font-black text-ink-1">Réf: {res.id}</span>
                     </div>
                     <div className="flex items-center gap-4">
                       <span className={cn(
                         "px-2 py-1 rounded text-[10px] font-bold uppercase",
                         res.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                         res.status === 'ongoing' ? 'bg-blue-100 text-blue-700' :
                         'bg-amber-100 text-amber-700'
                       )}>{res.status}</span>
                       <span className="text-sm font-black text-primary">{Number(res.total_price).toLocaleString()} DH</span>
                     </div>
                   </div>
                 ))
               ) : (
                 <div className="p-8 text-center text-ink-3 italic text-sm border-2 border-dashed border-border rounded-xl">
                   Aucune réservation pour ce véhicule.
                 </div>
               )}
             </div>
          </div>

          {/* MAINTENANCES & OCR LINK */}
          <div className="bg-surface-0 rounded-2xl border-2 border-border p-6 shadow-sm flex-1">
             <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2">
                 <Wrench className="text-amber-500" size={20} />
                 <h3 className="text-lg font-black text-ink-1">Historique d'Entretien</h3>
               </div>
               <span className="px-3 py-1 bg-surface-1 text-ink-2 rounded text-xs font-bold">
                 {vehicle.maintenances?.length || 0} Interventions
               </span>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {vehicle.maintenances && vehicle.maintenances.length > 0 ? (
                 vehicle.maintenances.map((m: any) => (
                   <div key={m.id} className="p-4 rounded-xl border border-border bg-surface-1 flex flex-col justify-between">
                     <div>
                       <span className="text-[10px] font-bold uppercase text-amber-600 mb-1 block">{m.type}</span>
                       <p className="text-sm font-bold text-ink-1 mb-2 line-clamp-2">{m.description}</p>
                       <span className="text-xs text-ink-3">{new Date(m.date).toLocaleDateString()} • {m.mileage} KM</span>
                     </div>
                     <div className="mt-4 pt-3 border-t border-border/50 text-right">
                       <span className="text-sm font-black text-red-600">-{Number(m.cost).toLocaleString()} DH</span>
                     </div>
                   </div>
                 ))
               ) : (
                 <div className="col-span-full p-8 text-center text-ink-3 italic text-sm border-2 border-dashed border-border rounded-xl">
                   Aucun entretien enregistré.
                 </div>
               )}
             </div>

             <div className="mt-6 pt-6 border-t border-border flex justify-end">
               <button className="h-10 px-6 rounded-xl border-2 border-border text-ink-2 text-xs font-bold uppercase tracking-wider hover:bg-surface-1 flex items-center gap-2 transition">
                 <ImageIcon size={14} /> Voir les constats & Dommages (OCR)
               </button>
             </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
