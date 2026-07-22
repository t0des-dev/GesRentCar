"use client";

import TrustBar from "./TrustBar";
import type { StatsConfig } from "@/types/storefront";

export default function StatsSection({ content }: { content: Partial<StatsConfig> }) {
  return <TrustBar content={content} />;
}
