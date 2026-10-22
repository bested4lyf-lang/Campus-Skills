import type { OwnService, ProfileSummary, ServiceFormValues } from "../types/myServices";
import type { User } from "../types/user";

let nextId = 5;

let services: OwnService[] = [
  {
    id: "1",
    title: "Event photography, 2 hours",
    category: "Media",
    skills: ["Photography"],
    price: 15000,
    description: "Candid coverage of your campus event, edited and delivered within 3 days.",
    rating: 4.8,
    reviewCount: 17,
  },
  {
    id: "2",
    title: "Short-form video editing",
    category: "Media",
    skills: ["Video Editing"],
    price: 8000,
    description: "Reels and TikToks edited with captions, music and clean cuts.",
    rating: 4.8,
    reviewCount: 17,
  },
  {
    id: "3",
    title: "Portrait session on campus",
    category: "Media",
    skills: ["Photography"],
    price: 8000,
    description: "A 30-minute portrait shoot with 10 edited photos, perfect for LinkedIn.",
    rating: 4.8,
    reviewCount: 17,
  },
  {
    id: "4",
    title: "Instagram content calendar",
    category: "Marketing",
    skills: ["Social Media Management"],
    price: 10000,
    description: "A full month of post ideas, captions and hashtags for your page.",
    rating: 4.8,
    reviewCount: 17,
  },
];

const wait = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms));

function applyValues(base: OwnService, values: ServiceFormValues): OwnService {
  return {
    ...base,
    title: values.title,
    category: values.category,
    price: values.price,
    skills: values.skills,
    description: values.description,
    coverImageUrl: values.coverImage ? URL.createObjectURL(values.coverImage) : base.coverImageUrl,
  };
}

export const myServicesService = {
  async list(): Promise<OwnService[]> {
    await wait();
    return [...services];
  },

  async create(values: ServiceFormValues): Promise<OwnService> {
    await wait();
    const blank: OwnService = {
      id: String(nextId++),
      title: "",
      category: "",
      skills: [],
      price: 0,
      description: "",
      rating: null,
      reviewCount: 0,
    };
    const created = applyValues(blank, values);
    services = [created, ...services];
    return created;
  },

  async update(id: string, values: ServiceFormValues): Promise<OwnService> {
    await wait();
    const current = services.find((s) => s.id === id);
    if (!current) throw new Error("This service no longer exists.");
    const updated = applyValues(current, values);
    services = services.map((s) => (s.id === id ? updated : s));
    return updated;
  },

  async remove(id: string): Promise<void> {
    await wait();
    services = services.filter((s) => s.id !== id);
  },

  async getProfileSummary(_user: User): Promise<ProfileSummary> {
    await wait(300);
    return {
      bio: "Photographer and content creator. I shoot campus events, portraits and product photos, and I edit short videos on the side.",
      skills: ["Photography", "Video Editing", "Social Media Management", "Writing"],
      jobsDone: 17,
      rating: 4.8,
      pendingClientWork: 2,
      totalHires: 4,
    };
  },
};