import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { LOCALES, type Locale } from "@/lib/content";
import { env } from "@/lib/env";

/** No trailing slash, so every join below produces one and only one. */
export const SITE_URL = env.siteUrl.replace(/\/+$/, "");
export const SITE_NAME = "davidmariolc.dev";

export function absoluteUrl(locale: Locale, path = "") {
  return `${SITE_URL}/${locale}${path}`;
}

interface PageMetadata {
  /** Present when the page is a post: it changes the OG type and adds its date. */
  article?: { publishedTime: string; tags?: string[] };
  description: string;
  /** Announces the language's feed. Only the blog pages have one to announce. */
  feed?: boolean;
  /**
   * Path of the generated preview image, defaulting to the site-wide one.
   * Declaring it beats inheriting it: a page that states its own `openGraph`
   * drops the image an ancestor segment would have contributed.
   */
  image?: string;
  locale: Locale;
  /** Locales this page actually exists in. Anything else would be a dead hreflang. */
  locales?: readonly Locale[];
  /** Path after the locale prefix, empty for the home page. */
  path?: string;
  title: string;
}

/**
 * The canonical URL and the language alternates for one page.
 *
 * `languages` is built from the locales a piece is really published in, never
 * from the list of locales the site supports: a post written only in Spanish
 * must not advertise an English URL that answers 404.
 */
export function pageMetadata({
  article,
  description,
  feed,
  image,
  locale,
  locales = LOCALES,
  path = "",
  title,
}: PageMetadata): Metadata {
  const canonical = absoluteUrl(locale, path);
  const images = [
    {
      alt: title,
      height: 630,
      url: image ?? `/${locale}/opengraph-image`,
      width: 1200,
    },
  ];
  const languages = Object.fromEntries(
    locales.map((entry) => [entry, absoluteUrl(entry, path)])
  );

  return {
    alternates: {
      canonical,
      languages: {
        ...languages,
        // Somewhere to send a reader whose language the site does not publish.
        // English when the page exists in English, otherwise the language it
        // was written in - never a URL that answers 404.
        "x-default": absoluteUrl(
          locales.includes(routing.defaultLocale)
            ? routing.defaultLocale
            : locale,
          path
        ),
      },
      types: feed
        ? {
            "application/rss+xml": [
              {
                title: `${title} feed`,
                url: absoluteUrl(locale, "/posts/feed.xml"),
              },
            ],
          }
        : undefined,
    },
    description,
    openGraph: article
      ? {
          description,
          images,
          locale,
          publishedTime: article.publishedTime,
          siteName: SITE_NAME,
          tags: article.tags,
          title,
          type: "article",
          url: canonical,
        }
      : {
          description,
          images,
          locale,
          siteName: SITE_NAME,
          title,
          type: "website",
          url: canonical,
        },
    title,
    twitter: {
      card: "summary_large_image",
      creator: "@davidmariolc",
      description,
      images,
      title,
    },
  };
}
