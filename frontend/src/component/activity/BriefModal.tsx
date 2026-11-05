import { FileText, Image as ImageIcon, MapPin, MessageCircle, X } from "lucide-react";
import Avatar from "../ui/Avatar";
import Modal from "../ui/Modal";
import StatusPill from "./StatusPill";
import { formatNaira, formatNeededBy, formatShortDate } from "./format";
import type { ActivityTab, ServiceRequest } from "../../types/activity";

interface BriefModalProps {
  request: ServiceRequest;
  tab: ActivityTab;
  /** True while an action on this request is being saved */
  busy: boolean;
  error: string;
  onClose: () => void;
  onAccept: () => void;
  onDecline: () => void;
  onComplete: () => void;
  onReview: () => void;
}

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60";
const primary = `${buttonBase} bg-brand-600 text-white hover:bg-brand-700 focus-visible:outline-brand-500`;
const success = `${buttonBase} bg-success-600 text-white hover:bg-success-700 focus-visible:outline-success-600`;
const successOutline = `${buttonBase} border border-success-600 text-success-700 hover:bg-success-50 focus-visible:outline-success-600`;
const dangerOutline = `${buttonBase} border border-danger-300 text-danger-600 hover:bg-danger-50 focus-visible:outline-danger-600`;
const neutral = `${buttonBase} w-full bg-surface-subtle text-ink-700 hover:bg-line focus-visible:outline-brand-500`;

export default function BriefModal({
  request,
  tab,
  busy,
  error,
  onClose,
  onAccept,
  onDecline,
  onComplete,
  onReview,
}: BriefModalProps) {
  const isProvider = tab === "client-work";
  const whatsappHref = request.person.whatsapp
    ? `https://wa.me/${request.person.whatsapp.replace(/\D/g, "")}`
    : null;

  const pillLabel =
    request.status === "pending"
      ? "Pending Approval"
      : request.status === "accepted"
        ? "Accepted · In progress"
        : undefined;

  const whatsappButton = whatsappHref && (
    <a href={whatsappHref} target="_blank" rel="noreferrer" className={successOutline}>
      <MessageCircle aria-hidden="true" className="size-4" />
      Message on WhatsApp
    </a>
  );

  return (
    <Modal labelledBy="brief-title" onClose={onClose}>
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <StatusPill status={request.status} label={pillLabel} />
          <button
            type="button"
            data-autofocus
            onClick={onClose}
            aria-label="Close"
            className="flex size-9 shrink-0 items-center justify-center rounded-md border border-line text-ink-700 hover:bg-surface-subtle"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        <h2 id="brief-title" className="sr-only">
          Request for {request.serviceTitle}
        </h2>

        <div className="mt-4 flex items-center gap-3">
          <Avatar id={request.person.id} name={request.person.name} size={52} />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-ink-500">{isProvider ? "Requested by" : "Provider"}</p>
            <p className="truncate text-xl font-bold text-ink-900">{request.person.name}</p>
            <p className="text-sm text-ink-500">{request.person.departmentLevel}</p>
          </div>
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              aria-label={`Message ${request.person.name} on WhatsApp`}
              className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-line text-success-700 hover:bg-success-50"
            >
              <MessageCircle aria-hidden="true" className="size-5" />
            </a>
          )}
        </div>

        <dl className="mt-5 rounded-xl bg-surface-muted p-4 text-sm">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <div>
              <dt className="text-ink-500">Service</dt>
              <dd className="mt-0.5 font-semibold text-ink-900">{request.serviceTitle}</dd>
            </div>
            <div>
              <dt className="text-ink-500">Agreed price</dt>
              <dd className="mt-0.5 font-bold text-success-700">{formatNaira(request.price)}</dd>
            </div>
            <div>
              <dt className="text-ink-500">Date requested</dt>
              <dd className="mt-0.5 font-semibold text-ink-900">{formatShortDate(request.requestedAt)}</dd>
            </div>
            <div>
              <dt className="text-ink-500">Needed by</dt>
              <dd className="mt-0.5 font-semibold text-ink-900">{formatNeededBy(request.neededBy)}</dd>
            </div>
          </div>
          <div className="mt-4 flex items-start justify-between gap-4 border-t border-line pt-4">
            <dt className="flex items-center gap-2 text-ink-500">
              <MapPin aria-hidden="true" className="size-4" />
              Campus location
            </dt>
            <dd className="text-right font-bold text-ink-900">{request.campusLocation}</dd>
          </div>
        </dl>

        <h3 className="mt-5 text-sm font-bold text-ink-900">Project Brief &amp; Instructions</h3>
        <p className="mt-2 text-sm leading-6 text-ink-700">{request.brief}</p>

        {request.attachments.length > 0 && (
          <>
            <h3 className="mt-5 text-sm font-bold text-ink-900">
              Attachments &amp; references{" "}
              <span className="font-normal text-ink-500">({request.attachments.length})</span>
            </h3>
            <ul className="mt-3 flex flex-wrap gap-3">
              {request.attachments.map((file) => {
                const Icon = file.kind === "pdf" ? FileText : ImageIcon;
                return (
                  <li key={file.id} className="w-20">
                    <span className="flex size-20 items-center justify-center rounded-lg border border-line bg-surface-subtle text-ink-500">
                      <Icon aria-hidden="true" className="size-7" />
                    </span>
                    <span className="mt-1 block truncate text-xs text-ink-500" title={file.name}>
                      {file.name}
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {error && (
          <p role="alert" className="mt-4 text-sm font-medium text-danger-600">
            {error}
          </p>
        )}

        <div className="mt-6 space-y-3">
          {isProvider && request.status === "pending" && (
            <div className="grid grid-cols-2 gap-3">
              <button type="button" disabled={busy} onClick={onDecline} className={dangerOutline}>
                Decline Request
              </button>
              <button type="button" disabled={busy} onClick={onAccept} className={primary}>
                {busy ? "Saving…" : "Accept & Start Work"}
              </button>
            </div>
          )}

          {isProvider && request.status === "accepted" && (
            <div className="grid grid-cols-2 gap-3">
              {whatsappButton ?? <span />}
              <button type="button" disabled={busy} onClick={onComplete} className={success}>
                {busy ? "Saving…" : "Mark as Completed"}
              </button>
            </div>
          )}

          {!isProvider && request.status === "accepted" && whatsappButton}

          {!isProvider && request.status === "completed" && !request.reviewed && (
            <button type="button" onClick={onReview} className={`${primary} w-full`}>
              Leave a Review
            </button>
          )}

          {!(isProvider && (request.status === "pending" || request.status === "accepted")) && (
            <button type="button" onClick={onClose} className={neutral}>
              Close Brief
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}