import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import type { SeriesContext } from "@/lib/content";
import { cn } from "@/lib/utils";

/** The box at the top of the post: where you are, and what the whole series is. */
export async function SeriesHeader({ series }: { series: SeriesContext }) {
  const t = await getTranslations("series");

  return (
    <nav
      aria-label={`${t("label")}: ${series.title}`}
      className="series-box"
      data-slot="series-header"
    >
      <p className="font-mono text-brand text-xs uppercase tracking-wide">
        {t("partOf", { current: series.current, total: series.total })}
      </p>
      <p className="mt-1 font-mono text-base">{series.title}</p>
      {series.description ? (
        <p className="mt-1 text-muted-foreground text-sm">
          {series.description}
        </p>
      ) : null}

      <ol className="mt-4 space-y-2 text-sm">
        {series.parts.map((part) => (
          <li className="flex items-start gap-2" key={part.slug}>
            <span
              aria-hidden="true"
              className="w-5 shrink-0 font-mono text-muted-foreground text-xs leading-6"
            >
              {String(part.order).padStart(2, "0")}
            </span>

            {(() => {
              if (part.isCurrent) {
                return (
                  <span className="flex items-center gap-2 font-medium text-foreground">
                    {part.title}
                    <Check aria-hidden="true" className="size-3.5 text-brand" />
                    <span className="sr-only">{t("currentPart")}</span>
                  </span>
                );
              }

              if (part.isDraft) {
                return (
                  <span className="text-muted-foreground">
                    {part.title}
                    <span className="ml-2 rounded-sm border border-border px-1.5 py-0.5 font-mono text-[0.7rem]">
                      {t("comingSoon")}
                    </span>
                  </span>
                );
              }

              return (
                <Link
                  className="text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
                  href={`/posts/${part.slug}`}
                >
                  {part.title}
                </Link>
              );
            })()}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Previous / next at the end of the post. Drafts are skipped: nothing to link. */
export async function SeriesFooter({ series }: { series: SeriesContext }) {
  const t = await getTranslations("series");

  if (!(series.previous || series.next)) {
    return null;
  }

  return (
    <nav
      aria-label={`${t("label")}: ${series.title}`}
      className="grid gap-3 sm:grid-cols-2"
    >
      {series.previous ? (
        <Link
          className="group rounded-md border border-border bg-card p-4 no-underline transition-colors hover:bg-accent"
          href={`/posts/${series.previous.slug}`}
        >
          <span className="flex items-center gap-1.5 font-mono text-muted-foreground text-xs">
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            {t("previous")}
          </span>
          <span className="mt-1 block text-sm">{series.previous.title}</span>
        </Link>
      ) : (
        <span />
      )}

      {series.next ? (
        <Link
          className={cn(
            "group rounded-md border border-border bg-card p-4 no-underline transition-colors hover:bg-accent",
            "sm:text-right"
          )}
          href={`/posts/${series.next.slug}`}
        >
          <span className="flex items-center gap-1.5 font-mono text-muted-foreground text-xs sm:justify-end">
            {t("next")}
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </span>
          <span className="mt-1 block text-sm">{series.next.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
