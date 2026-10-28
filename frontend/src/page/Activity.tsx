import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { X } from "lucide-react";
import ActivityBoard from "../component/activity/ActivityBoard";
import BriefModal from "../component/activity/BriefModal";
import ReviewModal from "../component/activity/ReviewModal";
import { useActivity } from "../hooks/useActivity";
import { useAuth } from "../hooks/useAuth";
import type { ActivityTab, ReviewInput, ServiceRequest } from "../types/activity";

const SUBTITLES: Record<ActivityTab, string> = {
  "client-work":
    "Students asking for your services. Read each brief, accept or decline new requests, then mark accepted work as completed.",
  "my-hires": "Services you've hired. Track each request and leave a review once the work is done.",
};

const firstName = (request: ServiceRequest) => request.person.name.split(" ")[0];

export default function Activity() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const activity = useActivity();

  const [briefId, setBriefId] = useState<string | null>(null);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");

  const tab: ActivityTab = params.get("tab") === "my-hires" ? "my-hires" : "client-work";
  const requests = tab === "client-work" ? activity.clientWork : activity.myHires;
  const pendingCount = activity.clientWork.filter((r) => r.status === "pending").length;
  const briefRequest = requests.find((r) => r.id === briefId) ?? null;
  const reviewRequest = requests.find((r) => r.id === reviewId) ?? null;

  // Hide the success message after a few seconds
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 5000);
    return () => clearTimeout(timer);
  }, [notice]);

  // Activity is only for signed-in students
  if (!user) return <Navigate to="/login" replace />;

  function changeTab(next: ActivityTab) {
    if (next === tab) return;
    setBriefId(null);
    setReviewId(null);
    setActionError("");
    setParams({ tab: next }, { replace: true });
  }

  async function run(request: ServiceRequest, action: () => Promise<void>, success: string, closeBrief: boolean) {
    setBusyId(request.id);
    setActionError("");
    try {
      await action();
      setNotice(success);
      if (closeBrief) setBriefId(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  // Accepting keeps the brief open so the provider can see the WhatsApp number that was just unlocked
  const accept = (r: ServiceRequest) =>
    run(r, () => activity.accept(r.id), `You accepted ${firstName(r)}'s request. Their WhatsApp number is now available.`, false);
  const decline = (r: ServiceRequest) => run(r, () => activity.decline(r.id), "Request declined.", true);
  const complete = (r: ServiceRequest) =>
    run(r, () => activity.complete(r.id), `Marked as completed. ${firstName(r)} can now leave you a review.`, true);

  function openReview(request: ServiceRequest) {
    setBriefId(null);
    setActionError("");
    setReviewId(request.id);
  }

  async function submitReview(request: ServiceRequest, input: ReviewInput) {
    await activity.submitReview(request.id, input);
    setReviewId(null);
    setNotice(`Thanks! Your review is now public on ${firstName(request)}'s listing.`);
  }

  const tabButton = (value: ActivityTab, label: string, count: number) => (
    <button
      type="button"
      aria-pressed={tab === value}
      onClick={() => changeTab(value)}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
        tab === value ? "bg-surface text-brand-700 shadow-card" : "text-ink-700 hover:text-ink-900"
      }`}
    >
      {label} <span className="font-medium">( {count} )</span>
    </button>
  );

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-6 md:py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold md:text-3xl">Activity</h1>
          <p className="mt-1 text-sm text-ink-500">{SUBTITLES[tab]}</p>
        </div>
        <div className="inline-flex rounded-xl border border-line bg-surface-subtle p-1">
          {tabButton("client-work", "Client Work", pendingCount)}
          {tabButton("my-hires", "My Hires", activity.myHires.length)}
        </div>
      </div>

      {notice && (
        <div
          role="status"
          className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-success-100 bg-success-50 px-4 py-3 text-sm font-medium text-success-700"
        >
          {notice}
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss message"
            className="shrink-0 rounded p-1 hover:bg-success-100"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>
      )}

      {actionError && !briefRequest && (
        <p role="alert" className="mt-5 rounded-lg border border-danger-100 bg-danger-50 px-4 py-3 text-sm font-medium text-danger-800">
          {actionError}
        </p>
      )}

      <div className="mt-6">
        {activity.isLoading ? (
          <div className="grid gap-4 lg:grid-cols-4" aria-busy="true">
            {[0, 1, 2, 3].map((n) => (
              <div key={n} className="h-64 animate-pulse rounded-2xl bg-surface-subtle" />
            ))}
          </div>
        ) : activity.error ? (
          <div role="alert" className="rounded-xl border border-danger-100 bg-danger-50 p-6 text-center">
            <p className="text-sm font-medium text-danger-800">{activity.error}</p>
            <button
              type="button"
              onClick={() => void activity.reload()}
              className="mt-4 rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Try again
            </button>
          </div>
        ) : (
          <ActivityBoard
            requests={requests}
            tab={tab}
            busyId={busyId}
            onViewBrief={(r) => {
              setActionError("");
              setBriefId(r.id);
            }}
            onAccept={accept}
            onDecline={decline}
            onComplete={complete}
            onReview={openReview}
          />
        )}
      </div>

      {briefRequest && (
        <BriefModal
          request={briefRequest}
          tab={tab}
          busy={busyId === briefRequest.id}
          error={actionError}
          onClose={() => setBriefId(null)}
          onAccept={() => void accept(briefRequest)}
          onDecline={() => void decline(briefRequest)}
          onComplete={() => void complete(briefRequest)}
          onReview={() => openReview(briefRequest)}
        />
      )}

      {reviewRequest && (
        <ReviewModal
          request={reviewRequest}
          onClose={() => setReviewId(null)}
          onSubmit={(input) => submitReview(reviewRequest, input)}
        />
      )}
    </div>
  );
}