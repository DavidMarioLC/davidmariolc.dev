import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";
import { LOCALES } from "@/lib/content";

export const routing = defineRouting({
  defaultLocale: "en",
  // Every public URL carries its locale, so there is no unprefixed variant to
  // special-case in the switcher, in hreflang or in the sitemap.
  localePrefix: "always",
  locales: LOCALES,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
