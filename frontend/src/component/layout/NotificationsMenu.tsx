import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, CheckCheck, CircleCheck, CircleX, Inbox, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNotifications } from "../../hooks/useNotifications";
import type { AppNotification, NotificationEvent } from "../../types/notifications";

const EVENT_STYLES: Record<NotificationEvent, { Icon: LucideIcon; circle: string }> = {
  request_received: { Icon: Inbox, circle: "bg-brand-50 text-brand-600" },
  request_accepted: { Icon: CircleCheck, circle: "bg-success-100 text-success-700" },
  request_rejected: { Icon: CircleX, circle: "bg-danger-100 text-danger-600" },
  request_completed: { Icon: CheckCheck, circle: "bg-success-100 text-success-700" },
  review_received: { Icon: Star, circle: "bg-accent-100 text-accent-700" },
};

// Used if the backend sends an event type this list doesn't know
const FALLBACK_STYLE = { Icon: Bell, circle: "bg-surface-subtle text-ink-700" };

function NotificationRow({
  item,
  onOpen,
}: {
  item: AppNotification;
  onOpen: (item: AppNotification) => void;
}) {
  const { Icon, circle } = EVENT_STYLES[item.eventType] ?? FALLBACK_STYLE;

  return (
    <li>
      <button
        type="button"
        onClick={() => onOpen(item)}
        className={`flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-surface-subtle ${
          item.isRead ? "" : "bg-surface-muted"
        }`}
      >
        <span className={`flex size-10 flex-none items-center justify-center rounded-full ${circle}`}>
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-ink-900">{item.title}</span>
          <span className="block text-xs text-ink-500">{item.timeAgo}</span>
        </span>
        {!item.isRead && (
          <>
            <span aria-hidden="true" className="size-2 flex-none rounded-full bg-info-500" />
            <span className="sr-only">Unread</span>
          </>
        )}
      </button>
    </li>
  );
}

export default function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { notifications, unreadCount, isLoading, error, reload, markRead, markAllRead } =
    useNotifications();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const toggle = () => {
    if (!open) void reload();
    setOpen((o) => !o);
  };

  const openItem = (item: AppNotification) => {
    if (!item.isRead) void markRead(item.id);
    setOpen(false);
    navigate(item.deepLink);
  };

  const hasItems = notifications.length > 0;
  const showLoading = isLoading && !hasItems;
  const showError = !!error && !hasItems;
  const showEmpty = !isLoading && !error && !hasItems;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={toggle}
        className={`relative flex size-10 items-center justify-center rounded-md text-ink-700 hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${
          open ? "bg-surface-subtle" : ""
        }`}
      >
        <Bell aria-hidden="true" className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-danger-600 ring-2 ring-surface" />
        )}
      </button>

      {open && (
        <div
          role="region"
          aria-label="Notifications"
          className="fixed inset-x-3 top-16 z-50 overflow-hidden rounded-xl border border-line bg-surface shadow-popover sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[22rem]"
        >
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="text-sm font-semibold text-ink-900">Notifications</h2>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => void markAllRead()}
                className="text-xs font-semibold text-brand-700 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="h-px bg-line" />

          {showLoading && <p className="px-4 py-8 text-center text-sm text-ink-500">Loading notifications…</p>}

          {showError && (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-ink-700">{error}</p>
              <button
                type="button"
                onClick={() => void reload()}
                className="mt-2 text-sm font-semibold text-brand-700 hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {showEmpty && (
            <div className="flex flex-col items-center gap-3 px-4 py-8 text-center">
              <Bell aria-hidden="true" className="size-8 text-ink-400" />
              <p className="text-sm text-ink-500">No new notifications — You’re all caught up!</p>
            </div>
          )}

          {hasItems && (
            <ul className="max-h-[60vh] divide-y divide-line overflow-y-auto">
              {notifications.map((item) => (
                <NotificationRow key={item.id} item={item} onOpen={openItem} />
              ))}
            </ul>
          )}

          <div className="h-px bg-line" />
          <Link
            to="/activity"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 text-center text-sm font-semibold text-brand-700 hover:bg-surface-subtle"
          >
            View all in Activity →
          </Link>
        </div>
      )}
    </div>
  );
}