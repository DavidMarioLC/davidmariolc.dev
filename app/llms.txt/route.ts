import { getTranslations } from "next-intl/server";
import { getPosts, getProjects, LOCALES, type Locale } from "@/lib/content";
import { absoluteUrl, SITE_URL } from "@/lib/metadata";

export const dynamic = "force-static";

const WHITESPACE = /\s+/g;

/** Descriptions are authored as prose, so a stray newline must not break a row. */
function oneLine(value: string) {
  return value.replace(WHITESPACE, " ").trim();
}

interface Entry {
  description: string;
  title: string;
  url: string;
}

function section(heading: string, entries: Entry[]) {
  if (entries.length === 0) {
    return "";
  }

  const rows = entries
    .map(
      (entry) =>
        `- [${oneLine(entry.title)}](${entry.url}): ${oneLine(entry.description)}`
    )
    .join("\n");

  return `## ${heading}\n\n${rows}\n`;
}

/** Every listing this locale publishes, in the order the navigation shows them. */
async function pagesFor(locale: Locale): Promise<Entry[]> {
  const t = await getTranslations({ locale });
  const named = (
    path: string,
    namespace: "books" | "posts" | "projects" | "setup"
  ) => ({
    description: t(`${namespace}.subtitle`),
    title: t(`${namespace}.title`),
    url: absoluteUrl(locale, path),
  });

  return [
    {
      description: t("meta.homeDescription"),
      title: t("meta.homeTitle"),
      url: absoluteUrl(locale),
    },
    named("/projects", "projects"),
    named("/posts", "posts"),
    named("/books", "books"),
    named("/setup", "setup"),
  ];
}

async function blockFor(locale: Locale) {
  const t = await getTranslations({ locale });
  const label = locale === "es" ? "Español" : "English";

  return [
    section(`${label} — ${t("meta.siteName")}`, await pagesFor(locale)),
    section(
      `${label} — ${t("projects.title")}`,
      getProjects(locale).map((project) => ({
        description: project.description,
        title: project.title,
        url: absoluteUrl(locale, `/projects/${project.slug}`),
      }))
    ),
    section(
      `${label} — ${t("posts.title")}`,
      getPosts(locale).map((post) => ({
        description: post.description,
        title: post.title,
        url: absoluteUrl(locale, `/posts/${post.slug}`),
      }))
    ),
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * A curated index of the site in Markdown, for tools that read
 * https://llmstxt.org/ before crawling the HTML.
 *
 * Built from the same collections the pages and the sitemap read, so a draft is
 * absent here for the same reason it has no page, and a new post appears without
 * anyone remembering to edit a list.
 */
export async function GET() {
  const t = await getTranslations({ locale: "en", namespace: "meta" });

  const blocks = await Promise.all(LOCALES.map((locale) => blockFor(locale)));

  const body = `# ${t("siteName")}

> ${oneLine(t("homeDescription"))}

Every page exists in English under \`/en/\` and in Spanish under \`/es/\`. Posts and
projects are translated one by one, so a piece listed under only one language was
only written in that language — there is no machine translation of the other.

${blocks.join("\n")}
## Optional

- [Posts feed (English)](${absoluteUrl("en", "/posts")}/feed.xml): RSS for the English posts.
- [Posts feed (Español)](${absoluteUrl("es", "/posts")}/feed.xml): RSS for the Spanish posts.
- [Sitemap](${SITE_URL}/sitemap.xml): every URL, including tag and category listings.
`;

  return new Response(body, {
    headers: {
      "cache-control": "public, max-age=3600",
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
