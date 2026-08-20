import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { OG_CONTENT_TYPE, OG_SIZE, OgFrame } from "@/components/og/og-frame";
import { routing } from "@/i18n/routing";
import { isLocale } from "@/lib/content";

export const alt = "davidmariolc.dev";
export const contentType = OG_CONTENT_TYPE;
export const size = OG_SIZE;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * The site-wide preview. Every page below inherits it unless it generates its
 * own, so a page without an image of its own is never shared without one.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({
    locale: isLocale(locale) ? locale : routing.defaultLocale,
    namespace: "meta",
  });

  return new ImageResponse(
    <OgFrame description={t("homeDescription")} title={t("homeTitle")} />,
    size
  );
}
