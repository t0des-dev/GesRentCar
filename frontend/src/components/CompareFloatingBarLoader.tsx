"use client";

import dynamic from "next/dynamic";

const CompareFloatingBar = dynamic(
  () => import("@/components/CompareFloatingBar"),
  { ssr: false, loading: () => null }
);

export default function CompareFloatingBarLoader() {
  return <CompareFloatingBar />;
}
