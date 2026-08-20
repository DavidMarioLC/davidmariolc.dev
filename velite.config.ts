import { transformerNotationDiff } from "@shikijs/transformers";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { defineCollection, defineConfig, s, z } from "velite";

const LOCALES = ["en", "es"] as const;
const LEADING_SEGMENT = /^[^/]+\//;
const LOCALE_SEGMENT = /^(?<locale>[a-z]{2})\//;
const TRAILING_LOCALE_SEGMENT = /\/(?<locale>[a-z]{2})$/;

/**
 * Content locale is derived from the file path, never from a frontmatter field
 * that an author can forget or contradict. Prose lives at `<type>/<locale>/<slug>`,
 * curated lists live at `<type>/<locale>`.
 */
function localeFromPath(path: string) {
  const nested = LOCALE_SEGMENT.exec(path.replace(LEADING_SEGMENT, ""));
  if (nested?.groups) {
    return nested.groups.locale;
  }

  return TRAILING_LOCALE_SEGMENT.exec(path)?.groups?.locale;
}

function slugFromPath(path: string) {
  return path.split("/").pop() ?? path;
}

interface WithPath {
  path: string;
}

/** Fails the build with the offending file when the locale segment is missing. */
function resolveLocale(data: WithPath, ctx: z.RefinementCtx) {
  const resolved = localeFromPath(data.path);
  if (!resolved) {
    ctx.addIssue({
      code: "custom",
      message: `Cannot derive a locale from "${data.path}". Expected one of ${LOCALES.join(", ")} as a path segment.`,
    });
    return LOCALES[0];
  }
  return resolved as (typeof LOCALES)[number];
}

function withLocale<T extends WithPath>(data: T, ctx: z.RefinementCtx) {
  return { ...data, locale: resolveLocale(data, ctx) };
}

function withLocaleAndSlug<T extends WithPath>(data: T, ctx: z.RefinementCtx) {
  return {
    ...data,
    locale: resolveLocale(data, ctx),
    slug: slugFromPath(data.path),
  };
}

/** Shared shape for prose collections: one MDX file per piece and locale. */
const prose = {
  content: s.mdx(),
  description: s.string().max(320),
  draft: s.boolean().default(false),
  path: s.path(),
  title: s.string().max(120),
};

const isoDate = s.string().transform((value, ctx) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    ctx.addIssue({
      code: "custom",
      message: "Expected an ISO date, for example 2025-06-01",
    });
    return z.NEVER;
  }
  return parsed.toISOString();
});

const brandRef = s.object({
  /** Key into the logo registry. Optional: entries without a brand render as text. */
  logo: s.string().optional(),
  name: s.string(),
  url: s.string().url().optional(),
});

const cloudinaryImage = s.object({
  alt: s.string(),
  height: s.number().int().positive(),
  publicId: s.string(),
  width: s.number().int().positive(),
});

const posts = defineCollection({
  name: "Post",
  pattern: "posts/*/*.mdx",
  schema: s
    .object({
      ...prose,
      cover: cloudinaryImage.optional(),
      date: isoDate,
      excerpt: s.excerpt(),
      metadata: s.metadata(),
      /** Slug of a series in the `series` collection, plus this post's place in it. */
      series: s.string().optional(),
      seriesOrder: s.number().int().positive().optional(),
      tags: s.array(s.string()).default([]),
      toc: s.toc(),
    })
    .transform(withLocaleAndSlug),
});

const projects = defineCollection({
  name: "Project",
  pattern: "projects/*/*.mdx",
  schema: s
    .object({
      ...prose,
      date: isoDate,
      featured: s.boolean().default(false),
      links: s
        .object({
          live: s.string().url().optional(),
          repository: s.string().url().optional(),
        })
        .default({}),
      order: s.number().int().default(0),
      preview: cloudinaryImage,
      stack: s.array(brandRef).default([]),
    })
    .transform(withLocaleAndSlug),
});

const profile = defineCollection({
  name: "Profile",
  pattern: "profile/*.yml",
  schema: s
    .object({
      avatar: cloudinaryImage,
      community: s.array(brandRef).default([]),
      communityIntro: s.string(),
      /** Where "view all" goes for community: the GDG Ica site, not a page here. */
      communityUrl: s.string().url().optional(),
      country: s.string(),
      countryFlag: s.string(),
      /** Each paragraph is a list of runs so brand logos can sit inline in the text. */
      intro: s.array(
        s.object({
          runs: s.array(
            s.object({
              emphasis: s.boolean().default(false),
              logo: s.string().optional(),
              text: s.string(),
              url: s.string().url().optional(),
            })
          ),
        })
      ),
      name: s.string(),
      path: s.path(),
      social: s.array(brandRef).default([]),
    })
    .transform(withLocale),
});

const achievements = defineCollection({
  name: "Achievement",
  pattern: "achievements/*.yml",
  schema: s
    .object({
      draft: s.boolean().default(false),
      logo: cloudinaryImage,
      name: s.string(),
      participation: s.string(),
      path: s.path(),
      slug: s.string(),
      url: s.string().url().optional(),
      year: s.number().int(),
    })
    .transform(withLocale),
});

const community = defineCollection({
  name: "CommunityItem",
  pattern: "community/*.yml",
  schema: s
    .object({
      date: isoDate,
      draft: s.boolean().default(false),
      image: cloudinaryImage,
      path: s.path(),
      slug: s.string(),
      title: s.string(),
      url: s.string().url().optional(),
    })
    .transform(withLocale),
});

const series = defineCollection({
  name: "Series",
  pattern: "series/*.yml",
  schema: s
    .object({
      description: s.string().optional(),
      path: s.path(),
      slug: s.string(),
      title: s.string(),
    })
    .transform(withLocale),
});

const books = defineCollection({
  name: "Book",
  pattern: "books/*.yml",
  schema: s
    .object({
      author: s.string(),
      cover: cloudinaryImage,
      draft: s.boolean().default(false),
      path: s.path(),
      slug: s.string(),
      status: s.enum(["reading", "read", "wishlist"]),
      /** Title and author never render as visible text - they feed the cover's alt. */
      title: s.string(),
    })
    .transform(withLocale),
});

const setup = defineCollection({
  name: "SetupBlock",
  pattern: "setup/*.yml",
  schema: s
    .object({
      block: s.enum(["hardware", "stack", "editor", "apps"]),
      entries: s.array(brandRef).default([]),
      label: s.string(),
      order: s.number().int().default(0),
      path: s.path(),
      /** `hardware` blocks carry a plain value; every other block carries entries. */
      value: s.string().optional(),
    })
    .transform(withLocale),
});

export default defineConfig({
  collections: {
    achievements,
    books,
    community,
    posts,
    profile,
    projects,
    series,
    setup,
  },
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        { behavior: "wrap", properties: { className: ["heading-anchor"] } },
      ],
      [
        // Highlighting runs at build time; Shiki never reaches the client.
        rehypePrettyCode,
        {
          defaultLang: "text",
          keepBackground: false,
          // One theme emits real colours. The dual-theme mode emits custom
          // properties that need CSS to resolve, which this site no longer has.
          theme: "github-dark-dimmed",
          transformers: [
            // `// [!code ++]` and `// [!code --]` mark a line as added or
            // removed. The marker comment is stripped from the output, so the
            // line keeps the highlighting of its own language and the tint is
            // painted underneath it in CSS.
            transformerNotationDiff(),
          ],
        },
      ],
    ],
    remarkPlugins: [],
  },
  output: {
    assets: "public/static",
    base: "/static/",
    clean: true,
    data: ".velite",
    name: "[name]-[hash:6].[ext]",
  },
  prepare(data) {
    for (const [name, entries] of Object.entries(data)) {
      assertUniqueSlugs(name, entries);
    }

    assertSeriesIntegrity(data.posts, data.series);
  },
  root: "content",
});

interface Identifiable {
  locale: string;
  path: string;
  slug?: string;
}

/**
 * A slug is shared across locales on purpose, so uniqueness is scoped to
 * locale + slug. Reports both offending files so the fix is obvious.
 */
function assertUniqueSlugs(collection: string, entries: unknown) {
  if (!Array.isArray(entries)) {
    return;
  }

  const seen = new Map<string, string>();
  for (const [index, entry] of (entries as Identifiable[]).entries()) {
    if (!entry?.slug) {
      continue;
    }

    const key = `${entry.locale}/${entry.slug}`;
    const where = `${entry.path} (entry ${index + 1})`;
    const previous = seen.get(key);
    if (previous) {
      throw new Error(
        `Duplicate slug "${entry.slug}" for locale "${entry.locale}" in collection "${collection}": ${previous} and ${where}`
      );
    }
    seen.set(key, where);
  }
}

interface SeriesMember {
  locale: string;
  path: string;
  series?: string;
  seriesOrder?: number;
}

/**
 * A series is only coherent if every member points at a series that exists in
 * its own locale and claims a position no sibling already holds. Checking it
 * here means a broken series is a build error, not a page that renders
 * "Part 3 of 2".
 */
function assertSeriesIntegrity(allPosts: unknown, seriesList: unknown) {
  if (!(Array.isArray(allPosts) && Array.isArray(seriesList))) {
    return;
  }

  const known = new Set(
    (seriesList as { locale: string; slug: string }[]).map(
      (definition) => `${definition.locale}/${definition.slug}`
    )
  );
  const positions = new Map<string, string>();

  for (const post of allPosts as SeriesMember[]) {
    if (!post.series) {
      if (post.seriesOrder !== undefined) {
        throw new Error(
          `${post.path} sets seriesOrder without series. Both are needed, or neither.`
        );
      }
      continue;
    }

    if (post.seriesOrder === undefined) {
      throw new Error(
        `${post.path} belongs to series "${post.series}" but has no seriesOrder.`
      );
    }

    const key = `${post.locale}/${post.series}`;
    if (!known.has(key)) {
      throw new Error(
        `${post.path} references series "${post.series}", which has no entry in content/series/${post.locale}.yml`
      );
    }

    const slot = `${key}#${post.seriesOrder}`;
    const taken = positions.get(slot);
    if (taken) {
      throw new Error(
        `Series "${post.series}" (${post.locale}) has two posts at position ${post.seriesOrder}: ${taken} and ${post.path}`
      );
    }
    positions.set(slot, post.path);
  }
}
