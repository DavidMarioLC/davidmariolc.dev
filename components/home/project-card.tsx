import type { CloudImageSource } from "@/components/site/cloud-image";
import { CloudImage } from "@/components/site/cloud-image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "@/i18n/routing";

/**
 * `CardTitle` and `CardDescription` render divs, so the heading is a real
 * heading. Its level is a prop because the card sits under a section heading on
 * the home page and directly under the page title on the index, and a card
 * cannot know which without being told.
 */
export function ProjectCard({
  slug,
  title,
  description,
  preview,
  actionLabel,
  headingLevel: Heading = "h3",
}: {
  slug: string;
  title: string;
  description: string;
  preview: CloudImageSource;
  actionLabel: string;
  headingLevel?: "h2" | "h3";
}) {
  return (
    <Card className="gap-0 overflow-hidden rounded-md p-0">
      <CloudImage
        className="aspect-video w-full"
        image={preview}
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <Heading className="font-mono text-base">{title}</Heading>
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
