import type { Metadata } from "next";
import VehicleClient from "./VehicleClient";

export async function generateStaticParams() {
  return [{ id: "placeholder" }];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    let apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
    if (typeof window === 'undefined' && apiUrl.startsWith('/')) {
      apiUrl = `http://nginx${apiUrl}`;
    }
    const res = await fetch(`${apiUrl}/vehicles/${id}`);
    const vehicle = await res.json();
    return {
      title: `${vehicle.brand} ${vehicle.model} - Vectoria Rent Car`,
      description: vehicle.description_fr || `Louez un ${vehicle.brand} ${vehicle.model} au Maroc. Prix à partir de ${vehicle.price_per_day} DH/jour.`,
      openGraph: {
        title: `${vehicle.brand} ${vehicle.model}`,
        description: vehicle.description_fr || `Location de ${vehicle.brand} ${vehicle.model}`,
        images: vehicle.image_url ? [vehicle.image_url] : [],
      },
    };
  } catch {
    return { title: "Véhicule - Vectoria Rent Car" };
  }
}

export default function VehiclePage() {
  return <VehicleClient />;
}
