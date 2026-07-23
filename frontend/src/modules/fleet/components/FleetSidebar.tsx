"use client";

import { motion } from "framer-motion";
import FleetFilters, { FleetFilterState } from "@/modules/fleet/components/FleetFilters";

interface FleetSidebarProps {
  filters: FleetFilterState;
  onFilterChange: (key: keyof FleetFilterState, value: string | number) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export default function FleetSidebar({ filters, onFilterChange, onReset, hasActiveFilters }: FleetSidebarProps) {
  return (
    <aside className="hidden lg:block sticky top-24">
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <FleetFilters
          filters={filters}
          onFilterChange={onFilterChange}
          onReset={onReset}
          hasActiveFilters={hasActiveFilters}
        />
      </motion.div>
    </aside>
  );
}
