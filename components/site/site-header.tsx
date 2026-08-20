import { getTranslations } from "next-intl/server";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
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
    <header className="border-border border-b">
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:m-2 focus:rounded focus:bg-card focus:px-3 focus:py-2"
        href="#content"
      >
        {t("skipToContent")}
      </a>
      <div className="mx-auto flex w-full max-w-content flex-wrap items-center justify-between gap-x-4 gap-y-3 px-6 py-4">
        <nav aria-label={t("primary")}>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-sm">
            {SECTIONS.map((section) => (
              <li key={section.key}>
                <NavLink href={section.href}>{t(section.key)}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <LocaleSwitcher />
      </div>
    </header>
  );
}
