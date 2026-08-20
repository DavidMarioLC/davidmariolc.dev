"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import type { Locale } from "@/lib/content";
import { LOCALES } from "@/lib/content";

interface Props {
  /**
   * Locales this exact page exists in. Omit on pages that exist in every
   * locale; pass it on content detail pages so a missing translation lands on
   * the section index instead of a dead link.
   */
  availableLocales?: readonly Locale[];
  /** Where to send the visitor when the target locale has no translation. */
  fallbackHref?: string;
}

export function LocaleSwitcher({ availableLocales, fallbackHref }: Props) {
  const active = useLocale();
  const pathname = usePathname();
  const t = useTranslations("language");

  function hrefFor(locale: Locale) {
    if (!availableLocales || availableLocales.includes(locale)) {
      return pathname;
    }

    // The destination shows the "not translated" notice.
    return `${fallbackHref ?? "/"}?untranslated=1`;
  }

  return (
    <nav aria-label={t("label")}>
      <ul className="flex items-center gap-3 font-mono text-sm">
        {LOCALES.map((locale, index) => (
          <li className="flex items-center gap-3" key={locale}>
            {index > 0 && (
              <span aria-hidden="true" className="text-muted-foreground">
                |
              </span>
            )}
            {locale === active ? (
              <span aria-current="true" className="text-foreground uppercase">
                <span className="sr-only">
                  {t("current", { language: t(locale) })}
                </span>
                <span aria-hidden="true">{locale}</span>
              </span>
            ) : (
              <Link
                className="rounded-sm text-muted-foreground uppercase transition-colors hover:text-foreground"
                href={hrefFor(locale)}
                locale={locale}
              >
                <span className="sr-only">
                  {t("switchTo", { language: t(locale) })}
                </span>
                <span aria-hidden="true">{locale}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
