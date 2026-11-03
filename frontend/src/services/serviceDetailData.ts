import type { ServiceDetail } from "../types/serviceDetail";

const svg = (body: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450">${body}</svg>`
  )}`

const FLYERS = svg(`
<rect width="800" height="450" fill="#dfe3fd"/>
<g transform="rotate(-6 270 220)">
  <rect x="165" y="60" width="215" height="300" rx="14" fill="#fff"/>
  <rect x="185" y="82" width="175" height="100" rx="6" fill="#4f46e5"/>
  <circle cx="272" cy="132" r="30" fill="#fbbf24"/>
  <rect x="185" y="205" width="95" height="20" rx="10" fill="#1f2937"/>
  <rect x="185" y="240" width="170" height="10" rx="5" fill="#cbd5e1"/>
  <rect x="185" y="262" width="150" height="10" rx="5" fill="#cbd5e1"/>
  <rect x="185" y="305" width="70" height="26" rx="13" fill="#f43f5e"/>
</g>
<g transform="rotate(6 540 220)">
  <rect x="430" y="40" width="220" height="330" rx="14" fill="#1f2937"/>
  <circle cx="540" cy="175" r="68" fill="#f43f5e"/>
  <circle cx="580" cy="148" r="24" fill="#fbbf24"/>
  <rect x="455" y="275" width="170" height="24" rx="12" fill="#fff"/>
  <rect x="490" y="312" width="100" height="10" rx="5" fill="#94a3b8"/>
</g>`)

const OPEN_MIC = svg(`
<rect width="800" height="450" fill="#fdf4d0"/>
<circle cx="130" cy="110" r="40" fill="#fcd96a" opacity=".7"/>
<circle cx="680" cy="350" r="55" fill="#fcd96a" opacity=".7"/>
<rect x="290" y="35" width="220" height="330" rx="14" fill="#3f4655"/>
<circle cx="400" cy="130" r="42" fill="#f4566f"/>
<rect x="381" y="125" width="38" height="10" rx="5" fill="#fff"/>
<rect x="395" y="111" width="10" height="38" rx="5" fill="#fff"/>
<text x="400" y="240" font-family="Georgia, serif" font-weight="700" font-size="30" fill="#fff" text-anchor="middle">OPEN MIC</text>
<rect x="355" y="262" width="90" height="6" rx="3" fill="#94a3b8"/>
<rect x="365" y="300" width="70" height="20" rx="10" fill="#fcd34d"/>`)

const TILES = svg(`
<rect width="800" height="450" fill="#eef1fd"/>
<rect x="120" y="130" width="170" height="150" rx="10" fill="#6d5de3"/>
<circle cx="205" cy="190" r="28" fill="#fbbf24"/>
<rect x="150" y="238" width="110" height="10" rx="5" fill="#fff"/>
<rect x="305" y="130" width="170" height="150" rx="10" fill="#f45f7b"/>
<circle cx="390" cy="190" r="28" fill="#f9a8b8"/>
<rect x="335" y="238" width="110" height="10" rx="5" fill="#fff"/>
<rect x="490" y="130" width="190" height="150" rx="10" fill="#434b5c"/>
<polygon points="585,160 625,235 545,235" fill="#34d399"/>`)

export const SAMPLE_SERVICE: Omit<ServiceDetail, "id" | "hasActiveRequest"> = {
  title: "Flyer & Poster Design",
  category: "Design & Creative",
  description:
    "I'll design a print-ready flyer or poster for your event, society, business or campaign. Send me the details, any logos and a few references for the vibe you want, and I'll come back with a first draft you can react to.",
  price: 5000,
  turnaround: "2-3 days",
  included: [
    "Custom layout built from your brief and brand colours",
    "Print-ready PDF plus a PNG sized for social media",
    "Two rounds of revisions",
    "Editable source file on request",
  ],
  images: [
    { id: "img-1", src: FLYERS, alt: "Two sample flyers" },
    { id: "img-2", src: OPEN_MIC, alt: "Open mic night poster" },
    { id: "img-3", src: TILES, alt: "Social media tile set" },
  ],
  provider: {
    id: "8",
    name: "David Okafor",
    departmentLevel: "300L CompSci",
    bio: "Third-year CS student who designs on the side. Quick replies and clean, readable layouts.",
    activeListings: 3,
  },
  rating: 4.9,
  reviewCount: 23,
  reviews: [
    {
      id: "r1",
      reviewer: "Chioma Eze",
      rating: 5,
      verified: true,
      comment: "Sorted my society's flyer well before the deadline. Clean layout and exactly what I described.",
    },
    {
      id: "r2",
      reviewer: "Emeka Nwosu",
      rating: 5,
      verified: true,
      comment: "Great communication, and the revisions came back quickly. Would hire again.",
    },
    {
      id: "r3",
      reviewer: "Amina Yusuf",
      rating: 4,
      verified: true,
      comment: "Lovely poster for our study-group event. I would have liked one more colour option.",
    },
  ],
};