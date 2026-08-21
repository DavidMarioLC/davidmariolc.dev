import { Mail } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/site/brand-logo";
import { getProfile, isLocale } from "@/lib/content";

interface FooterLink {
  externalLabel?: string;
  /** Takes the place of the brand mark for entries with no logo in the registry. */
  icon?: ReactNode;
  logo?: string;
  name: string;
  url?: string;
}

function FooterColumn({
  heading,
  links,
}: {
  heading: string;
  links: FooterLink[];
}) {
  return (
    <div>
      <h2 className="font-mono text-sm">{heading}</h2>
      <ul className="mt-4 space-y-3 text-muted-foreground text-sm">
        {links.map((link) => {
          const mark = link.icon ?? (
            <BrandLogo className="h-4 w-auto shrink-0" mono name={link.logo} />
          );
          // A `mailto:` hands off to the mail client, so it neither opens a tab
          // nor needs the "opens in a new tab" hint.
          const opensTab = link.url?.startsWith("http");

          return (
            <li key={link.url ?? link.name}>
              {link.url ? (
                <a
                  aria-label={opensTab ? link.externalLabel : undefined}
                  className="inline-flex items-center gap-2 rounded-sm transition-colors hover:text-foreground"
                  href={link.url}
                  rel={opensTab ? "noopener noreferrer" : undefined}
                  target={opensTab ? "_blank" : undefined}
                >
                  {mark}
                  <span>{link.name}</span>
                </a>
              ) : (
                <span className="inline-flex items-center gap-2">
                  {mark}
                  <span>{link.name}</span>
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export async function SiteFooter() {
  const locale = await getLocale();
  const t = await getTranslations("footer");
  const profile = isLocale(locale) ? getProfile(locale) : undefined;

  if (!profile) {
    return null;
  }

  const withLabels = (links: FooterLink[]) =>
    links.map((link) => ({
      ...link,
      externalLabel: link.url
        ? t("externalLink", { name: link.name })
        : undefined,
    }));

  return (
    <footer className="border-border border-t">
      <div className="mx-auto grid w-full max-w-content grid-cols-2 gap-8 px-6 py-12 sm:grid-cols-3">
        <FooterColumn
          heading={t("social")}
          links={withLabels(profile.social)}
        />
        <FooterColumn
          heading={t("community")}
          links={withLabels(profile.community)}
        />
        <FooterColumn
          heading={t("contact")}
          links={[
            {
              icon: <Mail aria-hidden="true" className="size-4 shrink-0" />,
              name: profile.email,
              url: `mailto:${profile.email}`,
            },
          ]}
        />
      </div>
    </footer>
  );
}
