import { useCallback, useState } from "react";
import { authService } from "../services/authService";
import type { User } from "../types/user";

export function useAuth() {
  const [user, setUser] = useState<User | null>(() =>
    authService.getCurrentUser(),
  );

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  return { user, isAuthenticated: user !== null, logout };
}
