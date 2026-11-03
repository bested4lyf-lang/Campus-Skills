import { CircleX, Clock, Inbox, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ActivityTab, RequestStatus } from "../../types/activity";

interface EmptyColumnProps {
  status: RequestStatus;
  tab: ActivityTab;
}

interface EmptyCopy {
  Icon: LucideIcon;
  circle: string;
  title: string;
  hint?: string;
}

const COPY: Record<ActivityTab, Record<RequestStatus, EmptyCopy>> = {
  "client-work": {
    pending: { Icon: Sparkles, circle: "bg-accent-100 text-accent-700", title: "No pending requests.", hint: "You're all caught up!" },
    accepted: { Icon: Clock, circle: "bg-brand-50 text-brand-700", title: "No accepted requests yet." },
    rejected: { Icon: CircleX, circle: "bg-danger-100 text-danger-600", title: "No declined requests." },
    completed: { Icon: Inbox, circle: "bg-success-50 text-success-700", title: "No completed orders yet." },
  },
  "my-hires": {
    pending: { Icon: Sparkles, circle: "bg-accent-100 text-accent-700", title: "No requests waiting.", hint: "Browse Discover to hire a classmate." },
    accepted: { Icon: Clock, circle: "bg-brand-50 text-brand-700", title: "No jobs in progress." },
    rejected: { Icon: CircleX, circle: "bg-danger-100 text-danger-600", title: "No declined requests." },
    completed: { Icon: Inbox, circle: "bg-success-50 text-success-700", title: "No completed jobs yet." },
  },
};

export default function EmptyColumn({ status, tab }: EmptyColumnProps) {
  const { Icon, circle, title, hint } = COPY[tab][status];

  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-line bg-surface px-4 py-8 text-center">
      <span className={`flex size-12 items-center justify-center rounded-full ${circle}`}>
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <p className="mt-3 text-sm font-semibold text-ink-700">{title}</p>
      {hint && <p className="mt-0.5 text-sm text-ink-500">{hint}</p>}
    </div>
  );
}