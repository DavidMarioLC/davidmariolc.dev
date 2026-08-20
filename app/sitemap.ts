import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import {
  getPosts,
  getProjects,
  getTags,
  LOCALES,
  type Locale,
} from "@/lib/content";
import { absoluteUrl } from "@/lib/metadata";

/** Every locale a path exists in, as the `alternates.languages` map. */
function languagesFor(path: string, locales: readonly Locale[]) {
  return Object.fromEntries(
    locales.map((locale) => [locale, absoluteUrl(locale, path)])
  );
}

function entry(
  path: string,
  locales: readonly Locale[],
  lastModified?: string
): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    alternates: { languages: languagesFor(path, locales) },
    lastModified,
    url: absoluteUrl(locale, path),
  }));
}

/**
 * Built from the same collections the pages read, so a draft is absent here for
 * the same reason it has no page: `getPosts` never returns it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/projects", "/posts", "/books", "/setup"];
  const pages = staticPaths.flatMap((path) => entry(path, LOCALES));

  const posts = routing.locales.flatMap((locale) =>
    getPosts(locale).map((post) => ({
      alternates: {
        languages: languagesFor(
          `/posts/${post.slug}`,
          LOCALES.filter((entry_) =>
            getPosts(entry_).some((item) => item.slug === post.slug)
          )
        ),
      },
      lastModified: post.date,
      url: absoluteUrl(locale, `/posts/${post.slug}`),
    }))
  );

  const projects = routing.locales.flatMap((locale) =>
    getProjects(locale).map((project) => ({
      alternates: {
        languages: languagesFor(
          `/projects/${project.slug}`,
          LOCALES.filter((entry_) =>
            getProjects(entry_).some((item) => item.slug === project.slug)
          )
        ),
      },
      lastModified: project.date,
      url: absoluteUrl(locale, `/projects/${project.slug}`),
    }))
  );

  const tags = routing.locales.flatMap((locale) =>
    getTags(locale).map((tag) => ({
      url: absoluteUrl(locale, `/posts/tags/${tag}`),
    }))
  );

  return [...pages, ...posts, ...projects, ...tags];
}
