import { useId, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Clock, Paperclip, X } from "lucide-react";
import { formatNaira } from "./formatNaira";

/**
 * ready     can send a request
 * guest     signed out, the button sends them to the login page
 * own       the student's own listing, it cannot be requested
 * requested already has a pending or accepted request for this service
 */
export type RequestMode = "ready" | "guest" | "own" | "requested";

interface RequestCardProps {
  price: number;
  turnaround: string;
  providerFirstName: string;
  mode: RequestMode;
  onSubmit: (brief: string, files: File[]) => Promise<void>;
  onSignIn: () => void;
}

const MAX_FILES = 3;
const MAX_FILE_MB = 5;
const MAX_BRIEF = 1000;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "application/pdf"];

export default function RequestCard({
  price,
  turnaround,
  providerFirstName,
  mode,
  onSubmit,
  onSignIn,
}: RequestCardProps) {
  const [brief, setBrief] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const briefId = useId();

  const locked = mode === "own" || mode === "requested" || sent;
  const inputsDisabled = locked || mode === "guest";

  function handleFilesChosen(e: ChangeEvent<HTMLInputElement>) {
    const chosen = Array.from(e.target.files ?? []);
    e.target.value = ""; // lets the same file be picked again after removing it
    if (chosen.length === 0) return;

    if (files.length + chosen.length > MAX_FILES) {
      setFileError(`You can attach up to ${MAX_FILES} files.`);
      return;
    }
    const wrongType = chosen.find((f) => !ALLOWED_TYPES.includes(f.type));
    if (wrongType) {
      setFileError(`${wrongType.name} is not allowed. Use PNG, JPG or PDF files.`);
      return;
    }
    const tooBig = chosen.find((f) => f.size > MAX_FILE_MB * 1024 * 1024);
    if (tooBig) {
      setFileError(`${tooBig.name} is larger than ${MAX_FILE_MB} MB.`);
      return;
    }
    setFileError("");
    setFiles((prev) => [...prev, ...chosen]);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileError("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (mode === "guest") {
      onSignIn();
      return;
    }
    if (mode !== "ready" || submitting || sent) return;

    setSubmitError("");
    setSubmitting(true);
    try {
      await onSubmit(brief.trim(), files);
      setSent(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "We couldn't send your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const buttonLabel =
    sent || mode === "requested"
      ? "Request sent"
      : mode === "own"
        ? "This is your service"
        : mode === "guest"
          ? "Sign in to request"
          : submitting
            ? "Sending…"
            : "Request Service";

  const note = sent
    ? `Sent! ${providerFirstName} will read your brief and accept or reject it. You'll see it under Activity.`
    : mode === "own"
      ? "You can edit this listing from My Services."
      : mode === "requested"
        ? "You already have an open request for this service. Track it under Activity."
        : `${providerFirstName} sees your brief before he accepts or rejects. You won't be charged until he accepts.`;

  return (
    <section aria-label="Request this service" className="rounded-xl border border-line bg-surface p-5 shadow-card">
      <p className="text-xs text-ink-500">Total Price</p>
      <p className="font-display text-3xl font-bold leading-9 text-ink-900">{formatNaira(price)}</p>

      <p className="my-4 flex items-center gap-2 border-y border-line py-3 text-[13px] text-ink-700">
        <Clock aria-hidden="true" className="size-4 text-ink-500" />
        Estimated {turnaround} turnaround
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor={briefId} className="mb-1.5 block text-[13px] font-semibold text-ink-900">
          Project brief <span className="font-normal text-ink-500">(optional)</span>
        </label>

        <div className="overflow-hidden rounded-md border border-line bg-surface focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-500/30">
          <textarea
            id={briefId}
            value={brief}
            rows={3}
            maxLength={MAX_BRIEF}
            disabled={inputsDisabled}
            placeholder="What do you need, by when, and where on campus?"
            onChange={(e) => setBrief(e.target.value)}
            className="block min-h-[76px] w-full resize-y bg-transparent px-3 py-2.5 text-[13.5px] text-ink-900 placeholder:text-ink-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          />
          <button
            type="button"
            disabled={inputsDisabled || files.length >= MAX_FILES}
            onClick={() => fileInput.current?.click()}
            className="flex w-full items-center gap-1.5 border-t border-line bg-surface-muted px-3 py-2 text-left text-xs font-semibold text-brand-700 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Paperclip aria-hidden="true" className="size-3.5 shrink-0" />
            Attach reference images or brief files (Max {MAX_FILES})
          </button>
          <input
            ref={fileInput}
            type="file"
            hidden
            multiple
            accept=".png,.jpg,.jpeg,.pdf,image/png,image/jpeg,application/pdf"
            aria-label="Attach files"
            onChange={handleFilesChosen}
          />
        </div>

        {brief.length > MAX_BRIEF - 100 && (
          <p className="mt-1 text-right text-xs text-ink-500">
            {brief.length}/{MAX_BRIEF}
          </p>
        )}

        {files.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {files.map((file, i) => (
              <li
                key={`${file.name}-${i}`}
                className="flex items-center justify-between gap-2 rounded-md border border-line px-2.5 py-1.5 text-[12.5px]"
              >
                <span className="truncate text-ink-700">{file.name}</span>
                {!locked && (
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    aria-label={`Remove ${file.name}`}
                    className="flex size-6 shrink-0 items-center justify-center rounded text-ink-500 hover:bg-danger-100 hover:text-danger-600"
                  >
                    <X aria-hidden="true" className="size-3.5" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        {fileError && (
          <p role="alert" className="mt-3 text-[13px] font-medium text-danger-600">
            {fileError}
          </p>
        )}
        {submitError && (
          <p role="alert" className="mt-3 text-[13px] font-medium text-danger-600">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={locked || submitting}
          className="mt-4 h-11 w-full rounded-md bg-brand-600 text-[15px] font-semibold text-white hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:bg-brand-600/50"
        >
          {buttonLabel}
        </button>
      </form>

      <p aria-live="polite" className="mt-3 text-xs leading-5 text-ink-500">
        {note}
      </p>
    </section>
  );
}