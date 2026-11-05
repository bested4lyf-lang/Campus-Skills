import { apiGetAll } from "../api/client";
import type { DiscoverCategory, ServiceCardData } from "../types/discover";

export const MIN_PRICE = 1000;
export const MAX_PRICE = 60000;

interface ApiCategory {
  id: number;
  name: string;
  slug: string;
}

interface ApiService {
  id: number;
  title: string;
  skill_tag: string | null;
  starting_price: string;
  cover_image: string | null;
  category: ApiCategory | null;
  provider: { id: number; username: string; first_name: string; last_name: string };
  average_rating: number | null;
  review_count: number | null;
  created_at: string;
}

function toCard(item: ApiService): ServiceCardData {
  const name = `${item.provider.first_name} ${item.provider.last_name}`.trim();
  return {
    id: item.id,
    title: item.title,
    skillTag: item.skill_tag ?? "",
    price: Number(item.starting_price),
    coverImage: item.cover_image,
    categoryName: item.category?.name ?? "Other",
    providerId: item.provider.id,
    providerName: name || item.provider.username,
    rating: item.average_rating ?? 0,
    reviewCount: item.review_count ?? 0,
    createdAt: item.created_at,
  };
}

export interface ServiceQuery {
  query: string;
  category: string;
  maxPrice: number;
}

export const discoverService = {
  /** GET /api/services/categories/ */
  async listCategories(): Promise<DiscoverCategory[]> {
    const rows = await apiGetAll<ApiCategory>("/services/categories/");
    return rows.map(({ id, name, slug }) => ({ id, name, slug }));
  },

  /** GET /api/services/?search=&category=&max_price= */
  async listServices({ query, category, maxPrice }: ServiceQuery): Promise<ServiceCardData[]> {
    const qs = new URLSearchParams();
    if (query) qs.set("search", query);
    if (category) qs.set("category", category);
    if (maxPrice < MAX_PRICE) qs.set("max_price", String(maxPrice));
    const suffix = qs.toString();

    const rows = await apiGetAll<ApiService>(`/services/${suffix ? `?${suffix}` : ""}`);
    return rows.map(toCard);
  },
};