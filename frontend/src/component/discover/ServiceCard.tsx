import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import Avatar from "../ui/Avatar";
import { formatNaira } from "../../utils/format";
import type { ServiceCardData } from "../../types/discover";

export default function ServiceCard({ service }: { service: ServiceCardData }) {
  return (
    <article className="overflow-hidden rounded-xl border border-line bg-surface shadow-card transition hover:shadow-card-hover">
      <div className="relative aspect-[16/10] bg-brand-50">
        {service.coverImage ? (
          <img src={service.coverImage} alt="" loading="lazy" className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center text-5xl font-extrabold text-brand-200">
            {service.title.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-ink-900">
          {service.categoryName}
        </span>
      </div>

      <div className="p-4">
        <h3 className="truncate text-base font-bold text-ink-900">{service.title}</h3>

        <div className="mt-3 flex items-center justify-between gap-3 border-b border-line pb-3">
          <span className="flex min-w-0 items-center gap-2">
            <Avatar id={String(service.providerId)} name={service.providerName} size={24} />
            <span className="truncate text-sm text-ink-700">{service.providerName}</span>
            {service.institutionShortCode && (
              <span className="rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold text-brand-700">
                {service.institutionShortCode}
              </span>
            )}
          </span>
          <span className="flex flex-none items-center gap-1 text-xs text-ink-500">
            {service.reviewCount > 0 ? (
              <>
                <Star aria-hidden="true" className="size-3.5 fill-accent-500 text-accent-500" />
                <span className="font-semibold text-ink-700">{service.rating.toFixed(1)}</span>
                <span>({service.reviewCount})</span>
              </>
            ) : (
              <span className="font-semibold text-ink-700">New</span>
            )}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-ink-500">Starting at</p>
            <p className="text-lg font-extrabold text-ink-900">{formatNaira(service.price)}</p>
          </div>
          <Link
            to={`/services/${service.id}`}
            className="rounded-lg border border-brand-600 px-5 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}