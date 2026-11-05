import { ApiError, getToken } from "./authApi";
import { authService } from "../services/authService";

const API_BASE: string = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";

export interface Page<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

function toApiError(status: number, data: unknown): ApiError {
  const body = (data && typeof data === "object" ? data : {}) as Record<string, unknown>;
  const fieldErrors: Record<string, string> = {};
  for (const [key, value] of Object.entries(body)) {
    if (key === "detail" || key === "error" || key === "non_field_errors") continue;
    fieldErrors[key] = Array.isArray(value) ? String(value[0]) : String(value);
  }
  const nonField = body.non_field_errors;
  const message =
    (status === 401 && "Please sign in to continue.") ||
    (typeof body.detail === "string" && body.detail) ||
    (typeof body.error === "string" && body.error) ||
    (Array.isArray(nonField) && String(nonField[0])) ||
    Object.values(fieldErrors)[0] ||
    "Something went wrong. Please try again.";
  return new ApiError(message, status, fieldErrors);
}

async function request<T>(path: string, init: RequestInit = {}, withAuth = true): Promise<T> {
  const headers = new Headers(init.headers);
  const token = withAuth ? getToken() : null;
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (typeof init.body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let res: Response;
  try {
    res = await fetch(path.startsWith("http") ? path : `${API_BASE}${path}`, { ...init, headers });
  } catch {
    throw new ApiError("Cannot reach the server. Check your connection and try again.", 0);
  }

  // A saved token that has expired makes even public endpoints answer 401:
  // drop it and retry once as a guest.
  if (res.status === 401 && token) {
    authService.logout();
    return request<T>(path, init, false);
  }

  if (res.status === 204) return undefined as T;

  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) throw toApiError(res.status, data);
  return data as T;
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>(path);
}

export function apiSend<T>(
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  body?: unknown,
): Promise<T> {
  const payload = body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body);
  return request<T>(path, { method, body: payload });
}

/** Fetches every page of a list endpoint and returns all the rows together. */
export async function apiGetAll<T>(path: string, maxPages = 20): Promise<T[]> {
  const all: T[] = [];
  let next: string | null = path;

  for (let i = 0; next !== null && i < maxPages; i += 1) {
    const data: Page<T> | T[] = await request<Page<T> | T[]>(next);
    if (Array.isArray(data)) return data;
    all.push(...data.results);
    next = data.next;
  }
  return all;
}