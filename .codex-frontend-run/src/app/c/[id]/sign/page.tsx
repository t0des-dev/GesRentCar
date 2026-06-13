import SignClient from "./SignClient";

export async function generateStaticParams() {
  return [{ id: "placeholder" }];
}

export default function PublicSignaturePage() {
  return <SignClient />;
}
