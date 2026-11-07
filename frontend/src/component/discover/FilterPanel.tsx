import { MAX_PRICE, MIN_PRICE } from "../../services/discoverService";
import { formatNaira } from "../../utils/format";
import type { DiscoverCategory, DiscoverInstitution } from "../../types/discover";

export interface FilterPanelProps {
  categories: DiscoverCategory[];
  institutions: DiscoverInstitution[];
  skills: string[];
  providers: { id: number; name: string }[];
  category: string;
  institution: string;
  skill: string;
  provider: string;
  maxPrice: number;
  onCategory: (slug: string) => void;
  onInstitution: (code: string) => void;
  onSkill: (skill: string) => void;
  onProvider: (id: string) => void;
  onMaxPrice: (value: number) => void;
  onClear: () => void;
}

const selectClass =
  "mt-2 w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-500";

export default function FilterPanel({
  categories,
  institutions,
  skills,
  providers,
  category,
  institution,
  skill,
  provider,
  maxPrice,
  onCategory,
  onInstitution,
  onSkill,
  onProvider,
  onMaxPrice,
  onClear,
}: FilterPanelProps) {
  const chips = [{ slug: "", name: "All" }, ...categories.map(({ slug, name }) => ({ slug, name }))];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink-900">Filters</h2>
        <button type="button" onClick={onClear} className="text-sm font-semibold text-brand-700 hover:underline">
          Clear all
        </button>
      </div>

      {/* Campus / University Filter */}
      <div>
        <label htmlFor="filter-institution" className="text-sm font-semibold text-ink-900">
          Campus / University
        </label>
        <select
          id="filter-institution"
          value={institution}
          onChange={(e) => onInstitution(e.target.value)}
          className={selectClass}
        >
          <option value="">All Campuses</option>
          {institutions.map((inst) => (
            <option key={inst.id} value={inst.short_code || String(inst.id)}>
              {inst.short_code ? `${inst.name} (${inst.short_code})` : inst.name}
            </option>
          ))}
        </select>
      </div>

      {/* Skill Filter */}
      <div>
        <label htmlFor="filter-skill" className="text-sm font-semibold text-ink-900">
          Skill
        </label>
        <select id="filter-skill" value={skill} onChange={(e) => onSkill(e.target.value)} className={selectClass}>
          <option value="">All skills</option>
          {skills.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Category Pills */}
      <div>
        <p className="text-sm font-semibold text-ink-900">Category</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {chips.map((chip) => {
            const active = chip.slug === category;
            return (
              <button
                key={chip.slug || "all"}
                type="button"
                aria-pressed={active}
                onClick={() => onCategory(chip.slug)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${
                  active
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-line bg-surface text-ink-700 hover:bg-surface-subtle"
                }`}
              >
                {chip.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Slider */}
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="filter-price" className="text-sm font-semibold text-ink-900">
            Max price
          </label>
          <span className="text-sm font-bold text-brand-700">{formatNaira(maxPrice)}</span>
        </div>
        <input
          id="filter-price"
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={1000}
          value={maxPrice}
          onChange={(e) => onMaxPrice(Number(e.target.value))}
          className="mt-3 w-full accent-brand-600"
        />
        <div className="mt-1 flex justify-between text-xs text-ink-500">
          <span>{formatNaira(MIN_PRICE)}</span>
          <span>{formatNaira(MAX_PRICE)}</span>
        </div>
      </div>

      {/* Provider Filter */}
      <div>
        <label htmlFor="filter-provider" className="text-sm font-semibold text-ink-900">
          Service provider
        </label>
        <select
          id="filter-provider"
          value={provider}
          onChange={(e) => onProvider(e.target.value)}
          className={selectClass}
        >
          <option value="">All students</option>
          {providers.map((p) => (
            <option key={p.id} value={String(p.id)}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}