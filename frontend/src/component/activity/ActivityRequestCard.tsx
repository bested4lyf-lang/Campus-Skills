import Avatar from "../ui/Avatar";
import StatusPill from "./StatusPill";
import { formatNaira, formatShortDate } from "./format";
import type { ActivityTab, ServiceRequest } from "../../types/activity";

interface ActivityRequestCardProps {
  request: ServiceRequest;
  tab: ActivityTab;
  /** The mobile list shows the status on the card, the desktop board shows it in the column header */
  showStatus?: boolean;
  /** True while an action on this request is being saved */
  busy: boolean;
  onViewBrief: (request: ServiceRequest) => void;
  onAccept: (request: ServiceRequest) => void;
  onDecline: (request: ServiceRequest) => void;
  onComplete: (request: ServiceRequest) => void;
  onReview: (request: ServiceRequest) => void;
}

const primaryButton =
  "whitespace-nowrap rounded-md bg-brand-600 px-2 py-2.5 text-[13px] font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500";
const dangerOutline =
  "whitespace-nowrap rounded-md border border-danger-300 px-2 py-2.5 text-[13px] font-semibold text-danger-600 hover:bg-danger-50 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger-600";

export default function ActivityRequestCard({
  request,
  tab,
  showStatus = false,
  busy,
  onViewBrief,
  onAccept,
  onDecline,
  onComplete,
  onReview,
}: ActivityRequestCardProps) {
  const isClientWork = tab === "client-work";
  const canDecide = isClientWork && request.status === "pending";
  const canComplete = isClientWork && request.status === "accepted";
  const canReview = !isClientWork && request.status === "completed" && !request.reviewed;
  const hasActions = canDecide || canComplete || canReview;

  return (
    <article className="rounded-xl border border-line bg-surface p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar id={request.person.id} name={request.person.name} size={40} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink-900">{request.person.name}</p>
            <p className="text-xs text-ink-500">Requested {formatShortDate(request.requestedAt)}</p>
          </div>
        </div>
        {showStatus && <StatusPill status={request.status} />}
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <h3 className="font-sans text-[15px] font-semibold leading-snug text-ink-900">{request.serviceTitle}</h3>
        <span className="shrink-0 rounded-md bg-success-50 px-2 py-0.5 text-sm font-bold text-success-700">
          {formatNaira(request.price)}
        </span>
      </div>

      <p className="mt-2 line-clamp-3 text-[13px] italic leading-5 text-ink-500">“{request.brief}”</p>

      <button
        type="button"
        onClick={() => onViewBrief(request)}
        className="mt-3 rounded-sm text-[13px] font-semibold text-brand-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
      >
        View Brief →
      </button>

      {hasActions && (
        <div className="mt-4 border-t border-line pt-4">
          {canDecide && (
            <div className="grid grid-cols-2 gap-2">
              <button type="button" disabled={busy} onClick={() => onDecline(request)} className={dangerOutline}>
                Decline
              </button>
              <button type="button" disabled={busy} onClick={() => onAccept(request)} className={primaryButton}>
                {busy ? "Saving…" : "Accept Request"}
              </button>
            </div>
          )}

          {canComplete && (
            <button
              type="button"
              disabled={busy}
              onClick={() => onComplete(request)}
              className="w-full rounded-md bg-success-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-success-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-success-600"
            >
              {busy ? "Saving…" : "Mark as Completed"}
            </button>
          )}

          {canReview && (
            <button type="button" onClick={() => onReview(request)} className={`${primaryButton} w-full`}>
              Leave a Review
            </button>
          )}
        </div>
      )}
    </article>
  );
}