import { SearchX, TriangleAlert } from "lucide-react";
import ServiceCard from "./ServiceCard";
import type { Service } from "../../types/services";

interface ServiceGridProps {
  services: Service[];
  isLoading: boolean;
  error: string | null;
  /** false when the backend returned no services at all */
  hasAnyServices: boolean;
  /** true when a search or filter is narrowing the list */
  isNarrowed: boolean;
  onRetry: () => void;
  onClearFilters: () => void;
}

const GRID = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";

function CardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="animate-pulse overflow-hidden rounded-xl border border-line bg-surface"
    >
      <div className="aspect-video bg-surface-subtle" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 rounded bg-surface-subtle" />
        <div className="h-3 w-1/2 rounded bg-surface-subtle" />
        <div className="h-9 border-t border-line pt-3" />
      </div>
    </div>
  );
}

function Message({
  icon: Icon,
  title,
  text,
  action,
  role,
}: {
  icon: typeof SearchX;
  title: string;
  text: string;
  action?: { label: string; onClick: () => void };
  role?: "alert";
}) {
  return (
    <div
      role={role}
      className="flex flex-col items-center rounded-xl border border-dashed border-line bg-surface px-6 py-14 text-center"
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <Icon aria-hidden="true" className="size-6" />
      </span>
      <h3 className="mt-4 font-display text-lg font-bold text-ink-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-ink-500">{text}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-5 rounded-md bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export default function ServiceGrid({
  services,
  isLoading,
  error,
  hasAnyServices,
  isNarrowed,
  onRetry,
  onClearFilters,
}: ServiceGridProps) {
  if (isLoading) {
    return (
      <ul className={GRID} aria-busy="true" aria-label="Loading services">
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i}>
            <CardSkeleton />
          </li>
        ))}
      </ul>
    );
  }

  if (error) {
    return (
      <Message
        role="alert"
        icon={TriangleAlert}
        title="We couldn't load services"
        text="Check your connection and try again."
        action={{ label: "Try again", onClick: onRetry }}
      />
    );
  }

  if (services.length === 0) {
    if (!hasAnyServices) {
      return (
        <Message
          icon={SearchX}
          title="No services yet"
          text="Nobody has listed a service yet. Check back soon."
        />
      );
    }
    return (
      <Message
        icon={SearchX}
        title="No services match"
        text="Try a different search or loosen your filters."
        action={isNarrowed ? { label: "Clear filters", onClick: onClearFilters } : undefined}
      />
    );
  }

  return (
    <ul className={GRID}>
      {services.map((service) => (
        <li key={service.id}>
          <ServiceCard service={service} />
        </li>
      ))}
    </ul>
  );
}
