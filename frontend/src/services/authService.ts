import type { AuthUser } from "../types/auth";
import type { User } from "../types/user";
import { clearToken } from "../api/authApi";
import { absoluteUrl } from "../utils/media";

const USER_KEY = "campusskill:user";

/** Fired whenever the saved user changes, so the navbar can refresh. */
export const USER_UPDATED_EVENT = "campusskill:user-updated";

function mapAuthUser(user: AuthUser): User {
  return {
    id: String(user.id),
    fullName: `${user.first_name} ${user.last_name}`.trim() || user.username,
    department: user.profile?.department || undefined,
    level: user.profile?.level || undefined,
    photoUrl: absoluteUrl(user.profile?.avatar),
  };
}

function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);

    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function writeUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(USER_UPDATED_EVENT));
}

export const authService = {
  getCurrentUser,

  saveCurrentUser(user: AuthUser): void {
    writeUser(mapAuthUser(user));
  },

  /** Merge new details (for example a new photo) into the saved user. */
  updateCurrentUser(patch: Partial<User>): void {
    const current = getCurrentUser();
    if (!current) return;
    writeUser({ ...current, ...patch });
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