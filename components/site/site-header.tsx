import { getTranslations } from "next-intl/server";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { MobileNav } from "@/components/site/mobile-nav";
import { NavLink } from "@/components/site/nav-link";

const SECTIONS = [
  { href: "/", key: "home" },
  { href: "/projects", key: "projects" },
  { href: "/books", key: "books" },
  { href: "/setup", key: "setup" },
  { href: "/posts", key: "posts" },
] as const;

export async function SiteHeader() {
  const t = await getTranslations("nav");

  return (
    <header className="sticky top-0 z-50 border-border border-b bg-background/70 backdrop-blur-md">
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:m-2 focus:rounded focus:bg-card focus:px-3 focus:py-2"
        href="#content"
      >
        {t("skipToContent")}
      </a>
      <div className="mx-auto flex w-full max-w-content flex-wrap items-center justify-between gap-x-4 gap-y-3 px-6 py-4">
        {/* Below `md` the same sections live inside the sheet instead. */}
        <nav aria-label={t("primary")} className="hidden md:block">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-sm">
            {SECTIONS.map((section) => (
              <li key={section.key}>
                <NavLink href={section.href}>{t(section.key)}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:hidden">
          <MobileNav
            closeLabel={t("closeMenu")}
            navLabel={t("primary")}
            openLabel={t("openMenu")}
            sections={SECTIONS.map((section) => ({
              href: section.href,
              label: t(section.key),
            }))}
            title={t("menu")}
          />
        </div>
        <LocaleSwitcher />
      </div>
    </header>
  );
}
