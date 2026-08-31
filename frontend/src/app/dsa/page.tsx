"use client";

import LegalLayout from "@/components/LegalLayout";
import { useTranslation } from "@/shared/hooks/useTranslation";

export default function DSAPage() {
  const { lang, t } = useTranslation();

  return (
    <LegalLayout title={t("footer_dsa")}>
      {lang === 'en' ? (
        <>
          <p>This page provides official compliance information under the EU Digital Services Act (Regulation EU 2022/2065).</p>
          
          <h2>Points of Contact</h2>
          <p>Authorities and users may contact our legal department directly at: contact@vectoria.com.</p>

          <h2>Illegal Content Reporting</h2>
          <p>Any user can report illicit content or suspicious activities through our dedicated contact form.</p>
        </>
      ) : (
        <>
          <p>Cette page contient les informations requises par le Règlement (UE) 2022/2065 relatif à un marché unique des services numériques (DSA).</p>
          
          <h2>Points de contact</h2>
          <p>Les autorités des États membres, la Commission et le comité peuvent nous contacter à l&apos;adresse suivante : contact@vectoria.com.</p>

          <h2>Signalement de contenus illicites</h2>
          <p>Tout utilisateur peut nous signaler la présence d&apos;un contenu qu&apos;il estime illicite sur notre plateforme via notre formulaire de contact.</p>
        </>
      )}
    </LegalLayout>
  );
}

