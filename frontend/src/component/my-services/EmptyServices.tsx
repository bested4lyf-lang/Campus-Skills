import { Briefcase, Plus } from "lucide-react";

interface EmptyServicesProps {
  onCreate: () => void;
}

export default function EmptyServices({ onCreate }: EmptyServicesProps) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-line bg-surface px-6 py-14 text-center shadow-card">
      <span className="flex size-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <Briefcase aria-hidden="true" className="size-8" />
      </span>
      <h2 className="mt-5 text-lg font-bold">You haven't offered any services yet.</h2>
      <p className="mt-2 max-w-sm text-sm text-ink-500">
        Turn your design, tutoring, or photography skills into campus income.
      </p>
      <button
        type="button"
        onClick={onCreate}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
      >
        <Plus aria-hidden="true" className="size-4" />
        Create Your First Listing
      </button>
    </div>
  );
}