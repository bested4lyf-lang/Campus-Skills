import { useCallback, useEffect, useState } from "react";
import { USER_UPDATED_EVENT, authService } from "../services/authService";
import type { User } from "../types/user";

export function useAuth() {
  const [user, setUser] = useState<User | null>(() =>
    authService.getCurrentUser(),
  );

  // Refresh when the saved user changes (for example after editing the profile)
  useEffect(() => {
    const refresh = () => setUser(authService.getCurrentUser());
    window.addEventListener(USER_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(USER_UPDATED_EVENT, refresh);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  return { user, isAuthenticated: user !== null, logout };
}