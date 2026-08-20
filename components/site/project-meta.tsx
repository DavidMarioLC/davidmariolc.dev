import { useTranslations } from "next-intl";
import type { Project } from "#site/content";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * What kind of project this is, in one line: its category, and whether it
 * shipped to someone or was built to learn something. Both are slugs in the
 * content, so the visible label lives in the message catalogs and a project
 * carries the same value in every locale.
 */
export function ProjectMeta({
  category,
  className,
  type,
}: {
  category: Project["category"];
  className?: string;
  type: Project["type"];
}) {
  const t = useTranslations("projects");

  return (
    <p className={cn("font-mono text-muted-foreground text-xs", className)}>
      <Link
        className="underline underline-offset-4 hover:text-foreground"
        href={`/projects/categories/${category}`}
      >
        {t(`category.${category}`)}
      </Link>
      <span aria-hidden="true"> · </span>
      <span>{t(`type.${type}`)}</span>
    </p>
  );
}
