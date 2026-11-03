import { useId, useState } from "react";
import type { FormEvent } from "react";
import { Star, X } from "lucide-react";
import Avatar from "../ui/Avatar";
import Modal from "../ui/Modal";
import StatusPill from "./StatusPill";
import { formatNaira } from "./format";
import type { ReviewInput, ServiceRequest } from "../../types/activity";

interface ReviewModalProps {
  request: ServiceRequest;
  onClose: () => void;
  onSubmit: (input: ReviewInput) => Promise<void>;
}

const RATING_LABELS = ["Poor", "Fair", "Good", "Very good", "Excellent"];
const HIGHLIGHTS = ["Clear communication", "On time", "Great quality", "Good value"];
const MAX_COMMENT = 300;

export default function ReviewModal({ request, onClose, onSubmit }: ReviewModalProps) {
  const uid = useId();
  const [rating, setRating] = useState(0);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [ratingError, setRatingError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const firstName = request.person.name.split(" ")[0];

  function toggleHighlight(item: string) {
    setHighlights((current) => (current.includes(item) ? current.filter((h) => h !== item) : [...current, item]));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (rating === 0) {
      setRatingError("Choose a star rating before you submit.");
      return;
    }

    setSubmitError("");
    setSubmitting(true);
    try {
      await onSubmit({ rating, highlights, comment: comment.trim() });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "We couldn't save your review. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <Modal labelledBy={`${uid}-title`} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <StatusPill status="completed" />
            <h2 id={`${uid}-title`} className="mt-3 text-2xl font-bold">
              How did it go?
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-9 shrink-0 items-center justify-center rounded-md border border-line text-ink-700 hover:bg-surface-subtle"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-xl bg-surface-muted p-3">
          <Avatar id={request.person.id} name={request.person.name} size={44} />
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink-900">{request.serviceTitle}</p>
            <p className="text-sm text-ink-500">
              by {request.person.name} · {formatNaira(request.price)}
            </p>
          </div>
        </div>

        <p id={`${uid}-rating`} className="mt-5 text-sm font-bold text-ink-900">
          Your rating
        </p>
        <div className="mt-2 flex items-center gap-3">
          <div role="radiogroup" aria-labelledby={`${uid}-rating`} className="flex gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={rating === value}
                aria-label={`${value} ${value === 1 ? "star" : "stars"}, ${RATING_LABELS[value - 1]}`}
                data-autofocus={value === 1 ? true : undefined}
                onClick={() => {
                  setRating(value);
                  setRatingError("");
                }}
                className="rounded p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              >
                <Star
                  aria-hidden="true"
                  className={`size-8 ${value <= rating ? "fill-accent-500 text-accent-500" : "fill-transparent text-ink-400"}`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && <span className="text-sm font-semibold text-accent-700">{RATING_LABELS[rating - 1]}</span>}
        </div>
        {ratingError && (
          <p role="alert" className="mt-2 text-sm font-medium text-danger-600">
            {ratingError}
          </p>
        )}

        <p className="mt-5 text-sm font-bold text-ink-900">
          What stood out? <span className="font-normal text-ink-500">(optional)</span>
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {HIGHLIGHTS.map((item) => {
            const chosen = highlights.includes(item);
            return (
              <button
                key={item}
                type="button"
                aria-pressed={chosen}
                onClick={() => toggleHighlight(item)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  chosen
                    ? "border-brand-600 bg-brand-50 text-brand-700"
                    : "border-line text-ink-900 hover:bg-surface-subtle"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        <label htmlFor={`${uid}-comment`} className="mt-5 block text-sm font-bold text-ink-900">
          Write a review <span className="font-normal text-ink-500">(optional)</span>
        </label>
        <textarea
          id={`${uid}-comment`}
          value={comment}
          rows={4}
          maxLength={MAX_COMMENT}
          placeholder={`Tell other students what it was like to work with ${firstName}.`}
          onChange={(e) => setComment(e.target.value)}
          className="mt-2 w-full resize-y rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        />
        <div className="mt-1.5 flex items-start justify-between gap-3 text-xs text-ink-500">
          <span>Your review is public on {firstName}'s service listing.</span>
          <span className="shrink-0">
            {comment.length} / {MAX_COMMENT} characters
          </span>
        </div>

        {submitError && (
          <p role="alert" className="mt-4 text-sm font-medium text-danger-600">
            {submitError}
          </p>
        )}

        <div className="mt-6 grid grid-cols-[1fr_auto] gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Submit review"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-md border border-line px-5 py-3 text-sm font-semibold text-ink-900 hover:bg-surface-subtle disabled:opacity-60"
          >
            Maybe later
          </button>
        </div>
      </form>
    </Modal>
  );
}