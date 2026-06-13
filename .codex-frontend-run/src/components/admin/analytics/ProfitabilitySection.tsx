"use client";

import { motion } from "framer-motion";
import ProfitabilityTable from "@/components/ProfitabilityTable";

interface ProfitabilitySectionProps {
  data: any[];
}

export default function ProfitabilitySection({ data }: ProfitabilitySectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="card-premium p-10 rounded-2xl border-2 border-border"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h4 className="font-serif text-lg text-ink-1">Rentabilité par Véhicule (ROI)</h4>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-3">Analyse croisée des revenus vs coûts de maintenance.</p>
        </div>
      </div>
      <ProfitabilityTable data={data} />
    </motion.div>
  );
}
