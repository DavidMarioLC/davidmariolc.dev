import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { OG_CONTENT_TYPE, OG_SIZE, OgFrame } from "@/components/og/og-frame";
import { routing } from "@/i18n/routing";
import { getProject, getProjects, isLocale } from "@/lib/content";

export const alt = "davidmariolc.dev";
export const contentType = OG_CONTENT_TYPE;
export const size = OG_SIZE;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getProjects(locale).map((project) => ({ locale, slug: project.slug }))
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const resolved = isLocale(locale) ? locale : routing.defaultLocale;
  const project = getProject(resolved, slug);
  const t = await getTranslations({ locale: resolved, namespace: "projects" });

  return new ImageResponse(
    <OgFrame
      description={project?.description}
      eyebrow={t("title")}
      title={project?.title ?? t("title")}
    />,
    size
  );
}
