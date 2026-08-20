import { getLocale, getTranslations } from "next-intl/server";
import { BrandLogo } from "@/components/site/brand-logo";
import { getProfile, isLocale } from "@/lib/content";

interface FooterLink {
  externalLabel?: string;
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
        {links.map((link) => (
          <li key={link.url ?? link.name}>
            {link.url ? (
              <a
                aria-label={link.externalLabel}
                className="inline-flex items-center gap-2 rounded-sm transition-colors hover:text-foreground"
                href={link.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                <BrandLogo className="size-4 shrink-0" name={link.logo} />
                <span>{link.name}</span>
              </a>
            ) : (
              <span className="inline-flex items-center gap-2">
                <BrandLogo className="size-4 shrink-0" name={link.logo} />
                <span>{link.name}</span>
              </span>
            )}
          </li>
        ))}
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
      <div className="mx-auto grid w-full max-w-2xl grid-cols-2 gap-8 px-6 py-12">
        <FooterColumn
          heading={t("social")}
          links={withLabels(profile.social)}
        />
        <FooterColumn
          heading={t("community")}
          links={withLabels(profile.community)}
        />
      </div>
    </footer>
  );
}
