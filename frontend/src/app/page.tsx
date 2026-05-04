import type { Metadata } from "next";
import HomeClient from "@/components/home/HomeClient";

export const metadata: Metadata = {
  title: "Vectoria - Location de Voiture Premium au Maroc",
  description: "Découvrez une collection exclusive de véhicules de luxe. Location courte et longue durée à Casablanca, Marrakech et Tanger. Service VIP, Conciergerie et Flotte Premium.",
  keywords: ["location voiture maroc", "voiture de luxe", "premium car rental morocco", "vectoria rent car", "marrakech", "casablanca"],
  openGraph: {
    title: "Vectoria - L'Excellence Automobile au Maroc",
    description: "Réservez votre véhicule de prestige en quelques clics. Expérience client VIP garantie.",
    url: "https://vectoria-rent.com",
    siteName: "Vectoria Rent Car",
    images: [{ url: "/hero-preview.jpg", width: 1200, height: 630 }],
    locale: "fr_FR",
    type: "website",
  },
};

export default function Home() {
  return <HomeClient />;
}
