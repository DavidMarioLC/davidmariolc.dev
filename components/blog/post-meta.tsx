import { useFormatter, useTranslations } from "next-intl";

/** Date and reading time, rendered identically in the index and the detail. */
export function PostMeta({
  date,
  readingTime,
}: {
  date: string;
  readingTime: number;
}) {
  const format = useFormatter();
  const t = useTranslations("posts");

  return (
    <p className="flex items-center gap-2 font-mono text-muted-foreground text-xs">
      <time dateTime={date}>
        {format.dateTime(new Date(date), {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </time>
      <span aria-hidden="true">·</span>
      <span>{t("readingTime", { minutes: readingTime })}</span>
    </p>
  );
}
