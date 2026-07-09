"use client";

import LegalLayout from "@/components/LegalLayout";

export default function TermsPage() {
  return (
    <LegalLayout title="Conditions générales">
      <h2>1. Conditions de location</h2>
      <p>Le locataire doit être âgé d'au moins 21 ans et posséder un permis de conduire valide depuis plus de 2 ans.</p>
      
      <h2>2. Utilisation du véhicule</h2>
      <p>Le véhicule est destiné à un usage personnel et ne peut être utilisé pour le transport de marchandises ou de passagers à titre onéreux sans accord préalable.</p>

      <h2>3. Carburant et kilométrage</h2>
      <p>Sauf mention contraire, le véhicule est livré avec le plein et doit être restitué avec le plein. Le kilométrage peut être limité selon l'offre choisie.</p>
      
      <h2>4. Assurances</h2>
      <p>Le tarif inclut une assurance responsabilité civile. Des options d'assurance complémentaire sont disponibles lors de la réservation.</p>
    </LegalLayout>
  );
}
