import { apiGet, apiGetAll, apiSend } from "../api/client";
import type { Page } from "../api/client";
import type { ProfileFormValues, ProfileListing, ProfileReview, StudentProfile } from "../types/profile";
import type { User } from "../types/user";

const API_BASE: string = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";
const ORIGIN = new URL(API_BASE).origin;

export class ProfileNotFoundError extends Error {
  constructor() {
    super("This student could not be found.");
    this.name = "ProfileNotFoundError";
  }
}

interface ApiPerson {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}

interface ApiProfileUser extends ApiPerson {
  profile: {
    department?: string | null;
    level?: string | null;
    bio?: string | null;
    avatar?: string | null;
    whatsapp_number?: string | null;
    skills?: string[] | null;
  } | null;
}

interface ApiListing {
  id: number;
  title: string;
  skill_tag: string | null;
  starting_price: string;
  category: { name: string } | null;
  average_rating: number | null;
  review_count: number | null;
  provider: ApiPerson & { avatar?: string | null; department?: string | null; level?: string | null };
}

interface ApiProviderReview {
  id: number;
  service_title?: string | null;
  rating: number;
  comment: string | null;
  is_verified: boolean;
  reviewer: ApiPerson;
}

const fullName = (p: ApiPerson) => `${p.first_name} ${p.last_name}`.trim() || p.username;

// Uploaded pictures come back as "/media/..." paths, so add the server address
function absoluteUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  return path.startsWith("http") ? path : `${ORIGIN}${path}`;
}

// "+2348035550142" or "08035550142" -> "8035550142" (the form shows ten digits after +234)
function tenDigits(raw: string | null | undefined): string {
  const digits = (raw ?? "").replace(/\D/g, "");
  if (digits.startsWith("234")) return digits.slice(3);
  if (digits.startsWith("0")) return digits.slice(1);
  return digits;
}

const average = (reviews: ProfileReview[]) =>
  reviews.length === 0 ? null : Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10;

function toListing(row: ApiListing): ProfileListing {
  const count = row.review_count ?? 0;
  return {
    id: String(row.id),
    title: row.title,
    category: row.category?.name ?? "Other",
    price: Number(row.starting_price),
    rating: count > 0 && row.average_rating ? row.average_rating : null,
    reviewCount: count,
  };
}

async function loadReviews(username: string): Promise<ProfileReview[]> {
  try {
    const rows = await apiGetAll<ApiProviderReview>(`/reviews/provider/${encodeURIComponent(username)}/`, 5);
    return rows.map((r) => ({
      id: String(r.id),
      reviewer: fullName(r.reviewer),
      rating: r.rating,
      comment: r.comment ?? "",
      serviceTitle: r.service_title ?? "",
      verified: r.is_verified,
    }));
  } catch {
    return [];
  }
}

async function loadOwn(): Promise<StudentProfile> {
  const me = await apiGet<ApiProfileUser>("/auth/profile/");
  const [listingRows, reviews, completed] = await Promise.all([
    apiGetAll<ApiListing>("/services/?my_services=true"),
    loadReviews(me.username),
    apiGet<Page<unknown>>("/requests/?view=client_work&status=completed")
      .then((page) => page.count)
      .catch(() => 0),
  ]);
  const p = me.profile;

  return {
    id: String(me.id),
    fullName: fullName(me),
    department: p?.department ?? "",
    level: p?.level ?? "",
    bio: p?.bio ?? "",
    skills: p?.skills ?? [],
    whatsapp: tenDigits(p?.whatsapp_number),
    photoUrl: absoluteUrl(p?.avatar),
    jobsDone: completed,
    rating: average(reviews),
    reviewCount: reviews.length,
    listings: listingRows.map(toListing),
    reviews,
  };
}

// There's no "student by id" endpoint yet, so another student's profile is
// rebuilt from their service listings and the reviews they received.
async function loadOther(id: string): Promise<StudentProfile> {
  const rows = await apiGetAll<ApiListing>("/services/");
  const theirs = rows.filter((row) => String(row.provider.id) === id);
  if (theirs.length === 0) throw new ProfileNotFoundError();

  const provider = theirs[0].provider;
  const reviews = await loadReviews(provider.username);
  const skills = [
    ...new Set(
      theirs.flatMap((row) =>
        (row.skill_tag ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      ),
    ),
  ];

  return {
    id,
    fullName: fullName(provider),
    department: provider.department ?? "",
    level: provider.level ?? "",
    bio: "",
    skills,
    whatsapp: "", // only ever shown to the owner
    photoUrl: absoluteUrl(provider.avatar),
    jobsDone: reviews.length,
    rating: average(reviews),
    reviewCount: reviews.length,
    listings: theirs.map(toListing),
    reviews,
  };
}

/**
 *   get       -> GET   /api/auth/profile/ (own) or /api/services/ + /api/reviews/provider/<username>/ (others)
 *   updateOwn -> PATCH /api/auth/profile/ (JSON fields, then the photo as a separate upload)
 */
export const profileService = {
  async get(id: string, viewer: User | null): Promise<StudentProfile> {
    if (viewer && viewer.id === id) return loadOwn();
    return loadOther(id);
  },

  async updateOwn(_viewer: User, values: ProfileFormValues): Promise<StudentProfile> {
    if (values.skills.length === 0) throw new Error("Add at least one skill.");

    await apiSend("PATCH", "/auth/profile/", {
      department: values.department,
      level: values.level,
      bio: values.bio,
      whatsapp_number: values.whatsapp ? `+234${values.whatsapp}` : "",
      skills: values.skills,
    });

    // The photo is a data URL until it's uploaded
    if (values.photoUrl?.startsWith("data:")) {
      const blob = await (await fetch(values.photoUrl)).blob();
      const form = new FormData();
      form.append("avatar", new File([blob], "avatar.jpg", { type: blob.type || "image/jpeg" }));
      await apiSend("PATCH", "/auth/profile/", form);
    }

    return loadOwn();
  },
};