"use client";

import { motion } from "framer-motion";
import { cn } from "@/shared/utils";

interface ThemeSectionProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  centered?: boolean;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function ThemeSection({
  eyebrow,
  title,
  description,
  centered = false,
  children,
  className,
  id,
}: ThemeSectionProps) {
  return (
    <section id={id} className={cn("py-24 lg:py-32", className)}>
      <div className="max-w-[var(--container)] mx-auto px-8">
        {(eyebrow || title || description) && (
          <div className={cn("section-head", centered && "section-head-center")}>
            <div className={cn("section-mark", centered && "section-mark-center")} />
            {eyebrow && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="eyebrow-theme"
                style={centered ? { justifyContent: "center" } : undefined}
              >
                {eyebrow}
              </motion.div>
            )}
            {title && (
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 }}
                className="text-[var(--navy)]"
              >
                {title}
              </motion.h2>
            )}
            {description && (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.16 }}
              >
                {description}
              </motion.p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
