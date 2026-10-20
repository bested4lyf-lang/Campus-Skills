import { apiGet } from "../api/api";
import type { Service } from "../types/services";

// ASSUMED shape of GET /api/services/ (Django REST style).
// If your serializer uses different field names, change them here only.
interface ApiService {
  id: number | string;
  title: string;
  category: string;
  cover_image?: string | null;
  starting_price: number | string; // DRF decimals arrive as strings
  skills?: string[];
  rating_average?: number | string | null;
  rating_count?: number;
  provider: { id: number | string; full_name: string };
}

// Plain array, or DRF pagination: { count, next, previous, results }
type ApiList<T> = T[] | { results: T[]; next?: string | null };

// Safety cap so a misbehaving backend can't loop forever.
const MAX_PAGES = 50;

function toService(a: ApiService): Service {
  const rating = a.rating_average == null ? null : Number(a.rating_average);
  return {
    id: String(a.id),
    title: a.title,
    category: a.category,
    coverImage: a.cover_image ?? null,
    startingPrice: Number(a.starting_price),
    skills: a.skills ?? [],
    rating: rating !== null && Number.isFinite(rating) ? rating : null,
    reviewCount: a.rating_count ?? 0,
    provider: { id: String(a.provider.id), name: a.provider.full_name },
  };
}

export const servicesService = {
  async list(signal?: AbortSignal): Promise<Service[]> {
    // Filtering happens in the browser, so load every page up front.
    const all: ApiService[] = [];
    for (let page = 1; page <= MAX_PAGES; page++) {
      const data = await apiGet<ApiList<ApiService>>(
        `/services/?page=${page}`,
        signal,
      );
      if (Array.isArray(data)) return data.map(toService); // not paginated
      all.push(...data.results);
      if (!data.next) break;
    }
    return all.map(toService);
  },
};
