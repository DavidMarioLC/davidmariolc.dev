import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getPosts, isLocale } from "@/lib/content";
import { absoluteUrl } from "@/lib/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const ESCAPES: Record<string, string> = {
  "'": "&apos;",
  '"': "&quot;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
};
const NEEDS_ESCAPE = /["&'<>]/g;

/** A title with an ampersand in it must not be able to break the document. */
function escapeXml(value: string) {
  return value.replace(NEEDS_ESCAPE, (char) => ESCAPES[char]);
}

/**
 * One feed per language, holding only the posts written in that language.
 * A single mixed feed would deliver every post twice to every subscriber.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return new Response("Not found", { status: 404 });
  }

  const t = await getTranslations({ locale, namespace: "posts" });
  const meta = await getTranslations({ locale, namespace: "meta" });
  const posts = getPosts(locale);
  const self = `${absoluteUrl(locale, "/posts")}/feed.xml`;

  const items = posts
    .map((post) => {
      const url = absoluteUrl(locale, `/posts/${post.slug}`);

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.description)}</description>
    </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${t("title")} · ${meta("siteName")}`)}</title>
    <link>${absoluteUrl(locale, "/posts")}</link>
    <description>${escapeXml(t("subtitle"))}</description>
    <language>${locale}</language>
    <atom:link href="${self}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      "cache-control": "public, max-age=3600",
      "content-type": "application/rss+xml; charset=utf-8",
    },
  });
}
