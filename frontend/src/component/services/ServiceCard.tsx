import { Link } from "react-router-dom";
import Avatar from "../ui/Avatar";
import Rating from "../ui/Rating";
import { getCategoryStyle } from "./categoryStyle";
import { formatNaira } from "../../utils/format";
import type { Service } from "../../types/services";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const { cover, icon: Icon, iconColor } = getCategoryStyle(service.category);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-card transition-shadow hover:shadow-card-hover">
      <div className={`relative aspect-video ${cover}`}>
        {service.coverImage ? (
          <img
            src={service.coverImage}
            alt=""
            loading="lazy"
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Icon
              aria-hidden="true"
              strokeWidth={1.5}
              className={`size-14 ${iconColor}`}
            />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-ink-900 shadow-card">
          {service.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-[15px] font-semibold leading-snug text-ink-900">
          {service.title}
        </h3>

        <div className="mt-3 flex items-center gap-2">
          <Avatar
            id={service.provider.id}
            name={service.provider.name}
            size={22}
          />
          <span className="truncate text-xs font-medium text-ink-700">
            {service.provider.name}
          </span>
          <Rating
            value={service.rating}
            count={service.reviewCount}
            className="ml-auto shrink-0"
          />
        </div>

        <div className="mt-auto pt-4">
          <div className="flex items-end justify-between gap-3 border-t border-line pt-3">
            <div>
              <p className="text-xs text-ink-500">Starting at</p>
              <p className="font-display text-lg font-bold leading-6 text-ink-900">
                {formatNaira(service.startingPrice)}
              </p>
            </div>
            <Link
              to={`/services/${service.id}`}
              aria-label={`View ${service.title}`}
              className="rounded-md border border-brand-600 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
