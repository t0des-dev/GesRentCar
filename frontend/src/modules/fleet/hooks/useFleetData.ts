"use client";

import { useState, useCallback, useMemo } from "react";
import { useVehicles } from "@/shared/hooks/useApi";
import { FleetFilterState } from "@/modules/fleet/components/FleetFilters";

interface UseFleetDataProps {
  pageSize: number;
  search: string;
  filters: FleetFilterState;
  sortBy: string;
  startDate?: string;
  endDate?: string;
}

export function useFleetData({ pageSize, search, filters, sortBy, startDate, endDate }: UseFleetDataProps) {
  const [limit, setLimit] = useState(pageSize);

  const { data: apiData, isLoading } = useVehicles({
    page: 1,
    per_page: limit,
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
        const d = ((v as any).description_fr || (v as any).description || "").toLowerCase();
        
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
          return ((v.seats || 0) >= 7) || t.includes("van") || t.includes("suv") || d.includes("famille") || d.includes("spacious");
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
    setLimit(pageSize);
  }, [pageSize]);

  const loadMore = useCallback(() => {
    setLimit((prev) => prev + pageSize);
  }, [pageSize]);

  const hasMore = apiData?.total ? limit < apiData.total : false;

  return {
    sorted,
    isLoading,
    loadMore,
    hasMore,
    totalCount: sorted.length
  };
}
