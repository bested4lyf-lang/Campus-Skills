export interface DiscoverCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ServiceCardData {
  id: number;
  title: string;
  skillTag: string;
  price: number;
  coverImage: string | null;
  categoryName: string;
  providerId: number;
  providerName: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export type SortKey = "relevant" | "newest" | "price-asc" | "price-desc" | "rating";