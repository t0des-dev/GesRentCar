"use client";

import { motion } from "framer-motion";
import { Clock, Car, Target, Shield, CreditCard, Zap } from "lucide-react";

const TRUST_ITEMS = [
  { icon: Clock, label: "24/7 Assistance" },
  { icon: Car, label: "Airport Delivery" },
  { icon: Target, label: "Unlimited Mileage" },
  { icon: Shield, label: "Insurance Included" },
  { icon: CreditCard, label: "Transparent Pricing" },
  { icon: Zap, label: "Fast Booking" },
];

export default function TrustBar() {
  return (
    <div className="bg-white border-b border-[var(--line)]">
      <div className="max-w-[var(--container)] mx-auto px-8">
        <div className="flex flex-col md:flex-row items-center justify-center">
          {TRUST_ITEMS.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="flex-1 flex flex-col items-center text-center gap-3 py-8 px-4 md:border-r md:last:border-r-0 border-[var(--line)]"
            >
              <item.icon
                size={22}
                strokeWidth={1.5}
                className="text-[var(--navy)]"
              />
              <span className="text-[12px] font-semibold text-[var(--charcoal)] tracking-[0.01em]">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
