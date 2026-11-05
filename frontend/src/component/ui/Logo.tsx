import { Link } from "react-router-dom";

interface LogoProps {
  /** "light" is for dark backgrounds such as the footer */
  tone?: "default" | "light";
}

export default function Logo({ tone = "default" }: LogoProps) {
  return (
    <Link
      to="/"
      aria-label="CampusSkill home"
      className="flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
    >
      <span className="flex size-7 items-center justify-center rounded-lg bg-brand-600">
        <svg
          viewBox="0 0 24 24"
          className="size-4 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </span>
      <span
        className={`font-display text-[17px] font-bold ${
          tone === "light" ? "text-white" : "text-ink-900"
        }`}
      >
        CampusSkill
      </span>
    </Link>
  );
}