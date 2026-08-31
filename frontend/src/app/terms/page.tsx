"use client";

import LegalLayout from "@/components/LegalLayout";
import { useTranslation } from "@/shared/hooks/useTranslation";

export default function TermsPage() {
  const { lang, t } = useTranslation();

  return (
    <LegalLayout title={t("footer_terms")}>
      {lang === 'en' ? (
        <>
          <h2>1. Rental Conditions</h2>
          <p>The renter must be at least 21 years old and hold a valid driver&apos;s license for more than 2 years.</p>
          
          <h2>2. Vehicle Usage</h2>
          <p>The vehicle is intended for personal use and cannot be used for commercial transportation of goods or passengers without prior written agreement.</p>

          <h2>3. Fuel and Mileage</h2>
          <p>Unless stated otherwise, the vehicle is delivered with a full tank and must be returned with a full tank. Unlimited mileage is included on eligible bookings.</p>
          
          <h2>4. Insurance</h2>
          <p>The base rate includes third-party liability insurance. Premium zero-deductible options are available during reservation.</p>
        </>
      ) : (
        <>
          <h2>1. Conditions de location</h2>
          <p>Le locataire doit être âgé d&apos;au moins 21 ans et posséder un permis de conduire valide depuis plus de 2 ans.</p>
          
          <h2>2. Utilisation du véhicule</h2>
          <p>Le véhicule est destiné à un usage personnel et ne peut être utilisé pour le transport de marchandises ou de passagers à titre onéreux sans accord préalable.</p>

          <h2>3. Carburant et kilométrage</h2>
          <p>Sauf mention contraire, le véhicule est livré avec le plein et doit être restitué avec le plein. Le kilométrage peut être limité selon l&apos;offre choisie.</p>
          
          <h2>4. Assurances</h2>
          <p>Le tarif inclut une assurance responsabilité civile. Des options d&apos;assurance complémentaire sont disponibles lors de la réservation.</p>
        </>
      )}
    </LegalLayout>
  );
}

