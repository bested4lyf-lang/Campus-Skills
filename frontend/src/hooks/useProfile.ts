import { useCallback, useEffect, useState } from "react";
import { ProfileNotFoundError, profileService } from "../services/profileService";
import type { ProfileFormValues, StudentProfile } from "../types/profile";
import type { User } from "../types/user";

export type ProfileLoadState = "loading" | "ready" | "notFound" | "error";

export function useProfile(id: string | undefined, viewer: User | null) {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [state, setState] = useState<ProfileLoadState>("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setState("loading");

    profileService
      .get(id, viewer)
      .then((data) => {
        if (cancelled) return;
        setProfile(data);
        setState("ready");
      })
      .catch((err: unknown) => {
        if (!cancelled) setState(err instanceof ProfileNotFoundError ? "notFound" : "error");
      });

    return () => {
      cancelled = true;
    };
  }, [id, viewer, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  const save = useCallback(
    async (values: ProfileFormValues) => {
      if (!viewer) throw new Error("Sign in to edit your profile.");
      setProfile(await profileService.updateOwn(viewer, values));
    },
    [viewer],
  );

  return { profile, state, reload, save };
}