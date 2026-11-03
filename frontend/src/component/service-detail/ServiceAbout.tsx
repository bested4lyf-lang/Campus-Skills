import { Check } from "lucide-react";

interface ServiceAboutProps {
  description: string;
  included: string[];
}

export default function ServiceAbout({ description, included }: ServiceAboutProps) {
  return (
    <section aria-labelledby="about-title" className="rounded-xl border border-line bg-surface p-5 md:p-6">
      <h2 id="about-title" className="text-lg font-bold">
        About this service
      </h2>
      <p className="mt-3 text-sm leading-6 text-ink-700">{description}</p>

      {included.length > 0 && (
        <>
          <h3 className="mt-5 text-sm font-bold">What's included</h3>
          <ul className="mt-3 grid gap-x-5 gap-y-3 sm:grid-cols-2 xl:grid-cols-3">
            {included.map((item) => (
              <li key={item} className="flex items-start gap-2 text-[13.5px] leading-5 text-ink-700">
                <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success-700" />
                {item}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}