import { useSearchParams } from "react-router-dom";
import Hero from "../component/discover/Hero";

export default function Discover() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";

  const handleSearch = (q: string) => {
    setParams(q ? { q } : {});
  };

  return (
    <>
      {/* key resets the input when the URL changes (back button, Clear all) */}
      <Hero key={query} initialQuery={query} onSearch={handleSearch} />

      {/* TODO: FilterPanel + ServiceCard grid, filtered by `query` */}
      <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-6">
        <p className="text-sm text-ink-500">
          {query ? `Results for "${query}" will show here.` : "Services will show here."}
        </p>
      </div>
    </>
  );
}
