import type { Project } from "#site/content";
import {
  achievements,
  books,
  community,
  posts,
  profile,
  projects,
  series,
  setup,
} from "#site/content";

export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Drafts stay visible while writing and disappear from the built site, so a
 * listing, the sitemap and the feed can never disagree about what is published.
 */
const includeDrafts = process.env.NODE_ENV === "development";

interface Draftable {
  draft?: boolean;
}
interface Localized {
  locale: string;
}
interface Dated {
  date: string;
}
interface Slugged {
  slug: string;
}

function published<T extends Draftable & Localized>(
  entries: T[],
  locale: Locale
) {
  return entries.filter(
    (entry) => entry.locale === locale && (includeDrafts || !entry.draft)
  );
}

function byDateDesc<T extends Dated>(entries: T[]) {
  return [...entries].sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Intro runs get a stable id here: separator runs repeat verbatim inside a
 * paragraph, so their text is not an identity and the renderer needs one.
 */
export function getProfile(locale: Locale) {
  const entry = profile.find((item) => item.locale === locale);

  if (!entry) {
    return;
  }

  return {
    ...entry,
    intro: entry.intro.map((paragraph, paragraphIndex) => ({
      ...paragraph,
      runs: paragraph.runs.map((run, runIndex) => ({
        ...run,
        id: `${paragraphIndex}-${runIndex}`,
      })),
    })),
  };
}

export function getPosts(locale: Locale) {
  return byDateDesc(published(posts, locale));
}

export function getPost(locale: Locale, slug: string) {
  return getPosts(locale).find((post) => post.slug === slug);
}

export function getPostsByTag(locale: Locale, tag: string) {
  return getPosts(locale).filter((post) => post.tags.includes(tag));
}

/** Every tag that has at least one published post, for the tag routes. */
export function getTags(locale: Locale) {
  const tags = new Set(getPosts(locale).flatMap((post) => post.tags));

  return [...tags].sort((a, b) => a.localeCompare(b));
}

export function getProjects(locale: Locale) {
  return [...published(projects, locale)].sort(
    (a, b) => a.order - b.order || b.date.localeCompare(a.date)
  );
}

export function getProject(locale: Locale, slug: string) {
  return getProjects(locale).find((project) => project.slug === slug);
}

export type ProjectCategory = Project["category"];

export function getProjectsByCategory(locale: Locale, category: string) {
  return getProjects(locale).filter((project) => project.category === category);
}

/**
 * Every category that has at least one published project, for the category
 * routes and the index navigation. Sorted by slug so the order is the same in
 * both locales and stable between builds.
 */
export function getProjectCategories(locale: Locale) {
  const categories = new Set(
    getProjects(locale).map((project) => project.category)
  );

  return [...categories].sort((a, b) => a.localeCompare(b));
}

const FEATURED_PROJECT_LIMIT = 3;

/** Falls back to the most recent projects so the home never renders an empty grid. */
export function getFeaturedProjects(locale: Locale) {
  const all = getProjects(locale);
  const featured = all.filter((project) => project.featured);
  const selection = featured.length > 0 ? featured : byDateDesc(all);

  return selection.slice(0, FEATURED_PROJECT_LIMIT);
}

export function getAchievements(locale: Locale) {
  return [...published(achievements, locale)].sort((a, b) => b.year - a.year);
}

export function getCommunity(locale: Locale) {
  return byDateDesc(published(community, locale));
}

export const BOOK_STATUSES = ["reading", "read", "wishlist"] as const;
export type BookStatus = (typeof BOOK_STATUSES)[number];

export function getBooks(locale: Locale) {
  return published(books, locale);
}

/** Returns the three reading states in their fixed order, dropping empty ones. */
export function getBooksByStatus(locale: Locale) {
  const all = getBooks(locale);

  return BOOK_STATUSES.map((status) => ({
    books: all.filter((book) => book.status === status),
    status,
  })).filter((group) => group.books.length > 0);
}

export const SETUP_BLOCKS = ["hardware", "stack", "editor", "apps"] as const;
export type SetupBlockName = (typeof SETUP_BLOCKS)[number];

export function getSetupBlock(locale: Locale, block: SetupBlockName) {
  return setup
    .filter((entry) => entry.locale === locale && entry.block === block)
    .sort((a, b) => a.order - b.order);
}

/**
 * Prose is never served in a locale it was not written in. The caller decides
 * what to do about it - the language switcher falls back to the section index.
 */
export function hasTranslation(
  collection: "posts" | "projects",
  locale: Locale,
  slug: string
) {
  const entries: (Slugged & Localized & Draftable)[] =
    collection === "posts" ? posts : projects;

  return entries.some(
    (entry) =>
      entry.slug === slug &&
      entry.locale === locale &&
      (includeDrafts || !entry.draft)
  );
}

/** Every locale a piece is published in, for hreflang and the switcher. */
export function translatedLocales(
  collection: "posts" | "projects",
  slug: string
) {
  return LOCALES.filter((locale) => hasTranslation(collection, locale, slug));
}

export interface SeriesPart {
  isCurrent: boolean;
  /** Drafts stay in the list so readers can see what is still coming. */
  isDraft: boolean;
  order: number;
  slug: string;
  title: string;
}

export interface SeriesContext {
  current: number;
  description?: string;
  next?: SeriesPart;
  parts: SeriesPart[];
  previous?: SeriesPart;
  slug: string;
  title: string;
  total: number;
}

/**
 * Everything a post needs to place itself in its series, resolved from the
 * collections at build time. Each locale assembles its own series, so a part
 * translated in one language and not the other never leaks across.
 */
export function getSeriesContext(
  locale: Locale,
  post: { slug: string; series?: string; seriesOrder?: number }
): SeriesContext | undefined {
  if (!(post.series && post.seriesOrder)) {
    return;
  }

  const definition = series.find(
    (entry) => entry.locale === locale && entry.slug === post.series
  );

  if (!definition) {
    return;
  }

  const members = posts
    .filter(
      (entry) =>
        entry.locale === locale &&
        entry.series === post.series &&
        entry.seriesOrder !== undefined
    )
    .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));

  const parts: SeriesPart[] = members.map((entry) => ({
    isCurrent: entry.slug === post.slug,
    isDraft: entry.draft,
    order: entry.seriesOrder ?? 0,
    slug: entry.slug,
    title: entry.title,
  }));

  const currentIndex = parts.findIndex((part) => part.isCurrent);
  // Neighbours skip drafts: an unpublished part has no page to link to.
  const linkable = parts.filter((part) => part.isCurrent || !part.isDraft);
  const linkableIndex = linkable.findIndex((part) => part.isCurrent);

  return {
    current: currentIndex + 1,
    description: definition.description,
    next: linkable[linkableIndex + 1],
    parts,
    previous: linkable[linkableIndex - 1],
    slug: definition.slug,
    title: definition.title,
    total: parts.length,
  };
}
