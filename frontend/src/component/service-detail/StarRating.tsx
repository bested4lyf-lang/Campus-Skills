import { Star } from "lucide-react";

interface StarRatingProps {
  /** 1 to 5, shown to the nearest whole star */
  value: number;
}

export default function StarRating({ value }: StarRatingProps) {
  const filled = Math.round(value);

  return (
    <span role="img" aria-label={`${filled} out of 5 stars`} className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden="true"
          className={`size-3.5 ${n <= filled ? "fill-accent-500 text-accent-500" : "fill-line text-line"}`}
        />
      ))}
    </span>
  );
}