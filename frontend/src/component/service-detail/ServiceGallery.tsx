import { useState } from "react";
import type { ServiceImage } from "../../types/serviceDetail";

interface ServiceGalleryProps {
  images: ServiceImage[];
}

export default function ServiceGallery({ images }: ServiceGalleryProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  if (images.length === 0) return null;
  const active = images.find((img) => img.id === activeId) ?? images[0];

  return (
    <div>
      <div className="aspect-video overflow-hidden rounded-xl bg-brand-100">
        <img src={active.src} alt={active.alt} className="size-full object-cover" />
      </div>

      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-3 gap-3">
          {images.map((img) => (
            <li key={img.id}>
              <button
                type="button"
                onClick={() => setActiveId(img.id)}
                aria-pressed={img.id === active.id}
                aria-label={`Show image: ${img.alt}`}
                className={`block aspect-video w-full overflow-hidden rounded-lg border-2 bg-surface transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${
                  img.id === active.id ? "border-brand-600" : "border-transparent hover:border-brand-200"
                }`}
              >
                <img src={img.src} alt="" className="size-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}