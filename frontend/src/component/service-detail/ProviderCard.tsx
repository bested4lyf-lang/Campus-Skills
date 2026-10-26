import { Link } from "react-router-dom";
import Avatar from "../ui/Avatar";
import type { ServiceProviderDetail } from "../../types/serviceDetail";

interface ProviderCardProps {
  provider: ServiceProviderDetail;
}

export default function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <section aria-label="Service provider" className="rounded-xl border border-line bg-surface p-5">
      <div className="flex items-center gap-3">
        <Avatar id={provider.id} name={provider.name} size={42} />
        <div>
          <p className="text-[15px] font-semibold text-ink-900">{provider.name}</p>
          <p className="text-xs text-ink-500">
            {provider.activeListings} active {provider.activeListings === 1 ? "listing" : "listings"}
          </p>
        </div>
      </div>

      <p className="mt-3 text-[13px] leading-5 text-ink-700">{provider.bio}</p>

      <Link
        to={`/profile/${provider.id}`}
        className="mt-3 inline-block rounded-sm text-[13px] font-semibold text-brand-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
      >
        View Full Profile →
      </Link>
    </section>
  );
}