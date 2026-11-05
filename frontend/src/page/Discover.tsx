import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import Hero from "../component/discover/Hero";
import FilterPanel from "../component/discover/FilterPanel";
import ServiceCard from "../component/discover/ServiceCard";
import { useDiscover } from "../hooks/useDiscover";
import type { SortKey } from "../types/discover";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "relevant", label: "Most relevant" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

export default function Discover() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const d = useDiscover(query);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleSearch = (q: string) => {
    setParams(q ? { q } : {});
  };

  const clearAll = () => {
    d.clearFilters();
    setParams({});
  };

  const filterProps = {
    categories: d.categories,
    skills: d.skills,
    providers: d.providers,
    category: d.category,
    skill: d.skill,
    provider: d.provider,
    maxPrice: d.maxPrice,
    onCategory: d.setCategory,
    onSkill: d.setSkill,
    onProvider: d.setProvider,
    onMaxPrice: d.setMaxPrice,
    onClear: clearAll,
  };

  const count = d.visible.length;

  return (
    <>
      {/* key resets the input when the URL changes (back button, Clear all) */}
      <Hero key={query} initialQuery={query} onSearch={handleSearch} />

      <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-6 md:py-8 lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-20 rounded-xl border border-line bg-surface p-5">
            <FilterPanel {...filterProps} />
          </div>
        </aside>

        <section aria-label="Services" className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-ink-900">
              {d.loading ? "Loading services…" : `${count} ${count === 1 ? "service" : "services"} available`}
            </h2>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-brand-600 px-3.5 py-2 text-sm font-semibold text-brand-700 lg:hidden"
              >
                <SlidersHorizontal aria-hidden="true" className="size-4" />
                {d.activeCount > 0 ? `Filters (${d.activeCount} active)` : "Filters"}
              </button>

              <label className="flex items-center gap-2 text-sm text-ink-500">
                Sort by
                <select
                  value={d.sort}
                  onChange={(e) => d.setSort(e.target.value as SortKey)}
                  className="rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink-900"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {d.error && (
            <div role="alert" className="mt-6 rounded-xl border border-danger-100 bg-danger-50 p-5 text-sm text-danger-800">
              <p>{d.error}</p>
              <button type="button" onClick={d.retry} className="mt-2 font-semibold underline">
                Try again
              </button>
            </div>
          )}

          {d.loading && !d.error && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="h-72 animate-pulse rounded-xl border border-line bg-surface-subtle" />
              ))}
            </div>
          )}

          {!d.loading && !d.error && count === 0 && (
            <div className="mt-6 rounded-xl border border-dashed border-line bg-surface p-10 text-center">
              <p className="font-semibold text-ink-900">No services match your filters.</p>
              <button type="button" onClick={clearAll} className="mt-2 text-sm font-semibold text-brand-700 hover:underline">
                Clear all filters
              </button>
            </div>
          )}

          {!d.loading && !d.error && count > 0 && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {d.visible.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Mobile filter sheet */}
      {sheetOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-ink-900/40 lg:hidden"
          onClick={() => setSheetOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] w-full overflow-y-auto rounded-t-2xl bg-surface p-5"
          >
            <button
              type="button"
              aria-label="Close filters"
              onClick={() => setSheetOpen(false)}
              className="float-right flex size-9 items-center justify-center rounded-lg border border-line"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
            <FilterPanel {...filterProps} />
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              className="mt-6 w-full rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Show {count} {count === 1 ? "service" : "services"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}