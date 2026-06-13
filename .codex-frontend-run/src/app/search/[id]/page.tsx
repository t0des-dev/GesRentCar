import SearchClient from "./SearchClient";

export async function generateStaticParams() {
  return [{ id: "placeholder" }];
}

export default function VehicleDetailPage() {
  return <SearchClient />;
}
