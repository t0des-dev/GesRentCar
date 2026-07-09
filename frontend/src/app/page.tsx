import type { Metadata } from "next";
import HomeClient from "@/components/home/HomeClient";

export async function generateMetadata(): Promise<Metadata> {
  let config = null;
  try {
    let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
    if (typeof window === 'undefined' && apiUrl.startsWith('/')) {
      apiUrl = `http://web${apiUrl}`;
    }
    const res = await fetch(`${apiUrl}/config`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    if (res.ok) {
      config = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch SEO config", error);
  }

  const title = config?.agency_name ? `${config.agency_name} - Location de Voiture Premium` : "Vectoria - Location de Voiture Premium au Maroc";
  const description = config?.slogan || "Découvrez une collection exclusive de véhicules de luxe. Location courte et longue durée. Service VIP, Conciergerie et Flotte Premium.";
  
  return {
    title,
    description,
    keywords: ["location voiture maroc", "voiture de luxe", "premium car rental morocco", "vectoria rent car", "marrakech", "casablanca"],
    openGraph: {
      title,
      description,
      url: "https://vectoria-rent.com",
      siteName: config?.agency_name || "Vectoria Rent Car",
      images: [{ url: config?.hero_image_url || "/hero-preview.jpg", width: 1200, height: 630 }],
      locale: "fr_FR",
      type: "website",
    },
  };
}

export default function Home() {
  return <HomeClient />;
}
