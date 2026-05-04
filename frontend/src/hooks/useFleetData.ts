"use client";

import { useState, useCallback, useMemo } from "react";
import { useVehicles } from "@/hooks/useApi";
import { FleetFilterState } from "@/components/FleetFilters";

interface UseFleetDataProps {
  pageSize: number;
  search: string;
  filters: FleetFilterState;
  sortBy: string;
  startDate?: string;
  endDate?: string;
}

export function useFleetData({ pageSize, search, filters, sortBy, startDate, endDate }: UseFleetDataProps) {
  const [page, setPage] = useState(1);

  const { data: apiData, isLoading } = useVehicles({
    page,
    per_page: pageSize,
    max_price: filters.maxPrice < 3000 ? filters.maxPrice : undefined,
    type: filters.type !== "All" ? filters.type.toLowerCase() : undefined,
    start_date: startDate,
    end_date: endDate,
  });

  const filtered = useMemo(() => {
    return (apiData?.data ?? []).filter((v) => {
      const matchSearch =
        v.brand.toLowerCase().includes(search.toLowerCase()) ||
        v.model.toLowerCase().includes(search.toLowerCase());
      const matchTrans =
        filters.transmission === "All" ||
        (v as any).transmission === filters.transmission;
      const matchSeats =
        filters.seats === "All" ||
        ((filters.seats === "7+" ? (v as any).seats >= 7 : (v as any).seats === Number(filters.seats)));

      const matchLifestyle = filters.lifestyle === "all" || (function() {
        const m = v.model.toLowerCase();
        const b = v.brand.toLowerCase();
        const t = v.type.toLowerCase();
        const d = (v.description_fr || v.description || "").toLowerCase();
        
        if (filters.lifestyle === "business") {
          return t.includes("luxury") || t.includes("sedan") || b.includes("mercedes") || b.includes("bmw") || b.includes("audi") || b.includes("range");
        }
        if (filters.lifestyle === "romance") {
          return t.includes("sport") || t.includes("convertible") || m.includes("cabrio") || b.includes("porsche") || b.includes("ferrari") || t.includes("coupe");
        }
        if (filters.lifestyle === "adventure") {
          return t.includes("suv") || b.includes("jeep") || b.includes("land") || b.includes("toyota") || d.includes("4x4") || d.includes("aventure") || d.includes("mountain");
        }
        if (filters.lifestyle === "family") {
          return (v.seats >= 7) || t.includes("van") || t.includes("suv") || d.includes("famille") || d.includes("spacious");
        }
        return true;
      })();

      return matchSearch && matchTrans && matchSeats && matchLifestyle;
    });
  }, [apiData, search, filters]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortBy === "price_asc") return a.price_per_day - b.price_per_day;
      if (sortBy === "price_desc") return b.price_per_day - a.price_per_day;
      if (sortBy === "year_desc") return (b.year || 0) - (a.year || 0);
      if (sortBy === "brand_asc") return a.brand.localeCompare(b.brand);
      return 0;
    });
  }, [filtered, sortBy]);

  const handleFilterChange = useCallback((f: FleetFilterState) => {
    // Note: Parent needs to update filters state, but we reset page here if filters change
    setPage(1);
  }, []);

  return {
    sorted,
    isLoading,
    page,
    setPage,
    totalPages: apiData?.last_page ?? 1,
    totalCount: sorted.length
  };
}
