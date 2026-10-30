import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { X } from "lucide-react";
import EditProfileModal from "../component/profile/EditProfileModal";
import ProfileHeader from "../component/profile/ProfileHeader";
import ProfileListings from "../component/profile/ProfileListings";
import ProfileReviews from "../component/profile/ProfileReviews";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import type { ProfileFormValues } from "../types/profile";

interface PublicProfileProps {
  /** True on /profile/edit, which shows the Edit profile popup over the student's own profile */
  editing?: boolean;
}

const pageClass = "mx-auto max-w-[1100px] px-4 py-6 md:px-6 md:py-8";

export default function PublicProfile({ editing = false }: PublicProfileProps) {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // /profile has no id, so it shows the signed-in student's own profile
  const profileId = id ?? user?.id;
  const { profile, state, reload, save } = useProfile(profileId, user);
  const [notice, setNotice] = useState("");

  // The edit popup sends a message along when it returns to the profile
  useEffect(() => {
    const message = (location.state as { notice?: string } | null)?.notice;
    if (message) setNotice(message);
  }, [location.state]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 5000);
    return () => clearTimeout(timer);
  }, [notice]);

  if (!profileId) return <Navigate to="/login" replace />;

  const isOwn = !!user && profileId === user.id;

  async function handleSave(values: ProfileFormValues) {
    await save(values);
    navigate("/profile", { replace: true, state: { notice: "Your profile was updated." } });
  }

  if (state === "loading") {
    return (
      <div className={pageClass} aria-busy="true">
        <div className="h-72 animate-pulse rounded-xl bg-surface-subtle" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="h-36 animate-pulse rounded-xl bg-surface-subtle" />
          <div className="h-36 animate-pulse rounded-xl bg-surface-subtle" />
        </div>
      </div>
    );
  }

  if (state === "notFound" || state === "error" || !profile) {
    const notFound = state === "notFound";
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">{notFound ? "We couldn't find this student" : "We couldn't load this profile"}</h1>
        <p className="mt-2 text-sm text-ink-500">
          {notFound ? "The profile may have been removed, or the link is wrong." : "Check your connection and try again."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          {!notFound && (
            <button
              type="button"
              onClick={reload}
              className="rounded-md bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Try again
            </button>
          )}
          <Link
            to="/"
            className="rounded-md border border-brand-200 px-4 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50"
          >
            Back to Discover
          </Link>
        </div>
      </div>
    );
  }

  const firstName = profile.fullName.split(" ")[0];

  return (
    <div className={pageClass}>
      {notice && (
        <div
          role="status"
          className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-success-100 bg-success-50 px-4 py-3 text-sm font-medium text-success-700"
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

      <ProfileHeader profile={profile} isOwn={isOwn} />

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <ProfileListings listings={profile.listings} firstName={firstName} isOwn={isOwn} />
        <ProfileReviews reviews={profile.reviews} />
      </div>

      {editing && (
        <EditProfileModal profile={profile} onClose={() => navigate("/profile", { replace: true })} onSave={handleSave} />
      )}
    </div>
  );
}