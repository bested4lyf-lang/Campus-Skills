import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, LogOut, Pencil, Settings, UserRound } from "lucide-react";
import Avatar from "../ui/Avatar";
import type { User } from "../../types/user";

interface UserMenuProps {
  user: User;
  onLogout: () => void;
}

const itemBase =
  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm";
const itemDefault = `${itemBase} text-ink-700 hover:bg-surface-subtle`;
const itemDanger = `${itemBase} text-danger-600 hover:bg-danger-50`;

export default function UserMenu({ user, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const subtitle = [user.department, user.level].filter(Boolean).join(" · ");
  const close = () => setOpen(false);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 rounded-full p-1 hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
      >
        <Avatar id={user.id} name={user.fullName} />
        <ChevronDown
          aria-hidden="true"
          className={`hidden size-4 text-ink-500 transition-transform sm:block ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-line bg-surface p-1.5 shadow-popover"
        >
          <div className="px-3 py-2.5">
            <p className="truncate text-sm font-semibold text-ink-900">
              {user.fullName}
            </p>
            {subtitle && (
              <p className="truncate text-xs text-ink-500">{subtitle}</p>
            )}
          </div>
          <div className="my-1 h-px bg-line" />

          <Link role="menuitem" to="/profile" onClick={close} className={itemDefault}>
            <UserRound aria-hidden="true" className="size-4" />
            View Public Profile
          </Link>
          <Link role="menuitem" to="/profile/edit" onClick={close} className={itemDefault}>
            <Pencil aria-hidden="true" className="size-4" />
            Edit Profile &amp; Skills
          </Link>
          <Link role="menuitem" to="/settings" onClick={close} className={itemDefault}>
            <Settings aria-hidden="true" className="size-4" />
            Account Settings
          </Link>

          <div className="my-1 h-px bg-line" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              close();
              onLogout();
            }}
            className={itemDanger}
          >
            <LogOut aria-hidden="true" className="size-4" />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
