import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";

export function TagList({ tags, label }: { tags: string[]; label: string }) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <nav aria-label={label}>
      <ul className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li key={tag}>
            <Badge
              className="rounded-sm font-mono"
              render={<Link href={`/posts/tags/${tag}`}>{tag}</Link>}
              variant="outline"
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
