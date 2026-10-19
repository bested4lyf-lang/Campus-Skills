
import type { AuthUser } from "../types/auth";
import type { User } from "../types/user";
import { clearToken } from "../api/authApi";

const USER_KEY = "campusskill:user";

function mapAuthUser(user: AuthUser): User {
  return {
    id: String(user.id),
    fullName: `${user.first_name} ${user.last_name}`.trim(),
  };
}

export const authService = {
  getCurrentUser(): User | null {
    try {
      const raw = localStorage.getItem(USER_KEY);

      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  },

  saveCurrentUser(user: AuthUser): void {
    const frontendUser = mapAuthUser(user);

    localStorage.setItem(USER_KEY, JSON.stringify(frontendUser));
  },

  logout(): void {
    try {
      localStorage.removeItem(USER_KEY);
      clearToken();
    } catch {
      // Storage may be unavailable.
    }
  },
};
