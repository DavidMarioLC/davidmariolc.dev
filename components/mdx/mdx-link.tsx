import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { Children } from "react";
import { Link } from "@/i18n/routing";
import { LOCALES } from "@/lib/content";
import { env } from "@/lib/env";

type LinkKind = "external" | "internal" | "anchor" | "protocol";

const SITE_ORIGIN = new URL(env.siteUrl).origin;
const HTTP_URL = /^https?:\/\//;

/**
 * An absolute URL pointing at this site is internal, so a canonical link
 * written out in full does not get an external icon and a new tab.
 */
function resolveKind(href: string): LinkKind {
  if (href.startsWith("#")) {
    return "anchor";
  }

  if (href.startsWith("/")) {
    return "internal";
  }

  if (!HTTP_URL.test(href)) {
    // mailto:, tel:, and anything else the browser hands to another handler.
    return "protocol";
  }

  try {
    return new URL(href).origin === SITE_ORIGIN ? "internal" : "external";
  } catch {
    return "external";
  }
}

/**
 * Keeps the trailing icon glued to the last word. Left on its own it can wrap
 * to a line of its own, which reads as a stray arrow under the paragraph.
 */
function withTrailingIcon(children: ReactNode) {
  const icon = (
    <ArrowUpRight
      aria-hidden="true"
      className="ml-0.5 inline-block size-[0.9em] align-[-0.1em]"
    />
  );

  const nodes = Children.toArray(children);
  const last = nodes.at(-1);

  if (typeof last !== "string") {
    // Nothing splittable to glue the icon to; keeping them together is the
    // best available outcome.
    return (
      <>
        {children}
        <span className="whitespace-nowrap">{icon}</span>
      </>
    );
  }

  const head = nodes.slice(0, -1);
  const words = last.split(" ");
  const lastWord = words.pop() ?? "";
  const lead = words.length > 0 ? `${words.join(" ")} ` : "";

  return (
    <>
      {head}
      {lead}
      <span className="whitespace-nowrap">
        {lastWord}
        {icon}
      </span>
    </>
  );
}

/**
 * A canonical URL written out in full already carries its locale segment, and
 * the routing helper adds one of its own - without this the two stack up.
 */
function stripLocale(pathname: string) {
  for (const locale of LOCALES) {
    if (pathname === `/${locale}`) {
      return "/";
    }

    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1);
    }
  }

  return pathname;
}

/**
 * Every link in a content body goes through here, so the three cases are
 * decided once from the href instead of by whoever writes the markdown.
 */
export function MdxLink({
  href,
  children,
  ...props
}: {
  href?: string;
  children?: ReactNode;
} & Omit<React.ComponentPropsWithoutRef<"a">, "href">) {
  if (!href) {
    return <a {...props}>{children}</a>;
  }

  const kind = resolveKind(href);

  if (kind === "external") {
    return (
      <a href={href} rel="noopener noreferrer" target="_blank" {...props}>
        {withTrailingIcon(children)}
      </a>
    );
  }

  if (kind === "anchor" || kind === "protocol") {
    // Same-page anchors keep native behaviour; the smooth scroll is CSS, so it
    // still honours the reader's reduced-motion preference.
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  const pathname = href.startsWith("/") ? href : new URL(href).pathname;

  return (
    <Link href={stripLocale(pathname)} {...props}>
      {children}
    </Link>
  );
}
