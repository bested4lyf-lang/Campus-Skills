import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "./navItems";

interface BottomTabsProps {
  activityCount: number;
}

export default function BottomTabs({ activityCount }: BottomTabsProps) {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="grid grid-cols-3">
        {NAV_ITEMS.map(({ label, to, icon: Icon, hasCount }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${
                  isActive ? "text-brand-600" : "text-ink-500"
                }`
              }
            >
              <span className="relative">
                <Icon aria-hidden="true" className="size-5" />
                {hasCount && activityCount > 0 && (
                  <span className="absolute -right-2.5 -top-1.5 flex min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-semibold leading-4 text-white">
                    {activityCount}
                  </span>
                )}
              </span>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
