import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PostMeta } from "@/components/blog/post-meta";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { SeriesFooter, SeriesHeader } from "@/components/blog/series-nav";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { TagList } from "@/components/blog/tag-list";
import { Mdx } from "@/components/mdx/mdx-content";
import { CloudImage } from "@/components/site/cloud-image";
import { Link, routing } from "@/i18n/routing";
import { getPost, getPosts, getSeriesContext, isLocale } from "@/lib/content";

// A slug that was never generated is a 404, not a page rendered on demand.
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getPosts(locale).map((post) => ({ locale, slug: post.slug }))
  );
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

  return (
    // `relative` is what the toc rail positions against.
    <div className="relative">
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
