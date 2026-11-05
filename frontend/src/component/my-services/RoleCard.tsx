import { Link } from "react-router-dom";
import type { ProfileSummary } from "../../types/myServices";

interface RoleCardProps {
  summary: ProfileSummary | null;
}

const rowClass =
  "flex items-center justify-between rounded-lg bg-white/10 px-3.5 py-3 text-sm font-medium text-white hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400";

export default function RoleCard({ summary }: RoleCardProps) {
  return (
    <section aria-labelledby="role-card-title" className="rounded-xl bg-brand-900 p-5 text-white">
      <h2 id="role-card-title" className="text-base font-bold text-white">
        One account, two roles
      </h2>
      <p className="mt-2 text-sm leading-6 text-brand-200">
        Offer services as a provider and hire others as a customer, all from the same account.
      </p>

      <div className="mt-4 space-y-2">
        <Link to="/activity" className={rowClass}>
          Client work
          {summary && summary.pendingClientWork > 0 && (
            <span className="rounded-full bg-accent-400 px-2.5 py-0.5 text-xs font-bold text-ink-900">
              {summary.pendingClientWork} pending
            </span>
          )}
        </Link>
        <Link to="/activity" className={rowClass}>
          My hires
          {summary && <span className="text-xs font-semibold text-brand-200">{summary.totalHires} total</span>}
        </Link>
      </div>
    </section>
  );
}