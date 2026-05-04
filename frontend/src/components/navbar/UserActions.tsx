"use client";

import Link from "next/link";
import { User, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserActionsProps {
  session: any;
  signOut: () => void;
  t: (key: string) => string;
  textColor: string;
  hoverColor: string;
}

export default function UserActions({ session, signOut, t, textColor, hoverColor }: UserActionsProps) {
  return (
    <div className="flex items-center gap-5">
      {session ? (
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className={cn("text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2", textColor, hoverColor)}
          >
            <User size={16} className="text-primary" />
            {t("nav_dashboard") || "Compte"}
          </Link>
          <button
            onClick={signOut}
            className={cn("text-xs font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity", textColor)}
          >
            {t("nav_logout") || "Déconnexion"}
          </button>
        </div>
      ) : (
        <Link
          href="/login"
          className={cn("text-sm font-bold transition-colors flex items-center gap-2", textColor, hoverColor)}
        >
          <User size={18} />
          {t("nav_login")}
        </Link>
      )}

      <Link
        href="/booking"
        className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-bold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg hover:shadow-primary/40 hover:-translate-y-1 glow-primary flex items-center gap-2"
      >
        <Crown size={16} className="text-secondary" />
        {t("nav_book")}
      </Link>
    </div>
  );
}
