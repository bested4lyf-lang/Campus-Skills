import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import Hero from "../component/discover/Hero";
import BottomSheet from "../component/ui/BottomSheet";
import Select from "../component/ui/Select";
import FilterFields from "../component/services/FilterFields";
import FilterSidebar from "../component/services/FilterSidebar";
import ServiceGrid from "../component/services/ServiceGrid";
import { useServices } from "../hooks/useServices";
import {
  PRICE_MAX,
  PRICE_MIN,
  useServiceFilters,
} from "../hooks/useServiceFilters";
import type { SortOption } from "../types/services";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevant", label: "Most relevant" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

export default function Discover() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";

  const { services, isLoading, error, reload } = useServices();
  const { filters, setFilter, clear, visible, options, activeCount } =
    useServiceFilters(services, query);

  const [sheetOpen, setSheetOpen] = useState(false);
  const closeSheet = useCallback(() => setSheetOpen(false), []);

  const handleSearch = (q: string) => setParams(q ? { q } : {});

  const clearAll = () => {
    clear();
    setParams({});
  };

  const fieldProps = {
    filters,
    skills: options.skills,
    providers: options.providers,
    priceMin: PRICE_MIN,
    priceMax: PRICE_MAX,
    onChange: setFilter,
  };

  const heading = isLoading
    ? "Loading services…"
    : error
      ? "Services"
      : `${visible.length} service${visible.length === 1 ? "" : "s"} available`;

  return (
    <>
      {/* key resets the input when the URL changes (back button, Clear all) */}
      <Hero key={query} initialQuery={query} onSearch={handleSearch} />

      <div className="mx-auto grid max-w-[1440px] gap-6 px-4 py-6 md:px-6 lg:grid-cols-[240px_1fr]">
        <FilterSidebar
          {...fieldProps}
          activeCount={activeCount}
          onClear={clear}
        />

        <section aria-labelledby="results-title" className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2
              id="results-title"
              aria-live="polite"
              className="w-full font-display text-xl font-bold text-ink-900 sm:w-auto"
            >
              {heading}
            </h2>

            <div className="flex w-full items-center gap-3 sm:w-auto">
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="inline-flex shrink-0 items-center gap-2 rounded-md border border-line bg-surface px-3.5 py-2.5 text-sm font-semibold text-ink-900 hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 lg:hidden"
              >
                <SlidersHorizontal aria-hidden="true" className="size-4" />
                Filters{activeCount > 0 && ` (${activeCount} active)`}
              </button>

              <label
                htmlFor="sort"
                className="hidden shrink-0 text-sm text-ink-500 sm:block"
              >
                Sort by
              </label>
              <Select
                id="sort"
                ariaLabel="Sort services"
                className="min-w-0 flex-1 sm:w-44 sm:flex-none"
                value={filters.sort}
                onChange={(v) => setFilter("sort", v as SortOption)}
                options={SORT_OPTIONS}
              />
            </div>
          </div>

          <ServiceGrid
            services={visible}
            isLoading={isLoading}
            error={error}
            hasAnyServices={services.length > 0}
            isNarrowed={activeCount > 0 || query !== ""}
            onRetry={reload}
            onClearFilters={clearAll}
          />
        </section>
      </div>

      <BottomSheet
        open={sheetOpen}
        title="Filters"
        onClose={closeSheet}
        footer={
          <>
            <button
              type="button"
              onClick={clear}
              disabled={activeCount === 0}
              className="rounded-md bg-surface-subtle px-4 py-2.5 text-sm font-semibold text-ink-700 hover:bg-line disabled:opacity-50"
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={closeSheet}
              className="flex-1 rounded-md bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Show {visible.length} service{visible.length === 1 ? "" : "s"}
            </button>
          </>
        }
      >
        <FilterFields {...fieldProps} />
      </BottomSheet>
    </>
  );
}
