import { useState } from "react";
import { Link } from "react-router-dom";
import { CircleAlert, Trash2, TriangleAlert } from "lucide-react";
import { useAccountStatus } from "../../hooks/useAccountStatus";
import { settingsService } from "../../services/settingsService";
import { authService } from "../../services/authService";
import { formatNaira } from "../../utils/format";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-500";

function messageOf(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

// The navbar keeps its own copy of the signed-in user, so a full reload is the
// simplest way to make it show the signed-out state.
function leave() {
  authService.logout();
  window.location.assign("/");
}

export default function DangerZone() {
  const { status, isLoading, error } = useAccountStatus();

  const [confirmingDeactivate, setConfirmingDeactivate] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [deactivateError, setDeactivateError] = useState<string | null>(null);

  const [understood, setUnderstood] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [password, setPassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const blocked = !!status && (status.pendingRequests > 0 || status.pendingPayout > 0);
  const canDelete =
    !!status && !blocked && understood && confirmText === "DELETE" && password.length > 0 && !deleting;

  let hint = "";
  if (blocked) hint = "Resolve your pending items to continue.";
  else if (!understood) hint = "Tick the box to continue.";
  else if (confirmText !== "DELETE") hint = "Type DELETE to continue.";
  else if (!password) hint = "Enter your password to continue.";

  async function deactivate() {
    setDeactivating(true);
    setDeactivateError(null);
    try {
      await settingsService.deactivateAccount();
      leave();
    } catch (e) {
      setDeactivateError(messageOf(e, "We couldn't deactivate your account. Please try again."));
      setDeactivating(false);
    }
  }

  async function deleteAccount() {
    setDeleting(true);
    setDeleteError(null);
    try {
      await settingsService.deleteAccount(password, confirmText);
      leave();
    } catch (e) {
      setDeleteError(messageOf(e, "We couldn't delete your account. Please try again."));
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Deactivate */}
      <section className="rounded-xl border border-accent-500 bg-surface p-5 md:p-6">
        <div className="flex items-center gap-3">
          <span className="flex size-10 flex-none items-center justify-center rounded-lg bg-accent-100 text-accent-700">
            <TriangleAlert aria-hidden="true" className="size-5" />
          </span>
          <h2 className="text-lg font-bold text-ink-900">Deactivate account</h2>
        </div>
        <p className="mt-4 text-sm text-ink-500">
          Hide your profile and listings and pause alerts. Your reviews, earnings and history are kept, and you
          can reactivate any time by signing in.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {confirmingDeactivate ? (
            <>
              <button
                type="button"
                onClick={() => void deactivate()}
                disabled={deactivating}
                className="rounded-lg bg-accent-700 px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deactivating ? "Deactivating…" : "Yes, deactivate"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmingDeactivate(false)}
                disabled={deactivating}
                className="rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink-700 hover:bg-surface-subtle disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingDeactivate(true)}
              className="rounded-lg border-2 border-accent-700 px-4 py-2 text-sm font-semibold text-accent-700 hover:bg-accent-100"
            >
              Deactivate account
            </button>
          )}
        </div>
        {deactivateError && (
          <p role="alert" className="mt-3 text-sm text-danger-600">
            {deactivateError}
          </p>
        )}
      </section>

      {/* Delete */}
      <section className="rounded-xl border border-danger-600 bg-surface p-5 md:p-6">
        <div className="flex items-center gap-3">
          <span className="flex size-10 flex-none items-center justify-center rounded-lg bg-danger-100 text-danger-600">
            <Trash2 aria-hidden="true" className="size-5" />
          </span>
          <h2 className="text-lg font-bold text-danger-800">Delete account</h2>
        </div>
        <p className="mt-4 text-sm text-ink-500">
          Permanently delete your profile, listings and reviews. This can’t be undone. If you only need a break,
          deactivate instead.
        </p>

        {isLoading && <p className="mt-4 text-sm text-ink-500">Checking your account…</p>}
        {error && (
          <p role="alert" className="mt-4 text-sm text-danger-600">
            {error}
          </p>
        )}
        {blocked && status && (
          <div
            role="alert"
            className="mt-4 flex items-start gap-3 rounded-lg border border-danger-100 bg-danger-50 p-3 text-sm text-danger-800"
          >
            <CircleAlert aria-hidden="true" className="mt-0.5 size-4 flex-none" />
            <p>
              You have{" "}
              {status.pendingRequests > 0 && (
                <strong>
                  {status.pendingRequests} pending {status.pendingRequests === 1 ? "request" : "requests"}
                </strong>
              )}
              {status.pendingRequests > 0 && status.pendingPayout > 0 && " and "}
              {status.pendingPayout > 0 && (
                <>
                  <strong>{formatNaira(status.pendingPayout)}</strong> awaiting payout
                </>
              )}
              . Resolve them first, then you can delete.{" "}
              <Link to="/activity" className="font-semibold underline">
                Go to Activity
              </Link>
            </p>
          </div>
        )}

        <label className="mt-4 flex items-start gap-2.5 text-sm text-ink-700">
          <input
            type="checkbox"
            checked={understood}
            onChange={(e) => setUnderstood(e.target.checked)}
            className="mt-0.5 size-4 rounded border-line accent-danger-600"
          />
          I understand my listings, reviews and earnings history will be erased for good.
        </label>

        <div className="mt-5 grid gap-4 sm:max-w-sm">
          <div>
            <label htmlFor="delete-confirm" className="text-sm font-semibold text-ink-900">
              Type DELETE to confirm
            </label>
            <input
              id="delete-confirm"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              autoComplete="off"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="delete-password" className="text-sm font-semibold text-ink-900">
              Your password
            </label>
            <input
              id="delete-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void deleteAccount()}
            disabled={!canDelete}
            className="rounded-lg bg-danger-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-danger-800 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-danger-600"
          >
            {deleting ? "Deleting…" : "Delete my account"}
          </button>
          {hint && <span className="text-sm text-ink-500">{hint}</span>}
        </div>
        {deleteError && (
          <p role="alert" className="mt-3 text-sm text-danger-600">
            {deleteError}
          </p>
        )}
      </section>
    </div>
  );
}