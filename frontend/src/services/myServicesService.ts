import { apiGet, apiGetAll, apiSend } from "../api/client";
import type { Page } from "../api/client";
import type { OwnService, ProfileSummary, ServiceFormValues } from "../types/myServices";
import type { User } from "../types/user";

interface ApiCategory {
  id: number;
  name: string;
}

interface ApiOwnService {
  id: number;
  title: string;
  skill_tag: string | null;
  description?: string | null;
  starting_price: string;
  cover_image: string | null;
  category: ApiCategory | null;
  average_rating: number | null;
  review_count: number | null;
}

interface ApiMe {
  username: string;
  profile: { bio?: string | null; skills?: string[] | null } | null;
}

const toSkills = (tag: string | null) =>
  (tag ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

function toOwnService(row: ApiOwnService): OwnService {
  const reviewCount = row.review_count ?? 0;
  return {
    id: String(row.id),
    title: row.title,
    category: row.category?.name ?? "",
    skills: toSkills(row.skill_tag),
    price: Number(row.starting_price),
    description: row.description ?? "",
    coverImageUrl: row.cover_image ?? undefined,
    rating: reviewCount > 0 && row.average_rating ? row.average_rating : null,
    reviewCount,
  };
}

async function categoryId(name: string): Promise<number> {
  const categories = await apiGetAll<ApiCategory>("/services/categories/");
  const match = categories.find((c) => c.name.toLowerCase() === name.toLowerCase());
  if (!match) throw new Error("Please choose a category from the list.");
  return match.id;
}

async function toFormData(values: ServiceFormValues): Promise<FormData> {
  const form = new FormData();
  form.append("title", values.title);
  form.append("category_id", String(await categoryId(values.category)));
  // The backend keeps one skill_tag text field, so the skills are stored comma-separated
  form.append("skill_tag", values.skills.join(", ").slice(0, 100));
  form.append("description", values.description);
  form.append("starting_price", String(values.price));
  if (values.coverImage) form.append("cover_image", values.coverImage);
  return form;
}

/**
 *   list   -> GET    /api/services/?my_services=true (then each service's detail, for its description)
 *   create -> POST   /api/services/
 *   update -> PATCH  /api/services/<id>/
 *   remove -> DELETE /api/services/<id>/
 */
export const myServicesService = {
  async list(): Promise<OwnService[]> {
    const rows = await apiGetAll<{ id: number }>("/services/?my_services=true");
    const details = await Promise.all(rows.map((row) => apiGet<ApiOwnService>(`/services/${row.id}/`)));
    return details.map(toOwnService);
  },

  async create(values: ServiceFormValues): Promise<OwnService> {
    const created = await apiSend<{ id: number }>("POST", "/services/", await toFormData(values));
    return toOwnService(await apiGet<ApiOwnService>(`/services/${created.id}/`));
  },

  async update(id: string, values: ServiceFormValues): Promise<OwnService> {
    const row = await apiSend<ApiOwnService>("PATCH", `/services/${id}/`, await toFormData(values));
    return toOwnService(row);
  },

  async remove(id: string): Promise<void> {
    await apiSend<void>("DELETE", `/services/${id}/`);
  },

  async getProfileSummary(_user: User): Promise<ProfileSummary> {
    const me = await apiGet<ApiMe>("/auth/profile/");
    const [pending, completed, hires, reviews] = await Promise.all([
      apiGet<Page<unknown>>("/requests/?view=client_work&status=pending"),
      apiGet<Page<unknown>>("/requests/?view=client_work&status=completed"),
      apiGet<Page<unknown>>("/requests/?view=my_hires"),
      apiGetAll<{ rating: number }>(`/reviews/provider/${encodeURIComponent(me.username)}/`, 5).catch(
        () => [] as { rating: number }[],
      ),
    ]);

    const rating =
      reviews.length > 0
        ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
        : null;

    return {
      bio: me.profile?.bio ?? "",
      skills: me.profile?.skills ?? [],
      jobsDone: completed.count,
      rating,
      pendingClientWork: pending.count,
      totalHires: hires.count,
    };
  },
};