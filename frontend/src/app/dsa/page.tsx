import dynamic from "next/dynamic";

const LegalLayout = dynamic(() => import("@/components/LegalLayout"), { ssr: false });

export default function DSAPage() {
  return (
    <LegalLayout title="Législation sur les services numériques">
      <p>Cette page contient les informations requises par le Règlement (UE) 2022/2065 relatif à un marché unique des services numériques (DSA).</p>
      
      <h2>Points de contact</h2>
      <p>Les autorités des États membres, la Commission et le comité peuvent nous contacter à l&apos;adresse suivante : contact@vectoria.com.</p>

      <h2>Signalement de contenus illicites</h2>
      <p>Tout utilisateur peut nous signaler la présence d&apos;un contenu qu&apos;il estime illicite sur notre plateforme via notre formulaire de contact.</p>
    </LegalLayout>
  );
}
