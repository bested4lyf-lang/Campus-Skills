import { useState } from "react";
import type { FormEvent } from "react";
import { Search } from "lucide-react";

interface HeroProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
}

export default function Hero({ initialQuery = "", onSearch }: HeroProps) {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <section aria-labelledby="hero-title" className="bg-brand-900">
      <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-6 md:py-14">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent-400">
          Student marketplace
        </p>

        <h1
          id="hero-title"
          className="mt-3 max-w-xl font-display text-[32px] font-extrabold leading-9 text-white md:text-[44px] md:leading-12"
        >
          Hire a classmate. Or get hired by one.
        </h1>

        <p className="mt-4 max-w-[30rem] text-sm leading-6 text-brand-200 md:text-base">
          Browse services from students on your campus: design, photography,
          tutoring, braids and more.
        </p>

        <form
          role="search"
          onSubmit={handleSubmit}
          className="mt-6 flex max-w-[720px] items-center gap-2 rounded-xl bg-surface p-1.5 shadow-popover focus-within:ring-4 focus-within:ring-brand-500/40 md:mt-8"
        >
          <label htmlFor="hero-search" className="sr-only">
            Search services
          </label>
          <Search
            aria-hidden="true"
            className="ml-3 size-4 shrink-0 text-ink-400"
          />
          <input
            id="hero-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search flyers, tutoring, braids, websites..."
            className="min-w-0 flex-1 text-ellipsis bg-transparent py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            Search
          </button>
        </form>
      </div>
    </section>
  );
}
