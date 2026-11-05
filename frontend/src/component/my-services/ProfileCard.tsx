import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";
import Avatar from "../ui/Avatar";
import type { ProfileSummary } from "../../types/myServices";
import type { User } from "../../types/user";

interface ProfileCardProps {
  user: User;
  summary: ProfileSummary | null;
  servicesCount: number;
}

export default function ProfileCard({ user, summary, servicesCount }: ProfileCardProps) {
  const subtitle = [user.department, user.level].filter(Boolean).join(" · ");

  return (
    <section
      aria-label="Your profile"
      className="overflow-hidden rounded-xl border border-line bg-surface shadow-card"
    >
      <div className="h-16 bg-brand-100" />
      <div className="px-5 pb-5">
        <div className="-mt-10">
          <Avatar
            id={user.id}
            name={user.fullName}
            size={80}
            className="ring-4 ring-surface"
          />
        </div>

        <h2 className="mt-3 text-xl font-bold">{user.fullName}</h2>
        {subtitle && <p className="text-sm text-ink-500">{subtitle}</p>}

        {summary ? (
          <>
            <p className="mt-3 text-sm leading-6 text-ink-700">{summary.bio}</p>

            {summary.skills.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">Skills</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {summary.skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <div className="mt-3 space-y-2" aria-hidden="true">
            <div className="h-3 w-full animate-pulse rounded bg-surface-subtle" />
            <div className="h-3 w-4/5 animate-pulse rounded bg-surface-subtle" />
          </div>
        )}

        <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-line pt-4">
          <div>
            <dd className="text-lg font-bold text-ink-900">{summary?.jobsDone ?? "–"}</dd>
            <dt className="text-xs text-ink-500">Jobs done</dt>
          </div>
          <div>
            <dd className="text-lg font-bold text-ink-900">
              {summary?.rating != null ? summary.rating.toFixed(1) : "–"}
            </dd>
            <dt className="text-xs text-ink-500">Rating</dt>
          </div>
          <div>
            <dd className="text-lg font-bold text-ink-900">{servicesCount}</dd>
            <dt className="text-xs text-ink-500">Services</dt>
          </div>
        </dl>

        <Link
          to="/profile/edit"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-md border border-line px-4 py-2.5 text-sm font-semibold text-ink-900 hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >
          <Pencil aria-hidden="true" className="size-4" />
          Edit profile
        </Link>
      </div>
    </section>
  );
}