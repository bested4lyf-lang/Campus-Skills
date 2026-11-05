import { apiGet, apiGetAll, apiSend } from "../api/client";
import { authService } from "./authService";
import type { ActivityData, RequestAttachment, RequestStatus, ReviewInput, ServiceRequest } from "../types/activity";

interface ApiPerson {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  department?: string | null;
  institution_short_code?: string | null;
  /** Empty until the request is accepted (depends on the student's privacy setting) */
  whatsapp_number?: string | null;
}

interface ApiAttachment {
  id: number;
  file_name: string;
}

interface ApiRequest {
  id: number;
  status: RequestStatus;
  service: { id: number; title: string };
  customer: ApiPerson;
  provider: ApiPerson;
  agreed_price: string;
  project_brief: string;
  needed_by: string | null;
  campus_location: string;
  attachments: ApiAttachment[] | null;
  created_at: string;
}

type Role = "client-work" | "my-hires";

/** "0803 555 0142" or "803..." -> "+2348035550142" */
function toInternational(raw: string | null | undefined): string | undefined {
  const digits = (raw ?? "").replace(/[^\d+]/g, "");
  if (!digits) return undefined;
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("234")) return `+${digits}`;
  if (digits.startsWith("0")) return `+234${digits.slice(1)}`;
  return `+234${digits}`;
}

function toAttachment(file: ApiAttachment): RequestAttachment {
  return {
    id: String(file.id),
    name: file.file_name,
    kind: /\.pdf$/i.test(file.file_name) ? "pdf" : "image",
  };
}

function toRequest(row: ApiRequest, role: Role, reviewed: boolean): ServiceRequest {
  // Client work: the other student is the customer. My hires: it's the provider.
  const other = role === "client-work" ? row.customer : row.provider;
  const name = `${other.first_name} ${other.last_name}`.trim() || other.username;

  return {
    id: String(row.id),
    status: row.status,
    serviceTitle: row.service.title,
    price: Number(row.agreed_price),
    requestedAt: row.created_at,
    neededBy: row.needed_by ?? "",
    campusLocation: row.campus_location || "Not specified",
    brief: row.project_brief,
    attachments: (row.attachments ?? []).map(toAttachment),
    person: {
      id: String(other.id),
      name,
      departmentLevel: [other.department, other.institution_short_code].filter(Boolean).join(" • "),
      whatsapp: toInternational(other.whatsapp_number),
    },
    reviewed,
  };
}

// The request itself doesn't say whether it has a review, so look at the reviews
// of each completed service and see whether one of them is mine.
async function reviewedServices(rows: ApiRequest[]): Promise<Set<number>> {
  const me = Number(authService.getCurrentUser()?.id);
  const done = new Set<number>();
  const serviceIds = [...new Set(rows.filter((r) => r.status === "completed").map((r) => r.service.id))];

  await Promise.all(
    serviceIds.map(async (serviceId) => {
      try {
        const reviews = await apiGetAll<{ reviewer: { id: number } }>(`/reviews/service/${serviceId}/`, 3);
        if (reviews.some((review) => review.reviewer.id === me)) done.add(serviceId);
      } catch {
        // If this lookup fails the hire simply shows as not reviewed yet
      }
    }),
  );
  return done;
}

async function transition(id: string, status: "accepted" | "rejected" | "completed"): Promise<ServiceRequest> {
  const row = await apiSend<ApiRequest>("PATCH", `/requests/${id}/status/`, { status });
  return toRequest(row, "client-work", false);
}

/**
 *   list         -> GET   /api/requests/?view=client_work and ?view=my_hires
 *   accept/decline/complete -> PATCH /api/requests/<id>/status/  { status }
 *   submitReview -> POST  /api/reviews/  { request_id, rating, standout_tags, comment }
 * The backend enforces the rules (only the provider can change status, only completed
 * requests can be reviewed, once), and its error messages are shown as they come.
 */
export const activityService = {
  async list(): Promise<ActivityData> {
    const [clientRows, hireRows] = await Promise.all([
      apiGetAll<ApiRequest>("/requests/?view=client_work"),
      apiGetAll<ApiRequest>("/requests/?view=my_hires"),
    ]);
    const reviewed = await reviewedServices(hireRows);

    return {
      clientWork: clientRows.map((row) => toRequest(row, "client-work", false)),
      myHires: hireRows.map((row) => toRequest(row, "my-hires", reviewed.has(row.service.id))),
    };
  },

  accept: (id: string) => transition(id, "accepted"),
  decline: (id: string) => transition(id, "rejected"),
  complete: (id: string) => transition(id, "completed"),

  async submitReview(id: string, input: ReviewInput): Promise<ServiceRequest> {
    await apiSend("POST", "/reviews/", {
      request_id: Number(id),
      rating: input.rating,
      standout_tags: input.highlights,
      comment: input.comment,
    });
    const row = await apiGet<ApiRequest>(`/requests/${id}/`);
    return toRequest(row, "my-hires", true);
  },
};