"use client";

import ProfitabilityTable from "@/components/ProfitabilityTable";

interface ProfitabilitySectionProps {
  data: any[];
}

export default function ProfitabilitySection({ data }: ProfitabilitySectionProps) {
  return (
    <div className="bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h4 className="font-black text-lg text-slate-900">Rentabilité par Véhicule (ROI)</h4>
          <p className="text-xs text-slate-400 font-medium italic">Analyse croisée des revenus vs coûts de maintenance.</p>
        </div>
      </div>
      <ProfitabilityTable data={data} />
    </div>
  );
}
