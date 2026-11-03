import { useCallback, useEffect, useState } from "react";
import { activityService } from "../services/activityService";
import type { ActivityData, ReviewInput, ServiceRequest } from "../types/activity";

const EMPTY: ActivityData = { clientWork: [], myHires: [] };

export function useActivity() {
  const [data, setData] = useState<ActivityData>(EMPTY);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setData(await activityService.list());
    } catch {
      setError("We couldn't load your activity. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  // Swap one updated request into whichever list it belongs to
  const replace = useCallback((updated: ServiceRequest) => {
    const swap = (list: ServiceRequest[]) => list.map((r) => (r.id === updated.id ? updated : r));
    setData((current) => ({ clientWork: swap(current.clientWork), myHires: swap(current.myHires) }));
  }, []);

  const accept = useCallback(async (id: string) => replace(await activityService.accept(id)), [replace]);
  const decline = useCallback(async (id: string) => replace(await activityService.decline(id)), [replace]);
  const complete = useCallback(async (id: string) => replace(await activityService.complete(id)), [replace]);
  const submitReview = useCallback(
    async (id: string, input: ReviewInput) => replace(await activityService.submitReview(id, input)),
    [replace],
  );

  return { ...data, isLoading, error, reload: load, accept, decline, complete, submitReview };
}