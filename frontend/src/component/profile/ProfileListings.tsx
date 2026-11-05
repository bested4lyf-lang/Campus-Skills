import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { formatNaira } from "../../utils/format";
import type { ProfileListing } from "../../types/profile";

interface ProfileListingsProps {
  listings: ProfileListing[];
  firstName: string;
  isOwn: boolean;
}

export default function ProfileListings({ listings, firstName, isOwn }: ProfileListingsProps) {
  return (
    <section aria-labelledby="listings-title">
      <h2 id="listings-title" className="text-lg font-bold">
        {isOwn ? "Your active listings" : `${firstName}'s active listings`}
      </h2>

      {listings.length === 0 ? (
        <div className="mt-3 rounded-xl border border-dashed border-line bg-surface px-5 py-8 text-center">
          <p className="text-sm font-semibold text-ink-700">No active listings yet.</p>
          {isOwn && (
            <Link to="/my-services" className="mt-2 inline-block text-sm font-semibold text-brand-700 hover:underline">
              Create your first listing
            </Link>
          )}
        </div>
      ) : (
        <ul className="mt-3 grid gap-4 sm:grid-cols-2">
          {listings.map((listing) => (
            <li key={listing.id}>
              <Link
                to={`/services/${listing.id}`}
                className="flex h-full flex-col rounded-xl border border-line bg-surface p-4 shadow-card transition-shadow hover:shadow-card-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              >
                <span className="self-start rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                  {listing.category}
                </span>
                <span className="mt-3 font-sans text-[15px] font-semibold leading-snug text-ink-900">{listing.title}</span>
                <span className="mt-auto flex items-end justify-between pt-4">
                  <span>
                    <span className="block text-xs text-ink-500">Starting at</span>
                    <span className="text-lg font-bold text-ink-900">{formatNaira(listing.price)}</span>
                  </span>
                  {listing.rating !== null ? (
                    <span className="flex items-center gap-1 text-xs text-ink-500">
                      <Star aria-hidden="true" className="size-3.5 fill-accent-500 text-accent-500" />
                      {listing.rating.toFixed(1)} ({listing.reviewCount})
                    </span>
                  ) : (
                    <span className="text-xs text-ink-400">No reviews yet</span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}