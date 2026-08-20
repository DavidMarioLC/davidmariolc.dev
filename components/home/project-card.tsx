import type { CloudImageSource } from "@/components/site/cloud-image";
import { CloudImage } from "@/components/site/cloud-image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "@/i18n/routing";

/**
 * `CardTitle` and `CardDescription` render divs, so the heading is a real `h3`
 * here: the projects grid has to keep its place in the heading outline.
 */
export function ProjectCard({
  slug,
  title,
  description,
  preview,
  actionLabel,
}: {
  slug: string;
  title: string;
  description: string;
  preview: CloudImageSource;
  actionLabel: string;
}) {
  return (
    <Card className="gap-0 overflow-hidden rounded-md p-0">
      <CloudImage
        className="aspect-video w-full"
        image={preview}
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-mono text-base">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </CardContent>
      <CardFooter className="border-border border-t p-4">
        <Button
          className="w-full rounded-md"
          nativeButton={false}
          render={
            <Link
              aria-label={`${actionLabel}: ${title}`}
              href={`/projects/${slug}`}
            >
              {actionLabel}
            </Link>
          }
        />
      </CardFooter>
    </Card>
  );
}
