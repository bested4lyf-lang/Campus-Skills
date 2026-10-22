import type { ReactNode } from "react";

interface ChipProps {
  selected?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

export default function Chip({ selected = false, onClick, children }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${
        selected
          ? "border-brand-600 bg-brand-600 text-white"
          : "border-line bg-surface text-ink-900 hover:border-brand-200 hover:bg-brand-50"
      }`}
    >
      {children}
    </button>
  );
}
