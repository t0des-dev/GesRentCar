"use client";

import LegalLayout from "@/components/LegalLayout";
import { useTranslation } from "@/shared/hooks/useTranslation";

export default function CookiesPage() {
  const { lang, t } = useTranslation();

  return (
    <LegalLayout title={t("footer_cookies")}>
      {lang === 'en' ? (
        <>
          <h2>1. What is a cookie?</h2>
          <p>A cookie is a small text file stored on your device (computer, tablet, or smartphone) when visiting a website. They collect browsing information to optimize performance and tailor services to your device.</p>
          
          <h2>2. Types of cookies used</h2>
          <ul>
            <li><strong>Technical Cookies:</strong> Essential for the proper operation of the website and secure bookings.</li>
            <li><strong>Analytics Cookies:</strong> To analyze browsing activity and optimize user experience.</li>
            <li><strong>Marketing & Social Cookies:</strong> To enable smooth social sharing and tailored recommendations.</li>
          </ul>

          <h2>3. Managing your cookie preferences</h2>
          <p>You can adjust your cookie settings at any time in your browser to block, remove, or notify you when new cookies are created.</p>
        </>
      ) : (
        <>
          <h2>1. Qu&apos;est-ce qu&apos;un cookie ?</h2>
          <p>Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette ou mobile) lors de la visite d&apos;un site ou de la consultation d&apos;une publicité. Ils ont pour but de collecter des informations relatives à votre navigation et de vous adresser des services adaptés à votre terminal.</p>
          
          <h2>2. Types de cookies utilisés</h2>
          <ul>
            <li><strong>Cookies techniques :</strong> Nécessaires au fonctionnement du site.</li>
            <li><strong>Cookies de mesure d&apos;audience :</strong> Pour analyser votre navigation et nous permettre de mesurer l&apos;audience de notre site internet.</li>
            <li><strong>Cookies de réseaux sociaux :</strong> Pour vous permettre de partager des contenus sur les réseaux sociaux.</li>
          </ul>

          <h2>3. Vos choix concernant les cookies</h2>
          <p>Vous pouvez à tout moment choisir de désactiver ces cookies. Votre navigateur peut également être paramétré pour vous signaler les cookies qui sont déposés dans votre ordinateur et vous demander de les accepter ou non.</p>
        </>
      )}
    </LegalLayout>
  );
}

