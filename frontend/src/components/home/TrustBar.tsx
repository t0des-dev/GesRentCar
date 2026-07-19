"use client";

import { motion } from "framer-motion";

const TRUST_ITEMS = [
  { icon: "M12 2a10 10 0 100 20 10 10 0 000-20zm0 5v5l3 3", label: "24/7 Assistance" },
  { icon: "M3 13l2-5a2 2 0 012-1h10a2 2 0 012 1l2 5M3 13v4a1 1 0 001 1h1a1 1 0 001-1v-1h12v1a1 1 0 001 1h1a1 1 0 001-1v-4", label: "Airport Delivery" },
  { icon: "M12 2a10 10 0 100 20 10 10 0 000-20zm0 4a4 4 0 110 8 4 4 0 010-8z", label: "Unlimited Mileage" },
  { icon: "M12 3l8 4v5c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V7l8-4z", label: "Insurance Included" },
  { icon: "M3 4h18v14H3zM3 9h18", label: "Transparent Pricing" },
  { icon: "M13 3L4 14h6l-1 7 9-11h-6l1-7z", label: "Fast Booking" },
];

export default function TrustBar() {
  return (
    <div className="bg-white border-b border-[var(--line)]">
      <div className="max-w-[var(--container)] mx-auto px-8 py-11 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {TRUST_ITEMS.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className="flex flex-col items-center text-center gap-3.5 lg:border-r lg:last:border-r-0 border-[var(--line)]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-[26px] h-[26px] text-[var(--navy)]"
            >
              <path d={item.icon} />
            </svg>
            <span className="text-[12.5px] font-semibold text-[var(--charcoal)] tracking-[0.01em]">
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
