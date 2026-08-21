import { useFormatter } from "next-intl";
import { Link } from "@/i18n/routing";

interface Props {
  date: string;
  slug: string;
  title: string;
}

/**
 * The home listing is an index, not a preview: title and date only, so three
 * posts read as one scannable block instead of three stacked summaries. The
 * full descriptions live on `/posts`.
 */
export function PostRow({ date, slug, title }: Props) {
  const format = useFormatter();

  return (
    <Link
      className="flex items-baseline justify-between gap-4 py-2 transition-colors hover:text-brand"
      href={`/posts/${slug}`}
    >
      <span className="font-mono">{title}</span>
      <time
        className="shrink-0 font-mono text-muted-foreground text-xs"
        dateTime={date}
      >
        {format.dateTime(new Date(date), {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </time>
    </Link>
  );
}
