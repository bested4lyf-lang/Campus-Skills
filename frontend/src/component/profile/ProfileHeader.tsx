import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";
import ProfileAvatar from "./ProfileAvatar";
import type { StudentProfile } from "../../types/profile";

interface ProfileHeaderProps {
  profile: StudentProfile;
  /** True when the signed-in student is looking at their own profile */
  isOwn: boolean;
}

const hintLink =
  "rounded-sm font-semibold text-brand-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500";

export default function ProfileHeader({ profile, isOwn }: ProfileHeaderProps) {
  const subtitle = [profile.department, profile.level].filter(Boolean).join(" · ");

  return (
    <section aria-labelledby="profile-name" className="overflow-hidden rounded-xl border border-line bg-surface shadow-card">
      <div className="h-24 bg-brand-100 md:h-28" />

      <div className="px-5 pb-6 md:px-8">
        <div className="-mt-12 flex flex-wrap items-end justify-between gap-4 md:-mt-14">
          <ProfileAvatar
            id={profile.id}
            name={profile.fullName}
            photoUrl={profile.photoUrl}
            size={104}
            className="ring-4 ring-surface"
          />
          {isOwn && (
            <Link
              to="/profile/edit"
              className="inline-flex items-center gap-2 rounded-md border border-line px-4 py-2.5 text-sm font-semibold text-ink-900 hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              <Pencil aria-hidden="true" className="size-4" />
              Edit profile
            </Link>
          )}
        </div>

        <h1 id="profile-name" className="mt-4 text-2xl font-bold md:text-3xl">
          {profile.fullName}
        </h1>

        {subtitle ? (
          <p className="mt-1 text-sm text-ink-500">{subtitle}</p>
        ) : (
          isOwn && (
            <p className="mt-1 text-sm text-ink-500">
              <Link to="/profile/edit" className={hintLink}>
                Add your department and level
              </Link>
            </p>
          )
        )}

        {profile.bio ? (
          <p className="mt-4 max-w-2xl text-[15px] leading-6 text-ink-700">{profile.bio}</p>
        ) : (
          isOwn && (
            <p className="mt-4 text-sm text-ink-500">
              <Link to="/profile/edit" className={hintLink}>
                Add a short bio
              </Link>{" "}
              so students know what you do.
            </p>
          )
        )}

        {profile.skills.length > 0 && (
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">Skills</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <li key={skill} className="rounded-full bg-brand-50 px-3 py-1 text-[13px] font-medium text-brand-700">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        )}

        <dl className="mt-6 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-5">
          <div>
            <dd className="text-xl font-bold text-ink-900">{profile.jobsDone}</dd>
            <dt className="text-xs text-ink-500">Jobs done</dt>
          </div>
          <div>
            <dd className="text-xl font-bold text-ink-900">{profile.rating !== null ? profile.rating.toFixed(1) : "–"}</dd>
            <dt className="text-xs text-ink-500">Rating</dt>
          </div>
          <div>
            <dd className="text-xl font-bold text-ink-900">{profile.listings.length}</dd>
            <dt className="text-xs text-ink-500">Services</dt>
          </div>
        </dl>
      </div>
    </section>
  );
}