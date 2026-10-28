import { useState } from "react";
import ActivityRequestCard from "./ActivityRequestCard";
import EmptyColumn from "./EmptyColumn";
import StatusPill from "./StatusPill";
import { STATUS_ORDER, STATUS_STYLES } from "./statusStyles";
import type { ActivityTab, RequestStatus, ServiceRequest } from "../../types/activity";

interface ActivityBoardProps {
  requests: ServiceRequest[];
  tab: ActivityTab;
  /** id of the request whose action is being saved */
  busyId: string | null;
  onViewBrief: (request: ServiceRequest) => void;
  onAccept: (request: ServiceRequest) => void;
  onDecline: (request: ServiceRequest) => void;
  onComplete: (request: ServiceRequest) => void;
  onReview: (request: ServiceRequest) => void;
}

type Filter = "all" | RequestStatus;

export default function ActivityBoard({ requests, tab, busyId, ...handlers }: ActivityBoardProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const ofStatus = (status: RequestStatus) => requests.filter((r) => r.status === status);

  const renderCard = (request: ServiceRequest, showStatus: boolean) => (
    <li key={request.id}>
      <ActivityRequestCard
        request={request}
        tab={tab}
        showStatus={showStatus}
        busy={busyId === request.id}
        {...handlers}
      />
    </li>
  );

  // Phones and tablets show one list: grouped by status, newest request first inside each group
  const listed = requests
    .filter((r) => filter === "all" || r.status === filter)
    .sort(
      (a, b) =>
        STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status) ||
        b.requestedAt.localeCompare(a.requestedAt),
    );

  const filters: { value: Filter; label: string }[] = [
    { value: "all", label: "All" },
    ...STATUS_ORDER.map((status) => ({
      value: status as Filter,
      label: `${STATUS_STYLES[status].label} (${ofStatus(status).length})`,
    })),
  ];

  return (
    <>
      {/* Large screens: one column per status */}
      <div className="hidden gap-4 lg:grid lg:grid-cols-4">
        {STATUS_ORDER.map((status) => {
          const items = ofStatus(status);
          return (
            <section
              key={status}
              aria-label={`${STATUS_STYLES[status].label} requests`}
              className="rounded-2xl bg-surface-muted p-3"
            >
              <div className="mb-3 flex items-center justify-between">
                <StatusPill status={status} />
                <span className="text-sm font-semibold text-ink-500">{items.length}</span>
              </div>
              {items.length === 0 ? (
                <EmptyColumn status={status} tab={tab} />
              ) : (
                <ul className="space-y-3">{items.map((r) => renderCard(r, false))}</ul>
              )}
            </section>
          );
        })}
      </div>

      {/* Smaller screens: filter chips and a single list */}
      <div className="lg:hidden">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1" role="group" aria-label="Filter by status">
          {filters.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium ${
                filter === value
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-line bg-surface text-ink-900 hover:bg-surface-subtle"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {listed.length > 0 ? (
            <ul className="space-y-3">{listed.map((r) => renderCard(r, true))}</ul>
          ) : filter === "all" ? (
            <p className="rounded-xl border border-dashed border-line bg-surface px-4 py-8 text-center text-sm font-semibold text-ink-700">
              Nothing here yet.
            </p>
          ) : (
            <EmptyColumn status={filter} tab={tab} />
          )}
        </div>
      </div>
    </>
  );
}