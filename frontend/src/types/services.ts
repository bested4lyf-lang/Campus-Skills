export const CATEGORIES = [
  "Design & Creative",
  "Media",
  "Tech",
  "Academic",
  "Beauty & Fashion",
  "Marketing",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface ServiceProvider {
  id: string;
  name: string;
}

export interface Service {
  id: string;
  title: string;
  /** Usually one of CATEGORIES, but whatever the backend sends is kept. */
  category: string;
  coverImage: string | null;
  /** Naira */
  startingPrice: number;
  skills: string[];
  /** null when the service has no reviews yet */
  rating: number | null;
  reviewCount: number;
  provider: ServiceProvider;
}

export type SortOption = "relevant" | "price-asc" | "price-desc" | "rating";

export interface ServiceFilters {
  category: Category | "All";
  /** "" means all skills */
  skill: string;
  /** provider id, "" means all students */
  provider: string;
  maxPrice: number;
  sort: SortOption;
}

export type SetFilter = <K extends keyof ServiceFilters>(
  key: K,
  value: ServiceFilters[K],
) => void;
