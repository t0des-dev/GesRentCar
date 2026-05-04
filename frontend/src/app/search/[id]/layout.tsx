import { Metadata } from "next";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  // Since we can't easily fetch data from the API in a layout without extra logic, 
  // we use a generic but premium title. 
  // In a real production app, we would fetch the vehicle name here.
  
  return {
    title: `Réserver votre Véhicule Premium | Vectoria`,
    description: "Finalisez votre réservation et vivez l'exceptionnel. Signature digitale et paiement sécurisé.",
  };
}

export default function VehicleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
