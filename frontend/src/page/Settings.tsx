import { Link, Navigate, useSearchParams } from "react-router-dom";
import SettingsSidebar from "../component/settings/SettingsSidebar";
import SecuritySection from "../component/settings/SecuritySection";
import PayoutSection from "../component/settings/PayoutSection";
import NotificationsSection from "../component/settings/NotificationsSection";
import PrivacySection from "../component/settings/PrivacySection";
import DangerZone from "../component/settings/DangerZone";
import { SETTINGS_TABS } from "../component/settings/settingsTabs";
import { useAuth } from "../hooks/useAuth";
import type { SettingsTab } from "../types/settings";

const isTab = (value: string | null): value is SettingsTab =>
  SETTINGS_TABS.some((tab) => tab.id === value);

function SectionFor({ tab }: { tab: SettingsTab }) {
  switch (tab) {
    case "security":
      return <SecuritySection />;
    case "payout":
      return <PayoutSection />;
    case "notifications":
      return <NotificationsSection />;
    case "privacy":
      return <PrivacySection />;
    case "danger":
      return <DangerZone />;
  }
}

export default function Settings() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();

  const raw = params.get("tab");
  const active: SettingsTab = isTab(raw) ? raw : "security";
  const activeLabel = SETTINGS_TABS.find((tab) => tab.id === active)?.label ?? "";

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-6 md:py-8">
      <h1 className="text-2xl font-bold md:text-3xl">Account settings</h1>
      <p className="mt-1 text-sm text-ink-500">
        Private to you: sign-in, payouts, alerts and privacy. Nobody on campus sees this page.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
        <aside className="space-y-4 lg:sticky lg:top-20">
          <SettingsSidebar active={active} onSelect={(tab) => setParams({ tab }, { replace: true })} />

          <div className="rounded-xl border border-line bg-surface p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Looking for your bio?</p>
            <p className="mt-2 text-sm text-ink-500">
              Your photo, bio, skills and listings are public, and live on your profile.
            </p>
            <Link
              to="/profile/edit"
              className="mt-3 block rounded-lg border border-line px-4 py-2.5 text-center text-sm font-semibold text-brand-700 hover:bg-surface-subtle"
            >
              Edit public profile
            </Link>
          </div>
        </aside>

        <section className="min-w-0" aria-label={activeLabel}>
          <SectionFor tab={active} />
        </section>
      </div>
    </div>
  );
}