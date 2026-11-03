import { Link, useNavigate, useParams } from "react-router-dom";
import { Star } from "lucide-react";
import ProviderCard from "../component/service-detail/ProviderCard";
import RequestCard from "../component/service-detail/RequestCard";
import type { RequestMode } from "../component/service-detail/RequestCard";
import ReviewList from "../component/service-detail/ReviewList";
import ServiceAbout from "../component/service-detail/ServiceAbout";
import ServiceGallery from "../component/service-detail/ServiceGallery";
import { useAuth } from "../hooks/useAuth";
import { useServiceDetail } from "../hooks/useServiceDetail";

const pageClass = "mx-auto max-w-[1200px] px-4 py-6 md:px-6 md:py-8";

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { service, isLoading, error, reload, sendRequest } = useServiceDetail(id);

  if (isLoading) {
    return (
      <div className={pageClass} aria-busy="true">
        <div className="h-9 w-72 animate-pulse rounded bg-surface-subtle" />
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-5">
            <div className="aspect-video animate-pulse rounded-xl bg-surface-subtle" />
            <div className="h-40 animate-pulse rounded-xl bg-surface-subtle" />
          </div>
          <div className="h-80 animate-pulse rounded-xl bg-surface-subtle" />
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">We couldn't load this service</h1>
        <p className="mt-2 text-sm text-ink-500">{error ?? "This service could not be found."}</p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={reload}
            className="rounded-md bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Try again
          </button>
          <Link
            to="/"
            className="rounded-md border border-brand-200 px-4 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50"
          >
            Back to Discover
          </Link>
        </div>
      </div>
    );
  }

  const mode: RequestMode = !user
    ? "guest"
    : user.id === service.provider.id
      ? "own"
      : service.hasActiveRequest
        ? "requested"
        : "ready";

  const providerFirstName = service.provider.name.split(" ")[0];

  return (
    <div className={pageClass}>
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] text-ink-500">
        <Link to="/" className="font-semibold text-brand-700 hover:underline">
          Discover
        </Link>
        <span aria-hidden="true">/</span>
        <span>{service.category}</span>
      </nav>

      <header className="mb-5 mt-3">
        <h1 className="text-2xl font-bold md:text-3xl">{service.title}</h1>
        <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-700">
          By <strong className="text-ink-900">{service.provider.name}</strong>
          <span aria-hidden="true" className="text-ink-400">
            •
          </span>
          {service.provider.departmentLevel}
          {service.rating !== null && (
            <>
              <span aria-hidden="true" className="text-ink-400">
                •
              </span>
              <span className="inline-flex items-center gap-1">
                <Star aria-hidden="true" className="size-3.5 fill-accent-500 text-accent-500" />
                <strong className="text-ink-900">{service.rating.toFixed(1)}</strong>
                <span>({service.reviewCount} reviews)</span>
              </span>
            </>
          )}
        </p>
      </header>

      {/* On phones the request card sits between the gallery and the details */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-6">
        <div className="contents lg:flex lg:min-w-0 lg:flex-col lg:gap-5">
          <div className="order-1">
            <ServiceGallery images={service.images} />
          </div>
          <div className="order-3">
            <ServiceAbout description={service.description} included={service.included} />
          </div>
          <div className="order-4">
            <ReviewList reviews={service.reviews} />
          </div>
        </div>

        <aside className="order-2 space-y-4 lg:sticky lg:top-20 lg:self-start">
          <RequestCard
            price={service.price}
            turnaround={service.turnaround}
            providerFirstName={providerFirstName}
            mode={mode}
            onSubmit={(brief, files) => sendRequest({ serviceId: service.id, brief, files })}
            onSignIn={() => navigate("/login")}
          />
          <ProviderCard provider={service.provider} />
        </aside>
      </div>
    </div>
  );
}