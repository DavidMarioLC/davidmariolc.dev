import type { ReactNode } from "react";
import { BrandLogo } from "@/components/site/brand-logo";
import { Card } from "@/components/ui/card";

interface Entry {
  logo?: string;
  name: string;
}

interface Item {
  entries: Entry[];
  label: string;
  value?: string;
}

/**
 * A titled group of setup items. The two shapes below are what goes inside it.
 */
export function SetupBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={`setup-${title}`}>
      <h2 className="font-mono text-xl" id={`setup-${title}`}>
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

/**
 * Hardware: a card per item, because the value is a product name that reads as
 * a thing rather than as one of a list.
 */
export function HardwareGrid({ items }: { items: Item[] }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <Card className="gap-1 rounded-md p-4" key={item.label}>
          <dt className="font-medium text-sm">{item.label}</dt>
          <dd className="text-muted-foreground text-sm">{item.value}</dd>
        </Card>
      ))}
    </dl>
  );
}

/**
 * Everything else: a row per category, its entries listed on the right.
 *
 * The separators are real commas in the text rather than styling, so the row is
 * read as a list of names and not as one run-on word.
 */
export function EntryRows({ items }: { items: Item[] }) {
  return (
    <dl>
      {items.map((item) => (
        <div
          className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-border border-b py-4 last:border-b-0"
          key={item.label}
        >
          <dt className="text-muted-foreground text-sm">{item.label}</dt>
          <dd className="flex flex-wrap items-center justify-end gap-x-1.5 gap-y-2 text-sm">
            {item.entries.map((entry, index) => (
              <span
                className="inline-flex items-center gap-1.5"
                key={entry.name}
              >
                <BrandLogo className="h-4 w-auto shrink-0" name={entry.logo} />
                <span className="font-medium">
                  {entry.name}
                  {index < item.entries.length - 1 ? "," : ""}
                </span>
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}
