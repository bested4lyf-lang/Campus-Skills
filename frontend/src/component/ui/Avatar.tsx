const COLORS = [
  "#9A3412",
  "#4338CA",
  "#0E7490",
  "#15803D",
  "#6D28D9",
  "#BE123C",
  "#A16207",
  "#3F6212",
  "#334155",
];

function hash(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i++) {
    h = (h * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

interface AvatarProps {
  id: string;
  name: string;
  size?: number;
  className?: string;
}

export default function Avatar({
  id,
  name,
  size = 32,
  className = "",
}: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        backgroundColor: COLORS[hash(id) % COLORS.length],
      }}
    >
      {initials(name)}
    </span>
  );
}
