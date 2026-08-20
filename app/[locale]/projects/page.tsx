import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProjectCard } from "@/components/home/project-card";
import { routing } from "@/i18n/routing";
import { getProjects, isLocale } from "@/lib/content";
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

  const t = await getTranslations({ locale, namespace: "projects" });

  return pageMetadata({
    description: t("subtitle"),
    locale,
    path: "/projects",
    title: t("title"),
  });
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  if (!isLocale(locale)) {
    notFound();
  }

  const t = await getTranslations("projects");
  const tHome = await getTranslations("home");
  const projects = getProjects(locale);

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="font-mono text-2xl">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </header>

      {projects.length === 0 ? (
        <p className="text-muted-foreground text-sm">{t("empty")}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard
              actionLabel={tHome("viewProject")}
              description={project.description}
              // The page title is the only heading above the grid here.
              headingLevel="h2"
              key={project.slug}
              preview={project.preview}
              slug={project.slug}
              title={project.title}
            />
          ))}
        </div>
      )}
    </div>
  );
}
