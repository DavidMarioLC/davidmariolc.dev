import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

/**
 * Every home section is a titled region with an optional link to its full
 * index, so the heading level and the "View all" affordance stay consistent.
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
              <Link aria-label={viewAllAriaLabel} href={viewAllHref}>
                {viewAllLabel}
              </Link>
            }
            variant="outline"
          />
        ) : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}
