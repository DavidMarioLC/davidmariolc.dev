import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

const ABSOLUTE_URL = /^https?:\/\//;

/**
 * Every home section is a titled region with an optional link to its full
 * index, so the heading level and the "View all" affordance stay consistent.
 *
 * That index is not always a page of this site: community lives on the GDG Ica
 * site, so an absolute URL leaves for a new tab and says so with an icon,
 * rather than being prefixed with a locale it does not have.
 */
export function Section({
  title,
  viewAllHref,
  viewAllLabel,
  viewAllAriaLabel,
  children,
}: {
  title: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  viewAllAriaLabel?: string;
  children: ReactNode;
}) {
  const isExternal = viewAllHref ? ABSOLUTE_URL.test(viewAllHref) : false;

  return (
    <section aria-labelledby={`section-${title}`}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-mono text-xl" id={`section-${title}`}>
          {title}
        </h2>
        {viewAllHref && viewAllLabel ? (
          <Button
            className="shrink-0 rounded-md"
            nativeButton={false}
            render={
              isExternal ? (
                <a
                  aria-label={viewAllAriaLabel}
                  href={viewAllHref}
                  rel="noopener"
                  target="_blank"
                >
                  {viewAllLabel}
                  <ArrowUpRight aria-hidden="true" className="size-3.5" />
                </a>
              ) : (
                <Link aria-label={viewAllAriaLabel} href={viewAllHref}>
                  {viewAllLabel}
                </Link>
              )
            }
            variant="outline"
          />
        ) : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}
