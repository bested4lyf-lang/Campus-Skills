import { SEED_PROFILES } from "./profileData";
import type { ProfileFormValues, StudentProfile } from "../types/profile";
import type { User } from "../types/user";

const STORAGE_PREFIX = "campusskill:profile:";

export class ProfileNotFoundError extends Error {
  constructor() {
    super("This student could not be found.");
    this.name = "ProfileNotFoundError";
  }
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Edits are saved in the browser so they survive a refresh until the profile API exists
function readEdits(id: string): ProfileFormValues | null {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + id);
    return raw ? (JSON.parse(raw) as ProfileFormValues) : null;
  } catch {
    return null;
  }
}

function writeEdits(id: string, values: ProfileFormValues): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + id, JSON.stringify(values));
  } catch {
    // Storage can be full or blocked, in which case the edit only lasts for this visit
  }
}

/** A signed-in student with no stored profile starts from what the login gave us */
function blankProfile(user: User): StudentProfile {
  return {
    id: user.id,
    fullName: user.fullName,
    department: user.department ?? "",
    level: user.level ?? "",
    bio: "",
    skills: [],
    whatsapp: "",
    jobsDone: 0,
    rating: null,
    reviewCount: 0,
    listings: [],
    reviews: [],
  };
}

function build(id: string, viewer: User | null): StudentProfile {
  const isOwn = viewer?.id === id;
  const base = SEED_PROFILES[id] ?? (isOwn && viewer ? blankProfile(viewer) : null);
  if (!base) throw new ProfileNotFoundError();

  const merged = isOwn ? { ...base, ...readEdits(id) } : base;
  // A WhatsApp number is only ever returned to the student it belongs to
  return isOwn ? merged : { ...merged, whatsapp: "" };
}

export const profileService = {
  async get(id: string, viewer: User | null): Promise<StudentProfile> {
    await wait(350);
    return build(id, viewer);
  },

  async updateOwn(viewer: User, values: ProfileFormValues): Promise<StudentProfile> {
    await wait(500);
    if (values.skills.length === 0) throw new Error("Add at least one skill.");
    writeEdits(viewer.id, values);
    return build(viewer.id, viewer);
  },
};