import { useEffect, useMemo, useState } from "react";
import { MAX_PRICE, discoverService } from "../services/discoverService";
import type { DiscoverCategory, ServiceCardData, SortKey } from "../types/discover";

export function useDiscover(query: string) {
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [skill, setSkill] = useState("");
  const [provider, setProvider] = useState("");
  const [sort, setSort] = useState<SortKey>("relevant");

  const [services, setServices] = useState<ServiceCardData[]>([]);
  const [categories, setCategories] = useState<DiscoverCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    discoverService
      .listCategories()
      .then((rows) => {
        if (!cancelled) setCategories(rows);
      })
      .catch(() => {
        // The category chips just stay empty; the services list still works
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Refetch when a server-side filter changes (short delay so the price slider doesn't spam requests)
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const timer = window.setTimeout(() => {
      discoverService
        .listServices({ query, category, maxPrice })
        .then((rows) => {
          if (!cancelled) setServices(rows);
        })
        .catch((e: unknown) => {
          if (!cancelled) setError(e instanceof Error ? e.message : "We couldn’t load services.");
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, category, maxPrice, attempt]);

  const skills = useMemo(
    () => [...new Set(services.map((s) => s.skillTag).filter(Boolean))].sort(),
    [services],
  );

  const providers = useMemo(() => {
    const byId = new Map<number, string>();
    services.forEach((s) => byId.set(s.providerId, s.providerName));
    return [...byId].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
  }, [services]);

  const visible = useMemo(() => {
    const rows = services.filter(
      (s) => (!skill || s.skillTag === skill) && (!provider || String(s.providerId) === provider),
    );
    const sorted = [...rows];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    if (sort === "newest") sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return sorted;
  }, [services, skill, provider, sort]);

  const activeCount =
    (category ? 1 : 0) + (skill ? 1 : 0) + (provider ? 1 : 0) + (maxPrice < MAX_PRICE ? 1 : 0);

  const clearFilters = () => {
    setCategory("");
    setSkill("");
    setProvider("");
    setMaxPrice(MAX_PRICE);
  };

  return {
    categories,
    skills,
    providers,
    visible,
    loading,
    error,
    retry: () => setAttempt((n) => n + 1),
    category,
    skill,
    provider,
    maxPrice,
    sort,
    activeCount,
    setCategory,
    setSkill,
    setProvider,
    setMaxPrice,
    setSort,
    clearFilters,
  };
}