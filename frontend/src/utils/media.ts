const API_BASE: string = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";
const ORIGIN = new URL(API_BASE).origin;

/** Uploaded pictures come back as "/media/..." paths, so add the server address. */
export function absoluteUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  return path.startsWith("http") ? path : `${ORIGIN}${path}`;
}