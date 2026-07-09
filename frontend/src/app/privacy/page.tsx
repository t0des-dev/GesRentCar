import dynamic from "next/dynamic";

const LegalLayout = dynamic(() => import("@/components/LegalLayout"), { ssr: false });

export default function PrivacyPage() {
  return (
    <LegalLayout title="Confidentialité">
      <h2>1. Collecte des données</h2>
      <p>Nous collectons les informations que vous nous fournissez lors de la création de votre compte, de la réalisation d&apos;une réservation ou de vos échanges avec notre service client.</p>
      
      <h2>2. Utilisation des données</h2>
      <p>Vos données sont principalement utilisées pour gérer vos réservations, améliorer nos services et vous informer de nos offres exclusives, sous réserve de votre consentement.</p>

      <h2>3. Protection des données</h2>
      <p>Nous mettons en œuvre des mesures de sécurité rigoureuses pour protéger vos informations personnelles contre tout accès non autorisé ou toute divulgation.</p>
      
      <h2>4. Vos droits</h2>
      <p>Conformément à la réglementation sur la protection des données personnelles, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données.</p>
    </LegalLayout>
  );
}
