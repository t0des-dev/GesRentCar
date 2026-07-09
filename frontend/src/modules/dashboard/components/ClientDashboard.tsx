"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { History, Star, Search, Gift, MessageSquare } from "lucide-react";
import { cn } from "@/shared/utils";
import { useAuth } from "@/modules/auth/context/context";
import ProfileHeader from "./ProfileHeader";
import ReservationHistory from "./ReservationHistory";
import LoyaltyCard from "./LoyaltyCard";
import ReferralPanel from "./ReferralPanel";

type DashboardTab = "reservations" | "loyalty" | "referrals" | "reviews" | "searches";

const TABS: { key: DashboardTab; label: string; icon: typeof History }[] = [
  { key: "reservations", label: "Réservations", icon: History },
  { key: "loyalty", label: "Fidélité", icon: Star },
  { key: "referrals", label: "Parrainage", icon: Gift },
  { key: "reviews", label: "Avis", icon: MessageSquare },
  { key: "searches", label: "Recherches", icon: Search },
];

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
          className="flex flex-wrap gap-2 mb-10 pb-6 border-b-2 border-border"
        >
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
          {activeTab === "reviews" && (
            <div className="text-center py-32 bg-surface-1 rounded-2xl border-2 border-border">
              <MessageSquare size={52} className="mx-auto mb-6 text-gold/30" />
              <h3 className="text-2xl font-bold text-ink-1 mb-3 font-serif">Vos Avis</h3>
              <p className="text-ink-2 max-w-sm mx-auto text-sm">Consultez et gérez les avis que vous avez laissés sur nos véhicules.</p>
            </div>
          )}
          {activeTab === "searches" && (
            <div className="text-center py-32 bg-surface-1 rounded-2xl border-2 border-border">
              <Search size={52} className="mx-auto mb-6 text-gold/30" />
              <h3 className="text-2xl font-bold text-ink-1 mb-3 font-serif">Recherches Sauvegardées</h3>
              <p className="text-ink-2 max-w-sm mx-auto text-sm">Retrouvez vos recherches précédentes et relancez-les en un clic.</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
