"use client";

import type { ReactNode } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * `usePathname` from the routing helpers is already locale-stripped, so the
 * active check never has to know which locale it is running under.
 */
export function NavLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "whitespace-nowrap rounded-sm transition-colors hover:text-foreground",
        isActive ? "text-foreground" : "text-muted-foreground"
      )}
      href={href}
    >
      {children}
    </Link>
  );
}
