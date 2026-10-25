import { useCallback, useEffect, useState } from "react";
import { serviceDetailService } from "../services/serviceDetailService";
import type { RequestPayload, ServiceDetail } from "../types/serviceDetail";

export function useServiceDetail(id: string | undefined) {
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!id) {
      setError("This service could not be found.");
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    serviceDetailService
      .get(id)
      .then((data) => {
        if (!cancelled) setService(data);
      })
      .catch(() => {
        if (!cancelled) setError("We couldn't load this service. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  // After a successful request the button must switch to "Request sent" without a reload
  const sendRequest = useCallback(async (payload: RequestPayload) => {
    await serviceDetailService.createRequest(payload);
    setService((current) => (current ? { ...current, hasActiveRequest: true } : current));
  }, []);

  return { service, isLoading, error, reload, sendRequest };
}