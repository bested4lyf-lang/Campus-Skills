import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Laptop, Smartphone } from "lucide-react";
import SettingsCard from "./SettingsCard";
import { fieldClass, primaryButton } from "./settingsStyles";
import { settingsService } from "../../services/settingsService";
import type { ActiveSession } from "../../types/settings";

const formatWhen = (iso: string) =>
  new Date(iso).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" });

export default function SecuritySection() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const [sessions, setSessions] = useState<ActiveSession[] | null>(null);
  const [sessionsError, setSessionsError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    settingsService
      .listSessions()
      .then((result) => {
        if (!cancelled) setSessions(result);
      })
      .catch(() => {
        if (!cancelled) setSessionsError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const tooShort = newPassword.length > 0 && newPassword.length < 8;
  const mismatch = confirm.length > 0 && confirm !== newPassword;
  const canSubmit = oldPassword.length > 0 && newPassword.length >= 8 && confirm === newPassword && !saving;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    setError(null);
    setDone(false);
    try {
      await settingsService.changePassword(oldPassword, newPassword);
      setOldPassword("");
      setNewPassword("");
      setConfirm("");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn’t change your password. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <SettingsCard title="Change password" description="Use a password you don’t use anywhere else.">
        <form onSubmit={(e) => void submit(e)} className="grid gap-4 sm:max-w-sm">
          <div>
            <label htmlFor="old-password" className="text-sm font-semibold text-ink-900">
              Current password
            </label>
            <input
              id="old-password"
              type="password"
              autoComplete="current-password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="new-password" className="text-sm font-semibold text-ink-900">
              New password
            </label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={fieldClass}
            />
            <p className={`mt-1 text-xs ${tooShort ? "text-danger-600" : "text-ink-500"}`}>
              Must be at least 8 characters.
            </p>
          </div>
          <div>
            <label htmlFor="confirm-password" className="text-sm font-semibold text-ink-900">
              Confirm new password
            </label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={fieldClass}
            />
            {mismatch && <p className="mt-1 text-xs text-danger-600">The passwords don’t match.</p>}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={!canSubmit} className={primaryButton}>
              {saving ? "Updating…" : "Update password"}
            </button>
            {done && (
              <span role="status" className="text-sm font-medium text-success-700">
                Password updated.
              </span>
            )}
          </div>
          {error && (
            <p role="alert" className="text-sm text-danger-600">
              {error}
            </p>
          )}
        </form>
      </SettingsCard>

      <SettingsCard title="Where you’re signed in" description="Devices that have used your account recently.">
        {sessionsError && <p className="text-sm text-danger-600">We couldn’t load your sessions.</p>}
        {!sessions && !sessionsError && <p className="text-sm text-ink-500">Loading sessions…</p>}
        {sessions && sessions.length === 0 && <p className="text-sm text-ink-500">No other sessions.</p>}
        {sessions && sessions.length > 0 && (
          <ul className="divide-y divide-line">
            {sessions.map((session) => {
              const Icon = /iphone|android|mobile/i.test(session.deviceLabel) ? Smartphone : Laptop;
              return (
                <li key={session.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="flex size-10 flex-none items-center justify-center rounded-lg bg-surface-subtle text-ink-700">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-900">
                      {session.deviceLabel}
                      {session.isCurrent && (
                        <span className="ml-2 rounded-full bg-success-100 px-2 py-0.5 text-xs font-semibold text-success-700">
                          This device
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-ink-500">
                      {session.location} · {session.ipAddress} · {formatWhen(session.lastActive)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </SettingsCard>
    </div>
  );
}