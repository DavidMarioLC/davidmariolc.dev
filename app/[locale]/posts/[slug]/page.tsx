import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PostMeta } from "@/components/blog/post-meta";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { SeriesFooter, SeriesHeader } from "@/components/blog/series-nav";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { TagList } from "@/components/blog/tag-list";
import { Mdx } from "@/components/mdx/mdx-content";
import { CloudImage } from "@/components/site/cloud-image";
import { StructuredData } from "@/components/site/structured-data";
import { Link, routing } from "@/i18n/routing";
import {
  getPost,
  getPosts,
  getSeriesContext,
  isLocale,
  translatedLocales,
} from "@/lib/content";
import { absoluteUrl, pageMetadata, SITE_NAME } from "@/lib/metadata";

// A slug that was never generated is a 404, not a page rendered on demand.
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getPosts(locale).map((post) => ({ locale, slug: post.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const post = getPost(locale, slug);

  if (!post) {
    return {};
  }

  return pageMetadata({
    article: { publishedTime: post.date, tags: post.tags },
    description: post.description,
    feed: true,
    image: `/${locale}/posts/${slug}/opengraph-image`,
    locale,
    // Only the languages this post is actually published in.
    locales: translatedLocales("posts", slug),
    path: `/posts/${slug}`,
    title: post.title,
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!isLocale(locale)) {
    notFound();
  }

  const post = getPost(locale, slug);

  if (!post) {
    notFound();
  }

  const t = await getTranslations("posts");
  const series = getSeriesContext(locale, post);
  const url = absoluteUrl(locale, `/posts/${slug}`);

  const article = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    author: {
      "@type": "Person",
      name: "David Licla",
      url: absoluteUrl(locale),
    },
    datePublished: post.date,
    description: post.description,
    headline: post.title,
    image: `${url}/opengraph-image`,
    inLanguage: locale,
    keywords: post.tags,
    mainEntityOfPage: url,
    publisher: { "@type": "Person", name: SITE_NAME },
  };

  return (
    // `relative` is what the toc rail positions against.
    <div className="relative">
      <StructuredData data={article} />
      <ReadingProgress targetId="post-article" />
      <TableOfContents toc={post.toc} />
      <article className="reading-progress-target space-y-8" id="post-article">
        <header className="space-y-3">
          <h1 className="font-mono text-2xl leading-tight">{post.title}</h1>
          <PostMeta date={post.date} readingTime={post.metadata.readingTime} />
          <p className="text-muted-foreground leading-relaxed">
            {post.description}
          </p>
          <TagList label={t("tags")} tags={post.tags} />
        </header>

        {post.cover ? (
          <CloudImage
            className="aspect-video w-full rounded-md border border-border"
            image={post.cover}
            priority
            sizes="(max-width: 768px) 100vw, 640px"
          />
        ) : null}

        {series ? <SeriesHeader series={series} /> : null}

        <div className="prose">
          <Mdx code={post.content} />
        </div>

        {series ? <SeriesFooter series={series} /> : null}

        <footer className="border-border border-t pt-6">
          <Link
            className="font-mono text-sm underline underline-offset-4"
            href="/posts"
          >
            {t("backToPosts")}
          </Link>
        </footer>
      </article>
    </div>
  );
}
