import { BadgeCheck } from "lucide-react";
import Avatar from "../ui/Avatar";
import StarRating from "./StarRating";
import type { ServiceReview } from "../../types/serviceDetail";

interface ReviewListProps {
  reviews: ServiceReview[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  return (
    <section aria-labelledby="reviews-title" className="rounded-xl border border-line bg-surface p-5 md:p-6">
      <h2 id="reviews-title" className="text-lg font-bold">
        Reviews from Students
      </h2>

      {reviews.length === 0 ? (
        <p className="mt-3 text-sm text-ink-500">No reviews yet. Be the first to hire and review.</p>
      ) : (
        <ul className="mt-2 divide-y divide-line">
          {reviews.map((review) => (
            <li key={review.id} className="py-4 last:pb-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <Avatar id={review.id} name={review.reviewer} size={32} />
                <span className="text-sm font-semibold text-ink-900">{review.reviewer}</span>
                {review.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-success-50 px-2 py-0.5 text-[11px] font-semibold text-success-700">
                    <BadgeCheck aria-hidden="true" className="size-3.5" />
                    Verified
                  </span>
                )}
                <span className="ml-auto">
                  <StarRating value={review.rating} />
                </span>
              </div>
              {review.comment && <p className="mt-2 text-sm leading-6 text-ink-700">{review.comment}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}