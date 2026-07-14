"use client";

import { motion } from "framer-motion";
import { Crown, Award, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { cn } from "@/shared/utils";
import { fmt } from "@/shared/utils/format";
import { useLoyaltyProfile, useLoyaltyHistory } from "@/shared/hooks/useApi";

interface LoyaltyTier {
  name: string;
  label: string;
  minPoints: number;
  color: string;
  gradient: string;
  borderColor: string;
  iconColor: string;
}

const TIERS: LoyaltyTier[] = [
  { name: "bronze",   label: "Bronze",   minPoints: 0,     color: "from-amber-600/30 to-amber-600/10",   gradient: "from-amber-600 to-amber-500",   borderColor: "border-amber-500/40", iconColor: "text-amber-500" },
  { name: "silver",   label: "Argent",   minPoints: 500,   color: "from-gray-400/30 to-gray-400/10",     gradient: "from-gray-400 to-gray-300",     borderColor: "border-gray-400/40", iconColor: "text-gray-400" },
  { name: "gold",     label: "Or",       minPoints: 2000,  color: "from-gold/30 to-gold/10",             gradient: "from-gold to-gold/90",          borderColor: "border-gold/40",     iconColor: "text-gold" },
  { name: "platinum", label: "Platine",  minPoints: 5000,  color: "from-blue-400/30 to-blue-400/10",     gradient: "from-blue-400 to-blue-300",     borderColor: "border-blue-400/40", iconColor: "text-blue-400" },
];

interface PointsEntry {
  id: number;
  amount: number;
  type: "earned" | "redeemed";
  description: string;
  date: string;
}

function getCurrentTier(points: number): LoyaltyTier {
  let current = TIERS[0];
  for (const tier of TIERS) {
    if (points >= tier.minPoints) current = tier;
  }
  return current;
}

function getNextTier(currentPoints: number): LoyaltyTier | null {
  const current = getCurrentTier(currentPoints);
  const idx = TIERS.findIndex(t => t.name === current.name);
  return idx < TIERS.length - 1 ? TIERS[idx + 1] : null;
}

function LoyaltySkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border-2 border-border bg-surface-1 p-8 animate-pulse">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-ink-1/10" />
            <div className="space-y-2">
              <div className="h-3 w-24 bg-ink-1/10 rounded" />
              <div className="h-5 w-16 bg-ink-1/10 rounded" />
            </div>
          </div>
          <div className="space-y-2 text-right">
            <div className="h-3 w-16 bg-ink-1/10 rounded ml-auto" />
            <div className="h-8 w-20 bg-ink-1/10 rounded ml-auto" />
          </div>
        </div>
        <div className="h-2.5 rounded-full bg-ink-1/10" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="rounded-xl p-4 border border-border bg-surface-1 animate-pulse">
            <div className="w-5 h-5 bg-ink-1/10 rounded mx-auto mb-2" />
            <div className="h-3 w-12 bg-ink-1/10 rounded mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LoyaltyCard() {
  const { data: profile, isLoading: profileLoading } = useLoyaltyProfile();
  const { data: historyData, isLoading: historyLoading } = useLoyaltyHistory();

  const points = profile?.points ?? 0;
  const tier = profile?.tier ?? "bronze";
  const history: PointsEntry[] = historyData?.history ?? historyData ?? [];

  if (profileLoading) return <LoyaltySkeleton />;

  const currentTier = getCurrentTier(points);
  const nextTier = getNextTier(points);
  const progress = nextTier
    ? ((points - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100;

  const displayTier = TIERS.find(t => t.name === tier) || currentTier;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "relative overflow-hidden rounded-2xl border-2 p-8",
          `bg-gradient-to-br ${displayTier.color} ${displayTier.borderColor}`
        )}
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                `bg-white/10 ${displayTier.iconColor}`
              )}>
                <Crown size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-ink-3">Niveau Actuel</p>
                <p className={cn("text-lg font-bold", displayTier.iconColor)}>{displayTier.label}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink-3">Points</p>
              <p className="text-3xl font-bold text-ink-1">{fmt(points)}</p>
            </div>
          </div>

          {nextTier && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">
                  Progression vers {nextTier.label}
                </p>
                <p className="text-[10px] font-bold text-ink-3">
                  {fmt(points - currentTier.minPoints)} / {fmt(nextTier.minPoints - currentTier.minPoints)}
                </p>
              </div>
              <div className="h-2.5 rounded-full bg-ink-1/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className={cn("h-full rounded-full bg-gradient-to-r", nextTier.gradient)}
                />
              </div>
              <p className="text-[10px] text-ink-3 text-right">
                Encore {fmt(nextTier.minPoints - points)} points pour {nextTier.label}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {TIERS.map((t, idx) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className={cn(
              "rounded-xl p-4 border text-center transition-all",
              t.name === displayTier.name
                ? `bg-gradient-to-br ${t.color} ${t.borderColor} shadow-lg`
                : "bg-surface-1 border-border hover:border-border/80"
            )}
          >
            <Award size={20} className={cn("mx-auto mb-2", t.iconColor)} />
            <p className={cn("text-xs font-bold uppercase tracking-wider", t.name === displayTier.name ? "text-ink-1" : "text-ink-3")}>
              {t.label}
            </p>
            <p className="text-[10px] text-ink-3 mt-1">{fmt(t.minPoints)}+ pts</p>
          </motion.div>
        ))}
      </div>

      {historyLoading ? (
        <div className="rounded-2xl border-2 border-border bg-surface-1 p-6">
          <div className="space-y-4">
            {[0, 1, 2].map(i => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-9 h-9 rounded-lg bg-ink-1/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-32 bg-ink-1/10 rounded" />
                  <div className="h-2 w-20 bg-ink-1/10 rounded" />
                </div>
                <div className="h-4 w-12 bg-ink-1/10 rounded" />
              </div>
            ))}
          </div>
        </div>
      ) : history.length > 0 ? (
        <div className="rounded-2xl border-2 border-border bg-surface-1 overflow-hidden">
          <div className="px-6 py-4 border-b-2 border-border">
            <h3 className="text-sm font-bold text-ink-1 uppercase tracking-wider">Historique des Points</h3>
          </div>
          <div className="divide-y divide-border">
            {history.slice(0, 8).map((entry, idx) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-4 px-6 py-4 hover:bg-surface-2/50 transition-colors"
              >
                <div className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                  entry.type === "earned"
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-red-500/15 text-red-400"
                )}>
                  {entry.type === "earned" ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink-1 truncate">{entry.description}</p>
                  <p className="text-[10px] text-ink-3">{entry.date}</p>
                </div>
                <p className={cn(
                  "text-sm font-bold",
                  entry.type === "earned" ? "text-emerald-400" : "text-red-400"
                )}>
                  {entry.type === "earned" ? "+" : "-"}{fmt(entry.amount)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
