"use client";

import RevenueChart from "@/components/RevenueChart";
import FleetPieChart from "@/components/FleetPieChart";

interface AnalyticsChartsProps {
  revenueData: any[];
  fleetData: any;
}

export default function AnalyticsCharts({ revenueData, fleetData }: AnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div><h4 className="font-black text-lg text-slate-900">Performance des Revenus</h4><p className="text-xs text-slate-400 font-medium italic">Chiffre d'affaires par catégorie</p></div>
        </div>
        <RevenueChart data={revenueData} />
      </div>

      <div className="bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm flex flex-col">
        <div className="mb-8"><h4 className="font-black text-lg text-slate-900">Répartition Flotte</h4><p className="text-xs text-slate-400 font-medium italic">Utilisation vs Disponibilité</p></div>
        <div className="flex-1 flex items-center justify-center">
          <FleetPieChart data={[
            { name: "Occupés", value: fleetData?.occupied_vehicles || 35 },
            { name: "Libres", value: fleetData?.free_vehicles || 15 }
          ]} />
        </div>
        <div className="mt-8 space-y-3">
           <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary" /><span className="text-xs font-bold text-slate-600">En location</span></div>
              <span className="text-xs font-black text-slate-900">{fleetData?.occupied_vehicles || 35} vhc.</span>
           </div>
           <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-300" /><span className="text-xs font-bold text-slate-600">Disponibles</span></div>
              <span className="text-xs font-black text-slate-900">{fleetData?.free_vehicles || 15} vhc.</span>
           </div>
        </div>
      </div>
    </div>
  );
}
