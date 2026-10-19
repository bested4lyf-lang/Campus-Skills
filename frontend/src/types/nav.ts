import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  /** Show the pending-request count badge on this item */
  hasCount?: boolean;
}
