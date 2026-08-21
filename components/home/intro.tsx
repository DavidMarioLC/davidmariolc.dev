import { BrandLogo } from "@/components/site/brand-logo";
import { cn } from "@/lib/utils";

interface Run {
  emphasis: boolean;
  id: string;
  logo?: string;
  text: string;
  url?: string;
}

/**
 * A run carrying a logo renders as one inline unit so the mark and its name
 * never wrap apart, and the whole unit is a single link target when it has a URL.
 */
function IntroRun({ run }: { run: Run }) {
  if (run.url) {
    return (
      <a
        className="inline-flex items-baseline gap-1 whitespace-nowrap rounded-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-brand"
        href={run.url}
        rel="noopener noreferrer"
        target="_blank"
      >
        <BrandLogo className="h-4 w-auto translate-y-0.5" name={run.logo} />
        <span>{run.text}</span>
      </a>
    );
  }

  if (run.logo) {
    return (
      <span className="inline-flex items-baseline gap-1 whitespace-nowrap font-medium text-foreground">
        <BrandLogo className="h-4 w-auto translate-y-0.5" name={run.logo} />
        <span>{run.text}</span>
      </span>
    );
  }

  return (
    <span className={cn(run.emphasis && "font-semibold text-brand")}>
      {run.text}
    </span>
  );
}

export function Intro({ paragraphs }: { paragraphs: { runs: Run[] }[] }) {
  return (
    <div className="space-y-5 text-muted-foreground leading-relaxed">
      {paragraphs.map((paragraph) => (
        <p key={paragraph.runs.map((run) => run.text).join("")}>
          {paragraph.runs.map((run) => (
            <IntroRun key={run.id} run={run} />
          ))}
        </p>
      ))}
    </div>
  );
}
