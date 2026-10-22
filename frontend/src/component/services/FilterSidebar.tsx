import FilterFields from "./FilterFields";
import type { FilterFieldsProps } from "./FilterFields";

interface FilterSidebarProps extends FilterFieldsProps {
  activeCount: number;
  onClear: () => void;
}

/** Desktop filter panel (lg and up). Mobile uses a BottomSheet instead. */
export default function FilterSidebar({
  activeCount,
  onClear,
  ...fields
}: FilterSidebarProps) {
  return (
    <aside
      aria-label="Filters"
      className="sticky top-20 hidden self-start rounded-xl border border-line bg-surface p-4 shadow-card lg:block"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-base font-bold">Filters</h2>
        <button
          type="button"
          onClick={onClear}
          disabled={activeCount === 0}
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear all
        </button>
      </div>
      <FilterFields {...fields} />
    </aside>
  );
}
