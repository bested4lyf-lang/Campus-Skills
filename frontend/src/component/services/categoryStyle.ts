import {
  Camera,
  Code,
  GraduationCap,
  Megaphone,
  Palette,
  Scissors,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface CategoryStyle {
  /** Cover background (tints come from theme.css) */
  cover: string;
  icon: LucideIcon;
  iconColor: string;
}

const STYLES: Record<string, CategoryStyle> = {
  "Design & Creative": { cover: "bg-cat-design", icon: Palette, iconColor: "text-brand-600" },
  Media: { cover: "bg-cat-media", icon: Camera, iconColor: "text-orange-600" },
  Tech: { cover: "bg-cat-tech", icon: Code, iconColor: "text-sky-600" },
  Academic: { cover: "bg-cat-academic", icon: GraduationCap, iconColor: "text-green-700" },
  "Beauty & Fashion": { cover: "bg-cat-beauty", icon: Scissors, iconColor: "text-rose-600" },
  Marketing: { cover: "bg-cat-marketing", icon: Megaphone, iconColor: "text-ink-700" },
};

const FALLBACK: CategoryStyle = {
  cover: "bg-surface-subtle",
  icon: Sparkles,
  iconColor: "text-ink-500",
};

export function getCategoryStyle(category: string): CategoryStyle {
  return STYLES[category] ?? FALLBACK;
}
