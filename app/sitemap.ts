import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import {
  getPosts,
  getPostsByTag,
  getProjectCategories,
  getProjects,
  getProjectsByCategory,
  getTags,
  LOCALES,
  type Locale,
} from "@/lib/content";
import { absoluteUrl } from "@/lib/metadata";

/**
 * Every locale a path exists in, as the `alternates.languages` map, plus the
 * `x-default` a reader gets when none of them is their language: English when
 * the path exists in English, otherwise the one language it was published in -
 * never a URL that answers 404.
 */
function languagesFor(path: string, locales: readonly Locale[]) {
  const fallback = locales.includes(routing.defaultLocale)
    ? routing.defaultLocale
    : (locales[0] ?? routing.defaultLocale);

  return {
    ...Object.fromEntries(
      locales.map((locale) => [locale, absoluteUrl(locale, path)])
    ),
    "x-default": absoluteUrl(fallback, path),
  };
}

/** Newest ISO date among the entries, or nothing when the list is empty. */
function latest(entries: readonly { date: string }[]) {
  return entries.reduce<string | undefined>(
    (newest, item) => (newest && newest >= item.date ? newest : item.date),
    undefined
  );
}

/**
 * The listing pages date themselves from what they list, so publishing a post
 * marks `/posts` and the home as changed too. `/books` and `/setup` list
 * collections that carry no dates, so they stay undated rather than claim one.
 */
const INDEX_DATES: Record<string, (locale: Locale) => string | undefined> = {
  "": (locale) => latest([...getPosts(locale), ...getProjects(locale)]),
  "/posts": (locale) => latest(getPosts(locale)),
  "/projects": (locale) => latest(getProjects(locale)),
};

function staticPages(): MetadataRoute.Sitemap {
  const paths = ["", "/projects", "/posts", "/books", "/setup"];

  return paths.flatMap((path) =>
    LOCALES.map((locale) => ({
      alternates: { languages: languagesFor(path, LOCALES) },
      lastModified: INDEX_DATES[path]?.(locale),
      url: absoluteUrl(locale, path),
    }))
  );
}

function prosePages(
  collection: "posts" | "projects",
  read: (locale: Locale) => readonly { date: string; slug: string }[]
): MetadataRoute.Sitemap {
  return LOCALES.flatMap((locale) =>
    read(locale).map((item) => {
      const path = `/${collection}/${item.slug}`;

      return {
        alternates: {
          languages: languagesFor(
            path,
            LOCALES.filter((other) =>
              read(other).some((candidate) => candidate.slug === item.slug)
            )
          ),
        },
        lastModified: item.date,
        url: absoluteUrl(locale, path),
      };
    })
  );
}

/**
 * Categories are a shared enum of slugs, so the same slug in both locales is
 * provably the same category and the two URLs are translations of each other.
 */
function categoryPages(): MetadataRoute.Sitemap {
  return LOCALES.flatMap((locale) =>
    getProjectCategories(locale).map((category) => {
      const path = `/projects/categories/${category}`;

      return {
        alternates: {
          languages: languagesFor(
            path,
            LOCALES.filter((other) =>
              getProjectCategories(other).includes(category)
            )
          ),
        },
        lastModified: latest(getProjectsByCategory(locale, category)),
        url: absoluteUrl(locale, path),
      };
    })
  );
}

/**
 * Tags are free text written per locale, so `architecture` and `arquitectura`
 * are one subject with nothing in the content connecting them. Only a tag that
 * exists verbatim in another locale is a translation we can prove; the rest
 * advertise a single language rather than a guessed pairing.
 */
function tagPages(): MetadataRoute.Sitemap {
  return LOCALES.flatMap((locale) =>
    getTags(locale).map((tag) => {
      const path = `/posts/tags/${tag}`;

      return {
        alternates: {
          languages: languagesFor(
            path,
            LOCALES.filter((other) => getTags(other).includes(tag))
          ),
        },
        lastModified: latest(getPostsByTag(locale, tag)),
        url: absoluteUrl(locale, path),
      };
    })
  );
}

/**
 * Built from the same collections the pages read, so a draft is absent here for
 * the same reason it has no page: `getPosts` never returns it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticPages(),
    ...prosePages("posts", getPosts),
    ...prosePages("projects", getProjects),
    ...categoryPages(),
    ...tagPages(),
  ];
}
