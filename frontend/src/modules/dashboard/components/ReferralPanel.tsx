"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Share2, Mail, MessageCircle, Gift, Users, Award, Link2, Loader2 } from "lucide-react";
import { cn } from "@/shared/utils";
import { fmt } from "@/shared/utils/format";
import { useReferralCode, useReferralStats } from "@/shared/hooks/useApi";

function ReferralSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border-2 border-border bg-surface-1 p-8 animate-pulse">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-ink-1/10" />
          <div className="space-y-2">
            <div className="h-5 w-32 bg-ink-1/10 rounded" />
            <div className="h-3 w-48 bg-ink-1/10 rounded" />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 rounded-xl bg-surface-0 border border-border p-5 space-y-3">
            <div className="h-3 w-24 bg-ink-1/10 rounded" />
            <div className="h-7 w-36 bg-ink-1/10 rounded" />
          </div>
          <div className="flex-1 rounded-xl bg-surface-0 border border-border p-5 space-y-3">
            <div className="h-3 w-24 bg-ink-1/10 rounded" />
            <div className="h-4 w-full bg-ink-1/10 rounded" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[0, 1].map(i => (
          <div key={i} className="rounded-xl border border-border bg-surface-1 p-6 flex items-center gap-4 animate-pulse">
            <div className="w-12 h-12 rounded-xl bg-ink-1/10" />
            <div className="space-y-2">
              <div className="h-3 w-20 bg-ink-1/10 rounded" />
              <div className="h-7 w-12 bg-ink-1/10 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReferralPanel() {
  const { data: codeData, isLoading: codeLoading } = useReferralCode();
  const { data: statsData, isLoading: statsLoading } = useReferralStats();
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const referralCode = codeData?.code ?? codeData?.referralCode ?? "VECTORIA2026";
  const totalReferred = statsData?.totalReferred ?? statsData?.total_referred ?? 0;
  const totalBonuses = statsData?.totalBonuses ?? statsData?.total_bonuses ?? 0;

  const referralLink = typeof window !== "undefined"
    ? `${window.location.origin}/register?ref=${referralCode}`
    : `https://vectoria.rent/register?ref=${referralCode}`;

  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(referralCode ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, [referralCode]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(referralLink ?? "");
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {}
  }, [referralLink]);

  const handleShareWhatsApp = useCallback(() => {
    const text = encodeURIComponent(
      `Rejoins Vectoria avec mon code parrain ${referralCode} et b\u00e9n\u00e9ficie de r\u00e9ductions exclusives ! \uD83D\uDE97\u2728\n${referralLink}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }, [referralCode, referralLink]);

  const handleShareEmail = useCallback(() => {
    const subject = encodeURIComponent("Rejoins Vectoria - Code Parrainage");
    const body = encodeURIComponent(
      `Utilise mon code parrain ${referralCode} pour t'inscrire sur Vectoria et b\u00e9n\u00e9ficie d'avantages exclusives !\n\n${referralLink}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  }, [referralCode, referralLink]);

  if (codeLoading || statsLoading) return <ReferralSkeleton />;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border-2 border-gold/30 bg-gradient-to-br from-gold/10 to-gold/5 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/30 flex items-center justify-center">
            <Gift size={24} className="text-gold" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-ink-1 tracking-tight">Parrainage</h3>
            <p className="text-xs text-ink-3">Partagez votre code et gagnez des avantages</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 rounded-xl bg-surface-0 border-2 border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink-3">Code Parrain</p>
              <button
                onClick={handleCopyCode}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                  copied
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-400/30"
                    : "bg-gold/15 text-gold border border-gold/30 hover:bg-gold/25"
                )}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copi\u00e9 !" : "Copier"}
              </button>
            </div>
            <p className="text-2xl font-bold text-gold tracking-wider font-mono">{referralCode}</p>
          </div>

          <div className="flex-1 rounded-xl bg-surface-0 border-2 border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink-3">Lien d&apos;invitation</p>
              <button
                onClick={handleCopyLink}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                  copiedLink
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-400/30"
                    : "bg-surface-1 text-ink-2 border border-border hover:border-gold hover:text-gold"
                )}
              >
                {copiedLink ? <Check size={12} /> : <Link2 size={12} />}
                {copiedLink ? "Copi\u00e9 !" : "Copier"}
              </button>
            </div>
            <p className="text-sm text-ink-2 truncate">{referralLink}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShareWhatsApp}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] text-xs font-bold uppercase tracking-wider hover:bg-[#25D366]/25 transition-all"
          >
            <MessageCircle size={16} /> WhatsApp
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShareEmail}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-500/15 border border-blue-400/30 text-blue-400 text-xs font-bold uppercase tracking-wider hover:bg-blue-500/25 transition-all"
          >
            <Mail size={16} /> Email
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-surface-1 border-2 border-border text-ink-2 text-xs font-bold uppercase tracking-wider hover:border-gold hover:text-gold transition-all"
          >
            <Share2 size={16} /> Copier le lien
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border-2 border-border bg-surface-1 p-6 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/40 flex items-center justify-center text-primary">
            <Users size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-3">Parrain\u00e9s</p>
            <p className="text-2xl font-bold text-ink-1">{fmt(totalReferred)}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border-2 border-border bg-surface-1 p-6 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/40 flex items-center justify-center text-gold">
            <Award size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-3">Bonus Gagn\u00e9s</p>
            <p className="text-2xl font-bold text-ink-1">{fmt(totalBonuses)} <span className="text-sm text-ink-3 ml-0.5">DH</span></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
