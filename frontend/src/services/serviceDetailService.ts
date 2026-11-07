import { apiGet, apiGetAll, apiSend } from "../api/client";
import { getToken } from "../api/authApi";
import type { RequestPayload, ServiceDetail, ServiceImage, ServiceReview } from "../types/serviceDetail";

interface ApiProvider {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  institution_name?: string | null;
  department?: string | null;
  level?: string | null;
}

interface ApiServiceDetail {
  id: number;
  title: string;
  description: string;
  starting_price: string;
  turnaround_time: string | null;
  cover_image: string | null;
  gallery_images: { id: number; image: string; caption?: string | null }[];
  category: { name: string } | null;
  provider: ApiProvider;
  average_rating: number | null;
  review_count: number | null;
}

interface ApiReview {
  id: number;
  rating: number;
  comment: string | null;
  is_verified: boolean;
  reviewer: { username: string; first_name: string; last_name: string };
}

interface ApiMyRequest {
  status: string;
  service: { id: number };
}

interface ApiListing {
  provider: { id: number };
}

const fullName = (p: { first_name: string; last_name: string; username: string }) =>
  `${p.first_name} ${p.last_name}`.trim() || p.username;

async function loadReviews(serviceId: string): Promise<ServiceReview[]> {
  try {
    const rows = await apiGetAll<ApiReview>(`/reviews/service/${serviceId}/`, 3);
    return rows.map((r) => ({
      id: String(r.id),
      reviewer: fullName(r.reviewer),
      rating: r.rating,
      comment: r.comment ?? "",
      verified: r.is_verified,
    }));
  } catch {
    return [];
  }
}

// There's no "listings by provider" filter, so search by the provider's username
// and count the rows that really belong to them.
async function countListings(provider: ApiProvider): Promise<number> {
  try {
    const rows = await apiGetAll<ApiListing>(`/services/?search=${encodeURIComponent(provider.username)}`, 5);
    return Math.max(1, rows.filter((row) => row.provider.id === provider.id).length);
  } catch {
    return 1;
  }
}

async function hasOpenRequest(serviceId: number): Promise<boolean> {
  if (!getToken()) return false;
  try {
    const rows = await apiGetAll<ApiMyRequest>("/requests/?view=my_hires");
    return rows.some(
      (row) => row.service.id === serviceId && (row.status === "pending" || row.status === "accepted"),
    );
  } catch {
    return false;
  }
}

/**
 *   get           -> GET  /api/services/<id>/, /api/reviews/service/<id>/, /api/requests/?view=my_hires
 *   createRequest -> POST /api/requests/ then POST /api/requests/<id>/attachments/ for each file
 */
export const serviceDetailService = {
  async get(id: string): Promise<ServiceDetail> {
    const service = await apiGet<ApiServiceDetail>(`/services/${id}/`);

    const [reviews, activeListings, hasActiveRequest] = await Promise.all([
      loadReviews(id),
      countListings(service.provider),
      hasOpenRequest(service.id),
    ]);

    const images: ServiceImage[] = [];
    if (service.cover_image) {
      images.push({ id: "cover", src: service.cover_image, alt: service.title });
    }
    for (const img of service.gallery_images ?? []) {
      images.push({ id: `g${img.id}`, src: img.image, alt: img.caption || service.title });
    }

    const reviewCount = service.review_count ?? 0;
    const p = service.provider;

    return {
      id: String(service.id),
      title: service.title,
      category: service.category?.name ?? "Other",
      description: service.description,
      price: Number(service.starting_price),
      turnaround: service.turnaround_time || "a few days",
      included: [], // the backend has no "what's included" field
      images,
      provider: {
        id: String(p.id),
        name: fullName(p),
        departmentLevel: [p.department, p.level].filter(Boolean).join(", "),
        bio: p.institution_name ? `Student at ${p.institution_name}.` : "",
        activeListings,
      },
      rating: reviewCount > 0 && service.average_rating ? service.average_rating : null,
      reviewCount,
      reviews,
      hasActiveRequest,
    };
  },

  async createRequest({ serviceId, brief, files }: RequestPayload): Promise<void> {
    const form = new FormData();
    form.append("service_id", serviceId);
    // The backend requires a brief, but the form says it's optional
    form.append("project_brief", brief || "No extra details provided.");
    const created = await apiSend<{ id: number }>("POST", "/requests/", form);

    // The request already exists, so one failed upload shouldn't make the whole send look failed
    await Promise.allSettled(
      files.map((file) => {
        const body = new FormData();
        body.append("file", file);
        return apiSend("POST", `/requests/${created.id}/attachments/`, body);
      }),
    );
  },
};