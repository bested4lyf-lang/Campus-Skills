import { useEffect, useState } from "react";
import { discoverService } from "../services/discoverService";

/** Category names from the backend, for the create/edit service form. */
export function useCategoryNames(): string[] {
  const [names, setNames] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    discoverService
      .listCategories()
      .then((rows) => {
        if (!cancelled) setNames(rows.map((row) => row.name));
      })
      .catch(() => {
        // The select stays empty and the form asks for a category
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return names;
}