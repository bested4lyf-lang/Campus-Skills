import { useEffect, useState } from "react";
import SettingsCard from "./SettingsCard";
import { primaryButton } from "./settingsStyles";
import { settingsService } from "../../services/settingsService";
import type { WhatsappVisibility } from "../../types/settings";

const OPTIONS: { value: WhatsappVisibility; label: string; description: string }[] = [
  {
    value: "accepted_only",
    label: "Only show to accepted requests",
    description: "Your WhatsApp number is shared only with students whose requests you accept.",
  },
  {
    value: "public",
    label: "Show on public profile",
    description: "Anyone on campus can see your number on your profile.",
  },
  {
    value: "private",
    label: "Keep private",
    description: "Your number is never shown to other students.",
  },
];

export default function PrivacySection() {
  const [current, setCurrent] = useState<WhatsappVisibility | null>(null);
  const [selected, setSelected] = useState<WhatsappVisibility>("accepted_only");
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    settingsService
      .getPrivacy()
      .then((value) => {
        if (cancelled) return;
        setCurrent(value);
        setSelected(value);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function save() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      setCurrent(await settingsService.savePrivacy(selected));
      setSaved(true);
    } catch {
      setError("We couldn’t save your privacy setting. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SettingsCard title="WhatsApp number" description="Choose who can see the number on your profile.">
      {loadError && <p className="text-sm text-danger-600">We couldn’t load your privacy setting.</p>}
      {current === null && !loadError && <p className="text-sm text-ink-500">Loading…</p>}

      {current !== null && (
        <>
          <fieldset className="grid gap-3">
            <legend className="sr-only">Who can see your WhatsApp number</legend>
            {OPTIONS.map((option) => {
              const checked = selected === option.value;
              return (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 ${
                    checked ? "border-brand-600 bg-brand-50" : "border-line hover:bg-surface-subtle"
                  }`}
                >
                  <input
                    type="radio"
                    name="whatsapp-visibility"
                    value={option.value}
                    checked={checked}
                    onChange={() => {
                      setSelected(option.value);
                      setSaved(false);
                    }}
                    className="mt-1 accent-brand-600"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-ink-900">{option.label}</span>
                    <span className="block text-sm text-ink-500">{option.description}</span>
                  </span>
                </label>
              );
            })}
          </fieldset>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void save()}
              disabled={saving || selected === current}
              className={primaryButton}
            >
              {saving ? "Saving…" : "Save"}
            </button>
            {saved && (
              <span role="status" className="text-sm font-medium text-success-700">
                Privacy setting saved.
              </span>
            )}
          </div>
          {error && (
            <p role="alert" className="mt-3 text-sm text-danger-600">
              {error}
            </p>
          )}
        </>
      )}
    </SettingsCard>
  );
}