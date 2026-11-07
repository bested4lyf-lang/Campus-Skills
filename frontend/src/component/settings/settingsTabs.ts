import { Bell, CreditCard, Eye, Shield, TriangleAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SettingsTab } from "../../types/settings";

export const SETTINGS_TABS: { id: SettingsTab; label: string; Icon: LucideIcon }[] = [
  { id: "security", label: "Security", Icon: Shield },
  { id: "payout", label: "Payout Info", Icon: CreditCard },
  { id: "notifications", label: "Notifications", Icon: Bell },
  { id: "privacy", label: "Privacy", Icon: Eye },
  { id: "danger", label: "Danger Zone", Icon: TriangleAlert },
];