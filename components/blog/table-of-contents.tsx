"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export interface TocEntry {
  items?: TocEntry[];
  title: string;
  url: string;
}

interface FlatEntry {
  depth: number;
  id: string;
  title: string;
}

const MIN_HEADINGS = 3;
const LEADING_HASH = /^#/;

/** Velite emits a tree; the list and the observer both want it flat. */
function flatten(entries: TocEntry[], depth = 0): FlatEntry[] {
  return entries.flatMap((entry) => [
    { depth, id: entry.url.replace(LEADING_HASH, ""), title: entry.title },
    ...flatten(entry.items ?? [], depth + 1),
  ]);
}

function useActiveHeading(ids: string[]) {
  const [active, setActive] = useState<string | undefined>(ids[0]);

  useEffect(() => {
    const seen = new Map<string, boolean>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          seen.set(entry.target.id, entry.isIntersecting);
        }

        // Document order decides, so scrolling up highlights the heading the
        // reader has arrived at rather than the last one to intersect.
        const current = ids.find((id) => seen.get(id));

        if (current) {
          setActive(current);
        }
      },
      // The band starts just above where `scroll-margin-top` parks a heading, so
      // a heading jumped to from the toc lands inside it. Start it lower and
      // navigating up leaves nothing intersecting and the highlight stuck.
      { rootMargin: "-32px 0px -70% 0px", threshold: 0 }
    );

    for (const id of ids) {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    }

    return () => observer.disconnect();
  }, [ids]);

  return active;
}

function TocList({
  entries,
  active,
  onNavigate,
}: {
  entries: FlatEntry[];
  active?: string;
  onNavigate?: () => void;
}) {
  return (
    <ul className="space-y-2 text-sm">
      {entries.map((entry) => (
        <li key={entry.id} style={{ paddingInlineStart: `${entry.depth}rem` }}>
          <a
            aria-current={entry.id === active ? "location" : undefined}
            className={cn(
              "block rounded-sm no-underline transition-colors",
              entry.id === active
                ? "text-brand"
                : "text-muted-foreground hover:text-foreground"
            )}
            href={`#${entry.id}`}
            onClick={onNavigate}
          >
            {entry.title}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function TableOfContents({ toc }: { toc: TocEntry[] }) {
  const entries = useMemo(() => flatten(toc), [toc]);
  const ids = useMemo(() => entries.map((entry) => entry.id), [entries]);
  const active = useActiveHeading(ids);
  const t = useTranslations("toc");

  // A two-heading article is easier to skim than a table of contents for it.
  if (entries.length < MIN_HEADINGS) {
    return null;
  }

  return (
    <>
      <details className="toc-mobile">
        <summary className="font-mono text-sm">{t("summary")}</summary>
        <nav aria-label={t("label")} className="mt-3">
          <TocList active={active} entries={entries} />
        </nav>
      </details>

      <aside className="toc-rail">
        <nav aria-label={t("label")}>
          <p className="mb-3 font-mono text-muted-foreground text-xs uppercase tracking-wide">
            {t("label")}
          </p>
          <TocList active={active} entries={entries} />
        </nav>
      </aside>
    </>
  );
}
