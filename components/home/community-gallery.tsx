import type { CloudImageSource } from "@/components/site/cloud-image";
import { CloudImage } from "@/components/site/cloud-image";

export interface CommunityEntry {
  date: string;
  image: CloudImageSource;
  slug: string;
  title: string;
}

export function CommunityGallery({
  entries,
  formatDate,
}: {
  entries: CommunityEntry[];
  formatDate: (date: string) => string;
}) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {entries.map((entry, index) => (
        <li key={entry.slug}>
          <figure>
            <div className="relative overflow-hidden rounded-sm border border-border">
              <CloudImage
                className="aspect-square w-full"
                image={entry.image}
                sizes="(max-width: 640px) 50vw, 160px"
              />
              <span
                aria-hidden="true"
                className="absolute top-0 left-0 bg-background/90 px-1.5 py-0.5 font-mono text-xs"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <figcaption className="mt-2">
              <span className="block text-sm">{entry.title}</span>
              <span className="block text-muted-foreground text-xs">
                {formatDate(entry.date)}
              </span>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
