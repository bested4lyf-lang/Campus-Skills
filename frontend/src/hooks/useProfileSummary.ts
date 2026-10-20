import { useEffect, useState } from "react";
import { myServicesService } from "../services/myServicesService";
import type { ProfileSummary } from "../types/myServices";
import type { User } from "../types/user";

export function useProfileSummary(user: User | null) {
  const [summary, setSummary] = useState<ProfileSummary | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    myServicesService.getProfileSummary(user).then((data) => {
      if (!cancelled) setSummary(data);
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  return summary;
}