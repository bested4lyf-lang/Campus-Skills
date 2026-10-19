
export default function AuthBrandPanel() {
  return (
    <aside className="relative hidden min-h-screen overflow-hidden bg-brand-950 px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:px-16">
      {/* Decorative background shapes */}
      <div
        aria-hidden="true"
        className="absolute -right-24 top-32 h-72 w-72 rounded-full bg-brand-700/30 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-brand-500/20 blur-3xl"
      />

      {/* Brand */}
      <a
        href="/"
        className="relative z-10 inline-flex w-fit items-center gap-3"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-xl font-extrabold text-white shadow-lg">
          C
        </span>

        <span className="font-display text-xl font-bold tracking-tight text-white">
          Campus Skills
        </span>
      </a>

      {/* Main content */}
      <div className="relative z-10 max-w-lg py-16">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-indigo-100">
          <span className="h-2 w-2 rounded-full bg-accent-400" />
          Learn. Share. Grow.
        </span>

        <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
          Your skills have a place to{" "}
          <span className="text-accent-400">shine.</span>
        </h1>

        <p className="mt-6 max-w-md text-base leading-8 text-indigo-100/80">
          Connect with students, share what you know, discover new opportunities,
          and turn your skills into something meaningful.
        </p>

        {/* Feature highlights */}
        <div className="mt-10 space-y-5">
          <div className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg text-accent-400">
              ↗
            </span>

            <div>
              <h2 className="font-semibold text-white">
                Showcase your skills
              </h2>

              <p className="mt-1 text-sm leading-6 text-indigo-100/70">
                Let your abilities open doors to new opportunities.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg text-accent-400">
              ✳
            </span>

            <div>
              <h2 className="font-semibold text-white">
                Find your community
              </h2>

              <p className="mt-1 text-sm leading-6 text-indigo-100/70">
                Meet people who want to learn, collaborate, and grow.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="relative z-10 text-sm text-indigo-100/60">
        © {new Date().getFullYear()} Campus Skills. Built for student growth.
      </p>
    </aside>
  );
}

