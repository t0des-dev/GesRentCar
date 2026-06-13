import VehicleClient from "./VehicleClient";

export async function generateStaticParams() {
  return [{ id: "placeholder" }];
}

export default function VehiclePage() {
  return <VehicleClient />;
}
