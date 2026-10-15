import { Briefcase, ClipboardList, Compass } from "lucide-react";
import type { NavItem } from "../../types/nav";

export const NAV_ITEMS: NavItem[] = [
  { label: "Discover", to: "/", icon: Compass },
  { label: "My Services", to: "/my-services", icon: Briefcase },
  { label: "Activity", to: "/activity", icon: ClipboardList, hasCount: true },
];
