import { Check, CircleCheck, CircleX, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { RequestStatus } from "../../types/activity";

/** Column order on the board */
export const STATUS_ORDER: RequestStatus[] = ["pending", "accepted", "rejected", "completed"];

interface StatusStyle {
  label: string;
  /** Background and text colour of the pill, as full class names so Tailwind can see them */
  pill: string;
  Icon: LucideIcon;
}

export const STATUS_STYLES: Record<RequestStatus, StatusStyle> = {
  pending: { label: "Pending", pill: "bg-accent-100 text-accent-700", Icon: Clock },
  accepted: { label: "Accepted", pill: "bg-brand-50 text-brand-700", Icon: CircleCheck },
  rejected: { label: "Rejected", pill: "bg-danger-100 text-danger-800", Icon: CircleX },
  completed: { label: "Completed", pill: "bg-success-100 text-success-700", Icon: Check },
};