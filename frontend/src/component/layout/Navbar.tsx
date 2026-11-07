import { Link, NavLink } from "react-router-dom";
import Logo from "../ui/Logo";
import UserMenu from "./UserMenu";
import NotificationsMenu from "./NotificationsMenu";
import { NAV_ITEMS } from "./navItems";
import type { User } from "../../types/user";

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  activityCount: number;
}

export default function Navbar({ user, onLogout, activityCount }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-4 px-4 md:grid md:grid-cols-[1fr_auto_1fr] md:px-6">
        <Logo />

        {/* Desktop tabs */}
        <nav aria-label="Main" className="hidden h-full md:flex md:gap-2">
          {NAV_ITEMS.map(({ label, to, hasCount }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `relative flex h-full items-center gap-2 px-4 text-sm transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-brand-600 ${
                  isActive
                    ? "font-semibold text-ink-900 after:opacity-100"
                    : "font-medium text-ink-500 after:opacity-0 hover:text-ink-900"
                }`
              }
            >
              {label}
              {hasCount && user && activityCount > 0 && (
                <span className="rounded-full bg-surface-subtle px-1.5 text-xs font-semibold text-ink-700">
                  {activityCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-1 sm:gap-2">
          {user ? (
            <>
              <NotificationsMenu />
              <UserMenu user={user} onLogout={onLogout} />
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md px-3 py-2 text-sm font-semibold text-ink-900 hover:text-brand-700"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700 sm:px-4 sm:py-2.5"
              >
                <span className="sm:hidden">Join</span>
                <span className="hidden sm:inline">Create Account</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}