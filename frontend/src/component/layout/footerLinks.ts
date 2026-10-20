// Footer content lives here so it can be edited without touching Footer.tsx.
// TODO: replace the placeholder contact details and social links with the real ones.

export interface FooterLink {
  label: string;
  to: string;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

export const FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
  {
    title: "Marketplace",
    links: [
      { label: "Discover", to: "/" },
      { label: "My Services", to: "/my-services" },
      { label: "Activity", to: "/activity" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "How It Works", to: "/how-it-works" },
      { label: "Safety Tips", to: "/safety" },
      { label: "Community Guidelines", to: "/guidelines" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", to: "/help" },
      { label: "Contact Us", to: "/contact" },
      { label: "Terms of Service", to: "/terms" },
      { label: "Privacy Policy", to: "/privacy" },
    ],
  },
];

export const CONTACT_DETAILS = {
  email: "support@campusskill.ng",
  phone: "+234 800 000 0000",
  whatsapp: "https://wa.me/2348000000000",
  address: "Lagos, Nigeria",
  hours: "Mon to Fri, 9am to 5pm (WAT)",
};

export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/campusskill",
};

// Small links shown in the bottom bar next to the copyright line
export const LEGAL_LINKS: FooterLink[] = [
  { label: "Help", to: "/help" },
  { label: "Safety tips", to: "/safety" },
  { label: "Terms", to: "/terms" },
  { label: "Privacy", to: "/privacy" },
];