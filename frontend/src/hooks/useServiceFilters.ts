import { useCallback, useMemo, useState } from "react";
import type { Service, ServiceFilters, SetFilter } from "../types/services";

export const PRICE_MIN = 1000;
export const PRICE_MAX = 60000;

const DEFAULT_FILTERS: ServiceFilters = {
  category: "All",
  skill: "",
  provider: "",
  maxPrice: PRICE_MAX,
  sort: "relevant",
};

function matchesQuery(service: Service, tokens: string[]): boolean {
  if (tokens.length === 0) return true;
  const haystack = [
    service.title,
    service.category,
    service.provider.name,
    ...service.skills,
  ]
    .join(" ")
    .toLowerCase();
  return tokens.every((t) => haystack.includes(t));
}

function relevance(service: Service, q: string): number {
  const title = service.title.toLowerCase();
  if (title.startsWith(q)) return 3;
  if (title.includes(q)) return 2;
  if (service.skills.some((k) => k.toLowerCase().includes(q))) return 1;
  return 0;
}

/**
 * Filters and sorts in the browser. Fine for a campus-sized list;
 * move to query params on /api/services/ if it grows into the thousands.
 */
export function useServiceFilters(services: Service[], query: string) {
  const [filters, setFilters] = useState<ServiceFilters>(DEFAULT_FILTERS);

  const setFilter: SetFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  /** Resets the filters but keeps the chosen sort order. */
  const clear = useCallback(() => {
    setFilters((prev) => ({ ...DEFAULT_FILTERS, sort: prev.sort }));
  }, []);

  const options = useMemo(() => {
    const skills = [...new Set(services.flatMap((s) => s.skills))].sort(
      (a, b) => a.localeCompare(b),
    );
    const byId = new Map(services.map((s) => [s.provider.id, s.provider]));
    const providers = [...byId.values()].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    return { skills, providers };
  }, [services]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const tokens = q ? q.split(/\s+/) : [];

    const list = services.filter(
      (s) =>
        matchesQuery(s, tokens) &&
        (filters.category === "All" || s.category === filters.category) &&
        (!filters.skill || s.skills.includes(filters.skill)) &&
        (!filters.provider || s.provider.id === filters.provider) &&
        // slider at its max means "no price limit", so pricier services stay visible
        (filters.maxPrice >= PRICE_MAX || s.startingPrice <= filters.maxPrice),
    );

    switch (filters.sort) {
      case "price-asc":
        return list.sort((a, b) => a.startingPrice - b.startingPrice);
      case "price-desc":
        return list.sort((a, b) => b.startingPrice - a.startingPrice);
      case "rating":
        return list.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
      default:
        return q ? list.sort((a, b) => relevance(b, q) - relevance(a, q)) : list;
    }
  }, [services, query, filters]);

  const activeCount =
    (filters.category !== "All" ? 1 : 0) +
    (filters.skill ? 1 : 0) +
    (filters.provider ? 1 : 0) +
    (filters.maxPrice < PRICE_MAX ? 1 : 0);

  return { filters, setFilter, clear, visible, options, activeCount };
}
