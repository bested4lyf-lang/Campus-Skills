import { useEffect, useState } from "react";
import { settingsService } from "../services/settingsService";
import type { AccountStatus } from "../types/settings";

export function useAccountStatus() {
  const [status, setStatus] = useState<AccountStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const result = await settingsService.getAccountStatus();
        if (!cancelled) setStatus(result);
      } catch {
        if (!cancelled) setError("We couldn't check your pending requests.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { status, isLoading, error };
}