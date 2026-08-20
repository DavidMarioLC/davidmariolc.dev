import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { OG_CONTENT_TYPE, OG_SIZE, OgFrame } from "@/components/og/og-frame";
import { routing } from "@/i18n/routing";
import { getPost, getPosts, isLocale } from "@/lib/content";

export const alt = "davidmariolc.dev";
export const contentType = OG_CONTENT_TYPE;
export const size = OG_SIZE;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getPosts(locale).map((post) => ({ locale, slug: post.slug }))
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const resolved = isLocale(locale) ? locale : routing.defaultLocale;
  const post = getPost(resolved, slug);
  const t = await getTranslations({ locale: resolved, namespace: "posts" });

  return new ImageResponse(
    <OgFrame
      description={post?.description}
      eyebrow={t("title")}
      title={post?.title ?? t("title")}
    />,
    size
  );
}
