import { useState } from "react";
import SettingsCard from "./SettingsCard";
import { settingsService } from "../../services/settingsService";
import type { NotificationPrefs } from "../../types/settings";

const ITEMS: { key: keyof NotificationPrefs; label: string; description: string }[] = [
  { key: "newRequests", label: "New requests", description: "When a student asks for one of your services." },
  {
    key: "statusUpdates",
    label: "Request updates",
    description: "When a request you made is accepted, declined or completed.",
  },
  { key: "newReviews", label: "New reviews", description: "When someone reviews your work." },
];

export default function NotificationsSection() {
  const [prefs, setPrefs] = useState<NotificationPrefs>(() => settingsService.getNotificationPrefs());

  function toggle(key: keyof NotificationPrefs) {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    settingsService.saveNotificationPrefs(next);
  }

  return (
    <SettingsCard title="Notifications" description="Choose which alerts you get. Saved on this device.">
      <ul className="divide-y divide-line">
        {ITEMS.map(({ key, label, description }) => {
          const on = prefs[key];
          return (
            <li key={key} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-semibold text-ink-900">{label}</p>
                <p className="text-sm text-ink-500">{description}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                aria-label={label}
                onClick={() => toggle(key)}
                className={`relative h-6 w-11 flex-none rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${
                  on ? "bg-brand-600" : "bg-ink-400"
                }`}
              >
                <span
                  className={`absolute left-0.5 top-0.5 size-5 rounded-full bg-white transition-transform ${
                    on ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </SettingsCard>
  );
}