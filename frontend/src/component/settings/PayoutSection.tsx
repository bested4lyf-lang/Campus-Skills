import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import SettingsCard from "./SettingsCard";
import { fieldClass, primaryButton } from "./settingsStyles";
import { settingsService } from "../../services/settingsService";
import { formatNaira } from "../../utils/format";
import type { Bank } from "../../types/settings";

export default function PayoutSection() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [balance, setBalance] = useState(0);
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([settingsService.listBanks(), settingsService.getPayoutInfo()])
      .then(([bankList, info]) => {
        if (cancelled) return;
        setBanks(bankList);
        setBalance(info.pendingPayoutBalance);
        setBankName(info.bankName);
        setAccountNumber(info.accountNumber);
        setAccountName(info.accountName);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const numberValid = /^\d{10}$/.test(accountNumber);
  const numberInvalid = accountNumber.length > 0 && !numberValid;
  const canSave = !!bankName && numberValid && accountName.trim().length >= 3 && !saving;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSave) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await settingsService.savePayoutInfo({ bankName, accountNumber, accountName });
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn’t save your bank details. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface-muted p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Awaiting payout</p>
          <p className="mt-1 text-2xl font-bold text-ink-900">{formatNaira(balance)}</p>
        </div>
        <p className="max-w-xs text-right text-sm text-ink-500">Payouts are sent to the account below.</p>
      </div>

      <SettingsCard title="Bank account" description="Where students’ payments reach you. Use an account in your own name.">
        {loading && <p className="text-sm text-ink-500">Loading your details…</p>}
        {loadError && <p className="text-sm text-danger-600">We couldn’t load your bank details.</p>}

        {!loading && !loadError && (
          <form onSubmit={(e) => void submit(e)} className="grid gap-4 sm:max-w-sm">
            <div>
              <label htmlFor="payout-bank" className="text-sm font-semibold text-ink-900">
                Bank
              </label>
              <select
                id="payout-bank"
                value={bankName}
                onChange={(e) => {
                  setBankName(e.target.value);
                  setSaved(false);
                }}
                className={fieldClass}
              >
                <option value="">Select your bank</option>
                {banks.map((bank) => (
                  <option key={bank.code} value={bank.code}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="payout-number" className="text-sm font-semibold text-ink-900">
                Account number
              </label>
              <input
                id="payout-number"
                inputMode="numeric"
                maxLength={10}
                value={accountNumber}
                onChange={(e) => {
                  setAccountNumber(e.target.value.replace(/\D/g, ""));
                  setSaved(false);
                }}
                placeholder="10-digit NUBAN number"
                className={fieldClass}
              />
              {numberInvalid && <p className="mt-1 text-xs text-danger-600">Enter exactly 10 digits.</p>}
            </div>
            <div>
              <label htmlFor="payout-name" className="text-sm font-semibold text-ink-900">
                Account name
              </label>
              <input
                id="payout-name"
                value={accountName}
                onChange={(e) => {
                  setAccountName(e.target.value);
                  setSaved(false);
                }}
                placeholder="As it appears on your bank records"
                className={fieldClass}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button type="submit" disabled={!canSave} className={primaryButton}>
                {saving ? "Saving…" : "Save bank details"}
              </button>
              {saved && (
                <span role="status" className="text-sm font-medium text-success-700">
                  Bank details saved.
                </span>
              )}
            </div>
            {error && (
              <p role="alert" className="text-sm text-danger-600">
                {error}
              </p>
            )}
          </form>
        )}
      </SettingsCard>
    </div>
  );
}