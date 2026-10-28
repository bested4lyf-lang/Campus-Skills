import type { ActivityData, ReviewInput, ServiceRequest } from "../types/activity";

/**
 * Keeps the requests in memory and enforces the request rules the backend
 * will need to enforce too: only pending requests can be accepted or declined,
 * only accepted work can be completed, and only completed hires can be
 * reviewed, once. The page and hooks only call these methods.
 */

// A customer's number is revealed to the provider only after the request is accepted
const WHATSAPP: Record<string, string> = {
  "u-tolu": "+2348035550142",
  "u-kelechi": "+2348035550177",
};

let clientWork: ServiceRequest[] = [
  {
    id: "cw-1",
    status: "pending",
    serviceTitle: "Event photography, 2 hours",
    price: 15000,
    requestedAt: "2026-10-08T09:30:00",
    neededBy: "2026-10-17T15:00:00",
    campusLocation: "Faculty of Arts Amphitheatre",
    brief:
      "Need photos of our Theatre Arts freshers' welcome night: guests arriving, the three performances and one big group shot at the end. Warm, candid style please. The hall is dim, so bring your own flash. I've attached the venue map and a look I like.",
    attachments: [
      { id: "a1", name: "venue-map.png", kind: "image" },
      { id: "a2", name: "mood-ref.jpg", kind: "image" },
      { id: "a3", name: "shot-list.pdf", kind: "pdf" },
    ],
    person: { id: "u-tolu", name: "Tolu Martins", departmentLevel: "Theatre Arts • 200L" },
    reviewed: false,
  },
  {
    id: "cw-2",
    status: "pending",
    serviceTitle: "Portrait session on campus",
    price: 8000,
    requestedAt: "2026-10-09T14:10:00",
    neededBy: "2026-10-16T11:00:00",
    campusLocation: "Main library steps",
    brief: "LinkedIn headshots plus a few relaxed shots for my portfolio. About 30 minutes.",
    attachments: [],
    person: { id: "u-kelechi", name: "Kelechi Obi", departmentLevel: "Accounting • 300L" },
    reviewed: false,
  },
  {
    id: "cw-3",
    status: "accepted",
    serviceTitle: "Product photos for small businesses",
    price: 12000,
    requestedAt: "2026-10-05T10:00:00",
    neededBy: "2026-10-15T16:00:00",
    campusLocation: "Hostel B common room",
    brief:
      "About 20 shots of my thrift sneakers on a plain white background, plus 5 lifestyle shots outdoors. For my Instagram shop, so square crops work best.",
    attachments: [
      { id: "a4", name: "brand-logo.png", kind: "image" },
      { id: "a5", name: "product-list.pdf", kind: "pdf" },
    ],
    person: {
      id: "u-hassan",
      name: "Hassan Bello",
      departmentLevel: "Business Admin • 300L",
      whatsapp: "+2348035550163",
    },
    reviewed: false,
  },
  {
    id: "cw-4",
    status: "rejected",
    serviceTitle: "Instagram content calendar",
    price: 10000,
    requestedAt: "2026-10-02T08:45:00",
    neededBy: "2026-10-12T12:00:00",
    campusLocation: "Online",
    brief: "A one-month posting plan for my skincare page, with caption ideas.",
    attachments: [],
    person: { id: "u-bisi", name: "Bisi Ogundipe", departmentLevel: "Pharmacy • 200L" },
    reviewed: false,
  },
  {
    id: "cw-5",
    status: "completed",
    serviceTitle: "Portrait session on campus",
    price: 8000,
    requestedAt: "2026-09-28T13:20:00",
    neededBy: "2026-10-03T09:00:00",
    campusLocation: "Faculty of Law steps",
    brief: "Graduation-style portraits in my robe, 30 minutes, outdoors near the Faculty of Law.",
    attachments: [],
    person: {
      id: "u-femi",
      name: "Femi Alade",
      departmentLevel: "Law • 400L",
      whatsapp: "+2348035550121",
    },
    reviewed: false,
  },
];

let myHires: ServiceRequest[] = [
  {
    id: "mh-1",
    status: "completed",
    serviceTitle: "Calculus & physics tutoring",
    price: 3000,
    requestedAt: "2026-10-01T09:00:00",
    neededBy: "2026-10-06T17:00:00",
    campusLocation: "Science library, ground floor",
    brief: "Two sessions on integration and kinematics before my test.",
    attachments: [],
    person: {
      id: "u-amina",
      name: "Amina Yusuf",
      departmentLevel: "Physics • 400L",
      whatsapp: "+2348035550190",
    },
    reviewed: false,
  },
  {
    id: "mh-2",
    status: "accepted",
    serviceTitle: "Flyer & poster design",
    price: 5000,
    requestedAt: "2026-10-18T11:15:00",
    neededBy: "2026-10-24T12:00:00",
    campusLocation: "Online",
    brief: "A poster for our society's open mic night. Dark theme, yellow accents, event details attached.",
    attachments: [{ id: "a6", name: "event-details.pdf", kind: "pdf" }],
    person: {
      id: "u-david",
      name: "David Okafor",
      departmentLevel: "Computer Science • 300L",
      whatsapp: "+2348035550142",
    },
    reviewed: false,
  },
  {
    id: "mh-3",
    status: "pending",
    serviceTitle: "Knotless braids & styling",
    price: 12000,
    requestedAt: "2026-10-22T16:40:00",
    neededBy: "2026-10-30T10:00:00",
    campusLocation: "Hostel C, room 14",
    brief: "Medium-length knotless braids. I'll bring my own hair.",
    attachments: [],
    person: { id: "u-chioma", name: "Chioma Eze", departmentLevel: "Nursing • 300L" },
    reviewed: false,
  },
  {
    id: "mh-4",
    status: "completed",
    serviceTitle: "Short-form video editing",
    price: 8000,
    requestedAt: "2026-09-20T10:00:00",
    neededBy: "2026-09-26T18:00:00",
    campusLocation: "Online",
    brief: "Three 30-second reels cut from my society's rally footage.",
    attachments: [],
    person: {
      id: "u-emeka",
      name: "Emeka Nwosu",
      departmentLevel: "Mass Communication • 300L",
      whatsapp: "+2348035550108",
    },
    reviewed: true,
  },
];

const wait = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms));

function findIn(list: ServiceRequest[], id: string): ServiceRequest {
  const found = list.find((r) => r.id === id);
  if (!found) throw new Error("This request no longer exists.");
  return found;
}

function update(list: ServiceRequest[], updated: ServiceRequest): ServiceRequest[] {
  return list.map((r) => (r.id === updated.id ? updated : r));
}

export const activityService = {
  async list(): Promise<ActivityData> {
    await wait();
    return { clientWork: [...clientWork], myHires: [...myHires] };
  },

  async accept(id: string): Promise<ServiceRequest> {
    await wait();
    const request = findIn(clientWork, id);
    if (request.status !== "pending") throw new Error("Only pending requests can be accepted.");
    const updated: ServiceRequest = {
      ...request,
      status: "accepted",
      person: { ...request.person, whatsapp: WHATSAPP[request.person.id] ?? request.person.whatsapp },
    };
    clientWork = update(clientWork, updated);
    return updated;
  },

  async decline(id: string): Promise<ServiceRequest> {
    await wait();
    const request = findIn(clientWork, id);
    if (request.status !== "pending") throw new Error("Only pending requests can be declined.");
    const updated: ServiceRequest = { ...request, status: "rejected" };
    clientWork = update(clientWork, updated);
    return updated;
  },

  async complete(id: string): Promise<ServiceRequest> {
    await wait();
    const request = findIn(clientWork, id);
    if (request.status !== "accepted") throw new Error("Only accepted work can be marked as completed.");
    const updated: ServiceRequest = { ...request, status: "completed" };
    clientWork = update(clientWork, updated);
    return updated;
  },

  async submitReview(id: string, input: ReviewInput): Promise<ServiceRequest> {
    await wait();
    const request = findIn(myHires, id);
    if (request.status !== "completed") throw new Error("You can only review completed work.");
    if (request.reviewed) throw new Error("You have already reviewed this job.");
    if (input.rating < 1 || input.rating > 5) throw new Error("Choose a rating from 1 to 5 stars.");
    const updated: ServiceRequest = { ...request, reviewed: true };
    myHires = update(myHires, updated);
    return updated;
  },
};