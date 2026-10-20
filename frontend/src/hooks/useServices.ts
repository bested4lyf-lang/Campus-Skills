import { useCallback, useEffect, useState } from "react";
import { servicesService } from "../services/service";
import type { Service } from "../types/services";

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    servicesService
      .list(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setServices(data);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Something went wrong");
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [attempt]);

  const reload = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setAttempt((n) => n + 1);
  }, []);

  return { services, isLoading, error, reload };
}
