"use client";

import LegalLayout from "@/components/LegalLayout";
import { useTranslation } from "@/shared/hooks/useTranslation";

export default function PrivacyPage() {
  const { lang, t } = useTranslation();

  return (
    <LegalLayout title={t("footer_privacy")}>
      {lang === 'en' ? (
        <>
          <h2>1. Data Collection</h2>
          <p>We collect information you provide when creating your account, making a reservation, or interacting with our concierge and customer support teams.</p>
          
          <h2>2. Data Usage</h2>
          <p>Your data is primarily used to process your vehicle bookings, improve our fleet services, and keep you informed of exclusive offers.</p>

          <h2>3. Data Protection</h2>
          <p>We apply the highest industry security standards to safeguard your personal data from unauthorized access or alteration.</p>
          
          <h2>4. Your Rights</h2>
          <p>Under applicable data privacy regulations, you retain full rights to access, rectify, or request deletion of your personal data at any time.</p>
        </>
      ) : (
        <>
          <h2>1. Collecte des données</h2>
          <p>Nous collectons les informations que vous nous fournissez lors de la création de votre compte, de la réalisation d&apos;une réservation ou de vos échanges avec notre service client.</p>
          
          <h2>2. Utilisation des données</h2>
          <p>Vos données sont principalement utilisées pour gérer vos réservations, améliorer nos services et vous informer de nos offres exclusives, sous réserve de votre consentement.</p>

          <h2>3. Protection des données</h2>
          <p>Nous mettons en œuvre des mesures de sécurité rigoureuses pour protéger vos informations personnelles contre tout accès non autorisé ou toute divulgation.</p>
          
          <h2>4. Vos droits</h2>
          <p>Conformément à la réglementation sur la protection des données personnelles, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données.</p>
        </>
      )}
    </LegalLayout>
  );
}

