import { Link } from "react-router-dom";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Logo from "../ui/Logo";
import {
  CONTACT_DETAILS,
  FOOTER_LINK_GROUPS,
  LEGAL_LINKS,
  SOCIAL_LINKS,
} from "./footerLinks";

const linkClass =
  "rounded-sm text-sm text-white/70 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500";

const socialClass =
  "flex size-9 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-brand-950">
      <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-6 md:py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1.3fr]">
          {/* About */}
          <section aria-labelledby="footer-about" className="sm:col-span-2 lg:col-span-1">
            <Logo tone="light" />
            <h2 id="footer-about" className="sr-only">
              About CampusSkill
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">
              CampusSkill is a student marketplace. Offer your skills, hire a
              classmate, and earn on campus, all from one account. Built by
              students, for students.
            </p>

            <div className="mt-5 flex items-center gap-2">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="CampusSkill on Instagram"
                className={socialClass}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
                </svg>
              </a>
              <a
                href={CONTACT_DETAILS.whatsapp}
                target="_blank"
                rel="noreferrer"
                aria-label="Chat with us on WhatsApp"
                className={socialClass}
              >
                <MessageCircle aria-hidden="true" className="size-4" />
              </a>
              <a
                href={`mailto:${CONTACT_DETAILS.email}`}
                aria-label="Email CampusSkill"
                className={socialClass}
              >
                <Mail aria-hidden="true" className="size-4" />
              </a>
            </div>
          </section>

          {/* Link columns */}
          {FOOTER_LINK_GROUPS.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-sm font-semibold text-white">{group.title}</h2>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Contact details */}
          <section aria-labelledby="footer-contact" className="sm:col-span-2 lg:col-span-1">
            <h2 id="footer-contact" className="text-sm font-semibold text-white">
              Contact Us
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2.5">
                <Mail aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-white/50" />
                <a href={`mailto:${CONTACT_DETAILS.email}`} className="break-all hover:text-white">
                  {CONTACT_DETAILS.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-white/50" />
                <a
                  href={`tel:${CONTACT_DETAILS.phone.replace(/\s/g, "")}`}
                  className="hover:text-white"
                >
                  {CONTACT_DETAILS.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-white/50" />
                <span>{CONTACT_DETAILS.address}</span>
              </li>
              <li className="pl-[26px] text-xs text-white/50">{CONTACT_DETAILS.hours}</li>
            </ul>
          </section>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-white/70">
              © {year} CampusSkill. All rights reserved. Built by students, for students.
            </p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 max-w-4xl text-xs leading-5 text-white/50">
            Copyright notice: the CampusSkill name, logo, design and platform
            content are protected. Listings, images and reviews belong to the
            students who post them. You may not copy, reproduce or redistribute
            any content from this site without written permission.
          </p>
        </div>
      </div>
    </footer>
  );
}