import { redirect } from "next/navigation";

export default function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Legacy /search/[id] flow deprecated — redirect to /booking wizard
  redirect(`/booking?vehicle=${params.id}`);
}
