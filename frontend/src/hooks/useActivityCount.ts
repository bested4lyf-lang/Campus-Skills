import { useEffect, useState } from "react";
import { apiGet } from "../api/client";
import type { Page } from "../api/client";
import { getToken } from "../api/authApi";

/** Number of requests waiting for the signed-in student to accept or decline. */
export function useActivityCount(): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!getToken()) return;
    let cancelled = false;

    apiGet<Page<unknown>>("/requests/?view=client_work&status=pending")
      .then((page) => {
        if (!cancelled) setCount(page.count);
      })
      .catch(() => {
        // The badge just stays hidden
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return count;
}