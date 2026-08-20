import { ArrowUpRight } from "lucide-react";
import type { CloudImageSource } from "@/components/site/cloud-image";
import { CloudImage } from "@/components/site/cloud-image";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  logo: CloudImageSource;
  name: string;
  participation: string;
  url?: string;
  year: number;
}

function Body({ name, participation, year, logo, url }: Props) {
  return (
    <>
      <CloudImage className="size-12 rounded-sm" image={logo} sizes="48px" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-sm">{name}</p>
        <p className="text-muted-foreground text-xs uppercase tracking-wide">
          {participation}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2 text-muted-foreground text-sm">
        <span>{year}</span>
        {url ? <ArrowUpRight aria-hidden="true" className="size-4" /> : null}
      </div>
    </>
  );
}

export function AchievementRow(props: Props) {
  const shared = "flex flex-row items-center gap-4 rounded-md p-4";

  // Card renders a div and takes no render prop, so the anchor wraps it.
  if (props.url) {
    return (
      <a
        className="block rounded-md"
        href={props.url}
        rel="noopener noreferrer"
        target="_blank"
      >
        <Card className={cn(shared, "transition-colors hover:bg-accent")}>
          <Body {...props} />
        </Card>
      </a>
    );
  }

  return (
    <Card className={shared}>
      <Body {...props} />
    </Card>
  );
}
