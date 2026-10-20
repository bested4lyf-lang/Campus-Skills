import { Star } from "lucide-react";

interface RatingProps {
  value: number | null;
  count: number;
  className?: string;
}

export default function Rating({ value, count, className = "" }: RatingProps) {
  if (value === null || count === 0) {
    return <span className={`text-xs text-ink-500 ${className}`}>New</span>;
  }

  return (
    <span
      role="img"
      aria-label={`Rated ${value.toFixed(1)} from ${count} reviews`}
      className={`inline-flex items-center gap-1 text-xs ${className}`}
    >
      <Star aria-hidden="true" className="size-3.5 fill-accent-500 text-accent-500" />
      <span className="font-semibold text-ink-900">{value.toFixed(1)}</span>
      <span className="text-ink-500">({count})</span>
    </span>
  );
}
