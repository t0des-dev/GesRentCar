"use client";

import dynamic from "next/dynamic";

const ConciergeAI = dynamic(
  () => import("@/components/ConciergeAI"),
  { ssr: false, loading: () => null }
);

export default function ConciergeAILoader() {
  return <ConciergeAI />;
}
