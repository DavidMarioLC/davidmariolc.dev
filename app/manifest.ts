import type { MetadataRoute } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

/** `oklch(0.15 0 0)`, the page ground, as the hex the manifest spec expects. */
const BACKGROUND = "#0b0b0b";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  // A manifest is a single document for the whole origin, so it cannot vary by
  // locale the way a page does. It speaks the default language; `start_url`
  // stays unprefixed so the proxy still negotiates the visitor's own.
  const t = await getTranslations({
    locale: routing.defaultLocale,
    namespace: "meta",
  });

  return {
    background_color: BACKGROUND,
    description: t("homeDescription"),
    display: "standalone",
    icons: [
      { sizes: "192x192", src: "/icon-192.png", type: "image/png" },
      { sizes: "512x512", src: "/icon-512.png", type: "image/png" },
      // The 512 doubles as the maskable icon: Android crops it to the launcher
      // shape, and without this it gets a white plate behind it instead.
      {
        purpose: "maskable",
        sizes: "512x512",
        src: "/icon-512.png",
        type: "image/png",
      },
    ],
    name: t("homeTitle"),
    short_name: t("siteName"),
    start_url: "/",
    theme_color: BACKGROUND,
  };
}
