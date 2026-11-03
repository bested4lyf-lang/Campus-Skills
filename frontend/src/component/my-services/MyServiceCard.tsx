import { Pencil, Star, Trash2 } from "lucide-react";
import Avatar from "../ui/Avatar";
import { formatNaira, getServiceTone } from "./serviceHelpers";
import type { OwnService } from "../../types/myServices";
import type { User } from "../../types/user";

interface MyServiceCardProps {
  service: OwnService;
  owner: User;
  onEdit: (service: OwnService) => void;
  onDelete: (service: OwnService) => void;
}

const iconButton =
  "flex size-9 items-center justify-center rounded-md border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500";

export default function MyServiceCard({ service, owner, onEdit, onDelete }: MyServiceCardProps) {
  const { bg, Icon } = getServiceTone(service);

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-card transition-shadow hover:shadow-card-hover">
      {/* Cover */}
      <div className={`relative h-40 ${bg}`}>
        {service.coverImageUrl ? (
          <img src={service.coverImageUrl} alt="" className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center">
            <span className="flex size-20 items-center justify-center rounded-full bg-white/60">
              <Icon aria-hidden="true" className="size-10 text-ink-900/70" />
            </span>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-ink-900">
          {service.category}
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-sans text-base font-semibold leading-snug text-ink-900">{service.title}</h3>

        <div className="mb-4 mt-3 flex items-center justify-between gap-2 text-sm">
          <span className="flex min-w-0 items-center gap-2 text-ink-700">
            <Avatar id={owner.id} name={owner.fullName} size={24} />
            You
          </span>
          {service.rating != null ? (
            <span className="flex shrink-0 items-center gap-1 text-xs text-ink-500">
              <Star aria-hidden="true" className="size-3.5 fill-accent-500 text-accent-500" />
              {service.rating.toFixed(1)} ({service.reviewCount})
            </span>
          ) : (
            <span className="shrink-0 text-xs text-ink-400">No reviews yet</span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-line pt-3">
          <div>
            <p className="text-xs text-ink-500">Starting at</p>
            <p className="text-lg font-bold text-ink-900">{formatNaira(service.price)}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onEdit(service)}
              aria-label={`Edit ${service.title}`}
              className={`${iconButton} border-line text-ink-700 hover:bg-surface-subtle`}
            >
              <Pencil aria-hidden="true" className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(service)}
              aria-label={`Delete ${service.title}`}
              className={`${iconButton} border-danger-100 bg-danger-50 text-danger-600 hover:bg-danger-100`}
            >
              <Trash2 aria-hidden="true" className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}