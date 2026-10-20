import { useId } from "react";
import Chip from "../ui/Chip";
import Select from "../ui/Select";
import { formatNaira } from "../../utils/format";
import { CATEGORIES } from "../../types/services";
import type {
  ServiceFilters,
  ServiceProvider,
  SetFilter,
} from "../../types/services";

export interface FilterFieldsProps {
  filters: ServiceFilters;
  skills: string[];
  providers: ServiceProvider[];
  priceMin: number;
  priceMax: number;
  onChange: SetFilter;
}

const label = "text-sm font-semibold text-ink-900";
const CATEGORY_CHIPS = ["All", ...CATEGORIES] as const;

export default function FilterFields({
  filters,
  skills,
  providers,
  priceMin,
  priceMax,
  onChange,
}: FilterFieldsProps) {
  const uid = useId();
  const skillId = `${uid}-skill`;
  const priceId = `${uid}-price`;
  const providerId = `${uid}-provider`;

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor={skillId} className={label}>
          Skill
        </label>
        <Select
          id={skillId}
          className="mt-2"
          value={filters.skill}
          onChange={(v) => onChange("skill", v)}
          options={[
            { value: "", label: "All skills" },
            ...skills.map((s) => ({ value: s, label: s })),
          ]}
        />
      </div>

      <fieldset>
        <legend className={label}>Category</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {CATEGORY_CHIPS.map((c) => (
            <Chip
              key={c}
              selected={filters.category === c}
              onClick={() => onChange("category", c)}
            >
              {c}
            </Chip>
          ))}
        </div>
      </fieldset>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor={priceId} className={label}>
            Max price
          </label>
          <span className="text-sm font-semibold text-brand-600">
            {formatNaira(filters.maxPrice)}
          </span>
        </div>
        <input
          id={priceId}
          type="range"
          min={priceMin}
          max={priceMax}
          step={500}
          value={filters.maxPrice}
          onChange={(e) => onChange("maxPrice", Number(e.target.value))}
          className="mt-3 w-full accent-brand-600"
        />
        <div className="mt-1 flex justify-between text-xs text-ink-500">
          <span>{formatNaira(priceMin)}</span>
          <span>{formatNaira(priceMax)}</span>
        </div>
      </div>

      <div>
        <label htmlFor={providerId} className={label}>
          Service provider
        </label>
        <Select
          id={providerId}
          className="mt-2"
          value={filters.provider}
          onChange={(v) => onChange("provider", v)}
          options={[
            { value: "", label: "All students" },
            ...providers.map((p) => ({ value: p.id, label: p.name })),
          ]}
        />
      </div>
    </div>
  );
}
