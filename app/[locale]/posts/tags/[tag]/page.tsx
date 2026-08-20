import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PostList } from "@/components/blog/post-list";
import { Link, routing } from "@/i18n/routing";
import { getPostsByTag, getTags, isLocale } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getTags(locale).map((tag) => ({ locale, tag }))
  );
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}) {
  const { locale, tag } = await params;
  setRequestLocale(locale);

  if (!isLocale(locale)) {
    notFound();
  }

  const posts = getPostsByTag(locale, tag);

  if (posts.length === 0) {
    notFound();
  }

  const t = await getTranslations("posts");

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="font-mono text-2xl">{t("taggedWith", { tag })}</h1>
        <Link
          className="inline-block font-mono text-muted-foreground text-sm underline underline-offset-4"
          href="/posts"
        >
          {t("backToPosts")}
        </Link>
      </header>

      <PostList posts={posts} />
    </div>
  );
}
