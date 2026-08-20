import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProjectCard } from "@/components/home/project-card";
import { Link, routing } from "@/i18n/routing";
import {
  getProjectCategories,
  getProjectsByCategory,
  isLocale,
  LOCALES,
} from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

// A category nobody has published in was never generated, so it is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getProjectCategories(locale).map((category) => ({ category, locale }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; locale: string }>;
}): Promise<Metadata> {
  const { category, locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "projects" });
  const title = t("inCategory", { category: t(`category.${category}`) });

  return pageMetadata({
    description: title,
    locale,
    // A category page exists only where that category has published projects.
    locales: LOCALES.filter((entry) =>
      getProjectCategories(entry).some((entry_) => entry_ === category)
    ),
    path: `/projects/categories/${category}`,
    title,
  });
}

export default async function ProjectCategoryPage({
  params,
}: {
  params: Promise<{ category: string; locale: string }>;
}) {
  const { category, locale } = await params;
  setRequestLocale(locale);

  if (!isLocale(locale)) {
    notFound();
  }

  const projects = getProjectsByCategory(locale, category);

  if (projects.length === 0) {
    notFound();
  }

  const t = await getTranslations("projects");
  const tHome = await getTranslations("home");

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="font-mono text-2xl">
          {t("inCategory", { category: t(`category.${category}`) })}
        </h1>
        <Link
          className="inline-block font-mono text-muted-foreground text-sm underline underline-offset-4"
          href="/projects"
        >
          {t("backToProjects")}
        </Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard
            actionLabel={tHome("viewProject")}
            category={project.category}
            description={project.description}
            // The page title is the only heading above the grid here.
            headingLevel="h2"
            key={project.slug}
            preview={project.preview}
            slug={project.slug}
            title={project.title}
            type={project.type}
          />
        ))}
      </div>
    </div>
  );
}
