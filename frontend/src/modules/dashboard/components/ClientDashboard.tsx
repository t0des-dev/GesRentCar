"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { History, Star, Search, Gift, MessageSquare, Bell } from "lucide-react";
import { cn } from "@/shared/utils";
import { useAuth } from "@/modules/auth/context/context";
import ProfileHeader from "./ProfileHeader";
import ReservationHistory from "./ReservationHistory";
import LoyaltyCard from "./LoyaltyCard";
import ReferralPanel from "./ReferralPanel";
import NotificationBell from "./NotificationBell";

type DashboardTab = "reservations" | "loyalty" | "referrals" | "reviews" | "searches";

const TABS: { key: DashboardTab; label: string; icon: typeof History }[] = [
  { key: "reservations", label: "R\u00e9servations", icon: History },
  { key: "loyalty", label: "Fid\u00e9lit\u00e9", icon: Star },
  { key: "referrals", label: "Parrainage", icon: Gift },
  { key: "reviews", label: "Avis", icon: MessageSquare },
  { key: "searches", label: "Recherches", icon: Search },
];

function UserReviews() {
  return (
    <div className="rounded-2xl border-2 border-border bg-surface-1 overflow-hidden">
      <div className="px-6 py-4 border-b-2 border-border">
        <h3 className="text-sm font-bold text-ink-1 uppercase tracking-wider">Vos Avis</h3>
      </div>
      <div className="text-center py-16 px-6">
        <MessageSquare size={48} className="mx-auto mb-4 text-gold/30" />
        <h4 className="text-lg font-bold text-ink-1 mb-2 font-serif">Donnez votre avis</h4>
        <p className="text-ink-3 text-sm max-w-md mx-auto">
          Vous n&apos;avez pas encore laiss&eacute; d&apos;avis.Apr&egrave;s chaque location compl&eacute;t&eacute;e,
          vous pouvez laisser un avis sur le v&eacute;hicule directement depuis les d&eacute;tails de votre r&eacute;servation.
        </p>
      </div>
    </div>
  );
}

function SavedSearches() {
  return (
    <div className="rounded-2xl border-2 border-border bg-surface-1 overflow-hidden">
      <div className="px-6 py-4 border-b-2 border-border">
        <h3 className="text-sm font-bold text-ink-1 uppercase tracking-wider">Recherches Sauvegard&eacute;es</h3>
      </div>
      <div className="text-center py-16 px-6">
        <Search size={48} className="mx-auto mb-4 text-gold/30" />
        <h4 className="text-lg font-bold text-ink-1 mb-2 font-serif">Vos recherches</h4>
        <p className="text-ink-3 text-sm max-w-md mx-auto">
          Retrouvez vos recherches pr&eacute;c&eacute;dentes et relancez-les en un clic.
          Vos recherches seront enregistr&eacute;es automatiquement.
        </p>
      </div>
    </div>
  );
}

export default function ClientDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>("reservations");

  return (
    <section className="min-h-screen bg-surface-0 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <ProfileHeader session={user ? { user } : null} />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-wrap items-center gap-2 mb-10 pb-6 border-b-2 border-border"
        >
          <div className="flex flex-wrap gap-2 flex-1">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <motion.button
                  key={tab.key}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "relative flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300",
                    isActive
                      ? "bg-gradient-to-r from-gold to-gold/90 text-ink-1 shadow-lg shadow-gold/40"
                      : "text-ink-2 hover:text-gold hover:bg-gold/5 border-2 border-transparent hover:border-gold/40"
                  )}
                >
                  <tab.icon size={15} strokeWidth={2} />
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="dashTab"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold to-gold/60 rounded-full"
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
          <NotificationBell />
        </motion.div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === "reservations" && <ReservationHistory />}
          {activeTab === "loyalty" && <LoyaltyCard />}
          {activeTab === "referrals" && <ReferralPanel />}
          {activeTab === "reviews" && <UserReviews />}
          {activeTab === "searches" && <SavedSearches />}
        </motion.div>
      </div>
    </section>
  );
}
