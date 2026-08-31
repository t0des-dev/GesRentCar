"use client";

import LegalLayout from "@/components/LegalLayout";
import { useTranslation } from "@/shared/hooks/useTranslation";

export default function AccessibilityPage() {
  const { lang, t } = useTranslation();

  return (
    <LegalLayout title={t("footer_accessibility")}>
      {lang === 'en' ? (
        <>
          <p>Vectoria is committed to making its digital experiences accessible to all users, adhering to international web accessibility standards (WCAG 2.1 AA).</p>
          
          <h2>Our Approach</h2>
          <p>We continuously improve user experience and accessibility features across all screen sizes and assistive technologies.</p>

          <h2>Feedback & Support</h2>
          <p>If you encounter any difficulty accessing content on our platform, please reach out to our team via our contact form for immediate assistance.</p>
        </>
      ) : (
        <>
          <p>Vectoria s&apos;engage à rendre ses services numériques accessibles, conformément à l&apos;article 47 de la loi n° 2005-102 du 11 février 2005.</p>
          
          <h2>Notre démarche</h2>
          <p>Nous travaillons continuellement à l&apos;amélioration de l&apos;expérience utilisateur pour tous, et à l&apos;application des standards d&apos;accessibilité pertinents.</p>

          <h2>Retours d&apos;information</h2>
          <p>Si vous n&apos;arrivez pas à accéder à un contenu ou à un service, vous pouvez nous contacter pour être orienté vers une alternative accessible ou obtenir le contenu sous une autre forme.</p>
        </>
      )}
    </LegalLayout>
  );
}

