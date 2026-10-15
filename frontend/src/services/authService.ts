import type { User } from "../types/user";

const KEY = "campusskill:user";

// Placeholder: swap these for real calls to your Django API (/api/...).
export const authService = {
  getCurrentUser(): User | null {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  },

  logout(): void {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* storage unavailable */
    }
  },
};
