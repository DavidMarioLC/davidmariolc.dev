import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PostList } from "@/components/blog/post-list";
import { routing } from "@/i18n/routing";
import { getPosts, isLocale } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "posts" });

  return pageMetadata({
    description: t("subtitle"),
    feed: true,
    locale,
    path: "/posts",
    title: t("title"),
  });
}

export default async function PostsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  if (!isLocale(locale)) {
    notFound();
  }

  const t = await getTranslations("posts");
  const posts = getPosts(locale);

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="font-mono text-2xl">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </header>

      {posts.length === 0 ? (
        <p className="text-muted-foreground text-sm">{t("empty")}</p>
      ) : (
        <PostList posts={posts} />
      )}
    </div>
  );
}
