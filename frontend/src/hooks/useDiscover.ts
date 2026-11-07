import { useEffect, useMemo, useState } from "react";
import { MAX_PRICE, discoverService } from "../services/discoverService";
import type { DiscoverCategory, DiscoverInstitution, ServiceCardData, SortKey } from "../types/discover";

export function useDiscover(query: string) {
  const [category, setCategory] = useState("");
  const [institution, setInstitution] = useState("");
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [skill, setSkill] = useState("");
  const [sort, setSort] = useState<SortKey>("relevant");

  const [services, setServices] = useState<ServiceCardData[]>([]);
  const [categories, setCategories] = useState<DiscoverCategory[]>([]);
  const [institutions, setInstitutions] = useState<DiscoverInstitution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  // Fetch Categories and Universities on Mount
  useEffect(() => {
    let cancelled = false;

    discoverService
      .listCategories()
      .then((rows) => {
        if (!cancelled) setCategories(rows);
      })
      .catch(() => {});

    discoverService
      .listInstitutions()
      .then((rows) => {
        if (!cancelled) setInstitutions(rows);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  // Refetch when server-side filters change (query, category, institution, maxPrice)
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const timer = window.setTimeout(() => {
      discoverService
        .listServices({ query, category, institution, maxPrice })
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
  }, [query, category, institution, maxPrice, attempt]);

  const skills = useMemo(
    () => [...new Set(services.map((s) => s.skillTag).filter(Boolean))].sort(),
    [services],
  );

  const visible = useMemo(() => {
    const rows = services.filter((s) => !skill || s.skillTag === skill);
    const sorted = [...rows];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    if (sort === "newest") sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return sorted;
  }, [services, skill, sort]);

  const activeCount =
    (category ? 1 : 0) +
    (institution ? 1 : 0) +
    (skill ? 1 : 0) +
    (maxPrice < MAX_PRICE ? 1 : 0);

  const clearFilters = () => {
    setCategory("");
    setInstitution("");
    setSkill("");
    setMaxPrice(MAX_PRICE);
  };

  return {
    categories,
    institutions,
    skills,
    visible,
    loading,
    error,
    retry: () => setAttempt((n) => n + 1),
    category,
    institution,
    skill,
    maxPrice,
    sort,
    activeCount,
    setCategory,
    setInstitution,
    setSkill,
    setMaxPrice,
    setSort,
    clearFilters,
  };
}