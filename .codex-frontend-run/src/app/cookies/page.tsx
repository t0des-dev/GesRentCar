import LegalLayout from "@/components/LegalLayout";

export default function CookiesPage() {
  return (
    <LegalLayout title="Paramètres de cookies">
      <h2>1. Qu'est-ce qu'un cookie ?</h2>
      <p>Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette ou mobile) lors de la visite d'un site ou de la consultation d'une publicité. Ils ont pour but de collecter des informations relatives à votre navigation et de vous adresser des services adaptés à votre terminal.</p>
      
      <h2>2. Types de cookies utilisés</h2>
      <ul>
        <li><strong>Cookies techniques :</strong> Nécessaires au fonctionnement du site.</li>
        <li><strong>Cookies de mesure d'audience :</strong> Pour analyser votre navigation et nous permettre de mesurer l'audience de notre site internet.</li>
        <li><strong>Cookies de réseaux sociaux :</strong> Pour vous permettre de partager des contenus sur les réseaux sociaux.</li>
      </ul>

      <h2>3. Vos choix concernant les cookies</h2>
      <p>Vous pouvez à tout moment choisir de désactiver ces cookies. Votre navigateur peut également être paramétré pour vous signaler les cookies qui sont déposés dans votre ordinateur et vous demander de les accepter ou non.</p>
    </LegalLayout>
  );
}
