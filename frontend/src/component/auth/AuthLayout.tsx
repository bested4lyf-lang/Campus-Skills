 import type { ReactNode } from "react";
import AuthBrandPanel from "./AuthBrandPanel";

interface AuthLayoutProps {
children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
return ( 
<main className="max-w-[1200px]  mx-auto bg-surface-muted lg:grid lg:grid-cols-2"> <AuthBrandPanel />


  {/* Authentication form area */}
  <section className="flex min-h-screen flex-col px-5 py-6 sm:px-8 lg:px-12 xl:px-16">
    {/* Mobile branding */}
    <a href="/" className="mb-10 inline-flex w-fit items-center gap-3 lg:hidden">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-lg font-extrabold text-white shadow-md">
        C
      </span>

      <span className="font-display text-xl font-bold tracking-tight text-ink-900">
        Campus Skills
      </span>
    </a>

    {/* Form content */}
    <div className="flex flex-1 items-center justify-center py-6">
      <div className="w-full max-w-md">{children}</div>
    </div>

    {/* Footer */}
    <footer className="pt-6 text-center text-xs text-ink-500">
      By continuing, you agree to our{" "}
      <a
        href="/terms"
        className="font-medium text-brand-700 transition hover:text-brand-900"
      >
        Terms of Service
      </a>{" "}
      and{" "}
      <a
        href="/privacy"
        className="font-medium text-brand-700 transition hover:text-brand-900"
      >
        Privacy Policy
      </a>
      .
    </footer>
  </section>
</main>


);
}
