import { STATUS_STYLES } from "./statusStyles";
import type { RequestStatus } from "../../types/activity";

interface StatusPillProps {
  status: RequestStatus;
  /** Replaces the default label, e.g. "Pending Approval" in the brief popup */
  label?: string;
}

export default function StatusPill({ status, label }: StatusPillProps) {
  const { label: defaultLabel, pill, Icon } = STATUS_STYLES[status];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${pill}`}>
      <Icon aria-hidden="true" className="size-3.5" />
      {label ?? defaultLabel}
    </span>
  );
}