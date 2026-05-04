"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

export default function CtaBanner() {
  const { t } = useTranslation();

  return (
    <section className="py-32 bg-primary relative overflow-hidden">
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">{t("cta_title") || "Prêt pour la route ?"}</h2>
        <p className="text-white/70 max-w-lg mx-auto mb-10 text-lg">{t("cta_desc") || "Réservez votre véhicule de rêve en quelques minutes."}</p>
        <Link href="/fleet" className="bg-white text-primary px-10 py-4 rounded-full font-bold hover:bg-secondary transition-all">{t("btn_catalog") || "Voir la flotte"}</Link>
      </div>
    </section>
  );
}
