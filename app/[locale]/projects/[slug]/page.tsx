import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mdx } from "@/components/mdx/mdx-content";
import { BrandLogo } from "@/components/site/brand-logo";
import { CloudImage } from "@/components/site/cloud-image";
import { Button } from "@/components/ui/button";
import { routing } from "@/i18n/routing";
import {
  getProject,
  getProjects,
  isLocale,
  translatedLocales,
} from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

// A slug that was never generated is a 404, not a page rendered on demand.
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getProjects(locale).map((project) => ({ locale, slug: project.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const project = getProject(locale, slug);

  if (!project) {
    return {};
  }

  return pageMetadata({
    description: project.description,
    image: `/${locale}/projects/${slug}/opengraph-image`,
    locale,
    locales: translatedLocales("projects", slug),
    path: `/projects/${slug}`,
    title: project.title,
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!isLocale(locale)) {
    notFound();
  }

  const project = getProject(locale, slug);

  if (!project) {
    notFound();
  }

  const t = await getTranslations("projects");
  const links = [
    { href: project.links.live, label: t("live") },
    { href: project.links.repository, label: t("repository") },
  ].filter((link): link is { href: string; label: string } =>
    Boolean(link.href)
  );

  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <h1 className="font-mono text-2xl">{project.title}</h1>
        <p className="text-muted-foreground">{project.description}</p>
      </header>

      {project.stack.length > 0 && (
        <section>
          <h2 className="font-mono text-sm">{t("stack")}</h2>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {project.stack.map((tech) => (
              <li className="flex items-center gap-2" key={tech.name}>
                <BrandLogo className="size-4 shrink-0" name={tech.logo} />
                <span>{tech.name}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {links.length > 0 && (
        <ul className="flex flex-wrap gap-3">
          {links.map((link) => (
            <li key={link.href}>
              <Button
                className="rounded-md"
                nativeButton={false}
                render={
                  <a href={link.href} rel="noopener noreferrer" target="_blank">
                    {link.label}
                    <ArrowUpRight aria-hidden="true" data-icon="inline-end" />
                  </a>
                }
                variant="outline"
              />
            </li>
          ))}
        </ul>
      )}

      <CloudImage
        className="aspect-video w-full rounded-md border border-border"
        image={project.preview}
        priority
        sizes="(max-width: 768px) 100vw, 640px"
      />

      <div className="prose">
        <Mdx code={project.content} />
      </div>
    </article>
  );
}
