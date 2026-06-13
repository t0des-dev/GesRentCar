import ContractSignClient from "./ContractSignClient";

export async function generateStaticParams() {
  return [{ id: "placeholder" }];
}

export default function Page() {
  return <ContractSignClient />;
}
