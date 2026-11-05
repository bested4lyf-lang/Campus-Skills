import {
  Camera,
  Code,
  GraduationCap,
  Megaphone,
  Monitor,
  Palette,
  Scissors,
  Shirt,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const MAX_SKILLS = 5;

export const SERVICE_CATEGORIES = [
  "Design & Creative",
  "Media",
  "Tech",
  "Academic",
  "Beauty & Fashion",
  "Marketing",
];

export const SUGGESTED_SKILLS = ["Photography", "Graphic Design", "Tutoring", "Programming", "Video Editing"];

interface Tone {
  bg: string; 
  Icon: LucideIcon;
}

const design: Tone = { bg: "bg-cat-design", Icon: Palette };
const media: Tone = { bg: "bg-cat-media", Icon: Camera };
const video: Tone = { bg: "bg-cat-video", Icon: Video };
const tech: Tone = { bg: "bg-cat-tech", Icon: Monitor };
const academic: Tone = { bg: "bg-cat-academic", Icon: GraduationCap };
const beauty: Tone = { bg: "bg-cat-beauty", Icon: Scissors };
const tailoring: Tone = { bg: "bg-cat-tailoring", Icon: Shirt };
const code: Tone = { bg: "bg-cat-code", Icon: Code };
const marketing: Tone = { bg: "bg-cat-marketing", Icon: Megaphone };

const BY_SKILL: Record<string, Tone> = {
  "graphic design": design,
  photography: media,
  "video editing": video,
  "web development": tech,
  tutoring: academic,
  hairdressing: beauty,
  "fashion design": tailoring,
  programming: code,
  "social media management": marketing,
};

const BY_CATEGORY: Record<string, Tone> = {
  "Design & Creative": design,
  Media: media,
  Tech: tech,
  Academic: academic,
  "Beauty & Fashion": beauty,
  Marketing: marketing,
};

export function getServiceTone(service: { skills: string[]; category: string }): Tone {
  const bySkill = service.skills.map((s) => BY_SKILL[s.toLowerCase()]).find(Boolean);
  return bySkill ?? BY_CATEGORY[service.category] ?? marketing;
}

const naira = new Intl.NumberFormat("en-NG");
export const formatNaira = (amount: number) => `₦${naira.format(amount)}`;