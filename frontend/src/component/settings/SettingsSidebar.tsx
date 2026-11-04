import { SETTINGS_TABS } from "./settingsTabs";
import type { SettingsTab } from "../../types/settings";

interface SettingsSidebarProps {
  active: SettingsTab;
  onSelect: (tab: SettingsTab) => void;
}

export default function SettingsSidebar({ active, onSelect }: SettingsSidebarProps) {
  return (
    <nav
      aria-label="Settings sections"
      className="flex gap-1 overflow-x-auto rounded-xl border border-line bg-surface p-2 lg:flex-col lg:overflow-visible"
    >
      {SETTINGS_TABS.map(({ id, label, Icon }) => {
        const isActive = id === active;
        const tone = isActive
          ? id === "danger"
            ? "bg-danger-50 text-danger-800"
            : "bg-brand-50 text-brand-700"
          : "text-ink-700 hover:bg-surface-subtle";

        return (
          <button
            key={id}
            type="button"
            aria-current={isActive ? "page" : undefined}
            onClick={() => onSelect(id)}
            className={`flex flex-none items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2.5 text-left text-sm font-semibold ${tone}`}
          >
            <Icon aria-hidden="true" className="size-4" />
            {label}
          </button>
        );
      })}
    </nav>
  );
}