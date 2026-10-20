import { useCallback, useEffect, useState } from "react";
import { myServicesService } from "../services/myServicesService";
import type { OwnService, ServiceFormValues } from "../types/myServices";

export function useMyServices() {
  const [services, setServices] = useState<OwnService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setServices(await myServicesService.list());
    } catch {
      setError("We couldn't load your services. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const createService = useCallback(async (values: ServiceFormValues) => {
    const created = await myServicesService.create(values);
    setServices((prev) => [created, ...prev]);
  }, []);

  const updateService = useCallback(async (id: string, values: ServiceFormValues) => {
    const updated = await myServicesService.update(id, values);
    setServices((prev) => prev.map((s) => (s.id === id ? updated : s)));
  }, []);

  const deleteService = useCallback(async (id: string) => {
    await myServicesService.remove(id);
    setServices((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return { services, loading, error, reload: load, createService, updateService, deleteService };
}