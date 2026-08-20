"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface Variant {
  command: string;
  exitCode: number;
  label: string;
  output: string;
}

function Run({ variant }: { variant: Variant }) {
  return (
    <div className="space-y-3 p-4">
      <p className="font-mono text-foreground text-xs">
        <span aria-hidden="true" className="text-muted-foreground">
          ${" "}
        </span>
        {variant.command}
      </p>
      <pre className="overflow-x-auto font-mono text-muted-foreground text-xs">
        {variant.output}
      </pre>
      <p className="font-mono text-xs">
        <span className="text-muted-foreground">exit </span>
        <span
          className={cn(
            variant.exitCode === 0 ? "text-muted-foreground" : "text-brand"
          )}
        >
          {variant.exitCode}
        </span>
      </p>
    </div>
  );
}

/**
 * Two runs of the same command, one at a time. Useful whenever a post turns on
 * a flag and the interesting part is what changes.
 *
 * Built on the shadcn tabs primitive rather than hand-rolled roles: the ARIA
 * tabs pattern owes the reader arrow-key navigation and a roving tabindex, and
 * declaring the roles without them is worse than using plain buttons.
 */
export function CommandCompare({
  variants,
  caption,
}: {
  variants: [Variant, Variant];
  caption?: string;
}) {
  return (
    <figure className="my-6 overflow-hidden rounded-md border border-border">
      <Tabs className="gap-0" defaultValue={variants[0].label}>
        <TabsList
          aria-label={caption}
          className="w-full rounded-none border-border border-b bg-transparent p-0"
        >
          {variants.map((variant) => (
            <TabsTrigger
              className="flex-1 rounded-none font-mono text-xs"
              key={variant.label}
              value={variant.label}
            >
              {variant.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {variants.map((variant) => (
          <TabsContent key={variant.label} value={variant.label}>
            <Run variant={variant} />
          </TabsContent>
        ))}
      </Tabs>

      {caption ? (
        <figcaption className="border-border border-t px-4 py-2 text-muted-foreground text-xs">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
