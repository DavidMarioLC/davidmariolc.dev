import { ArrowUpRight } from "lucide-react";
import type { CloudImageSource } from "@/components/site/cloud-image";
import { CloudImage } from "@/components/site/cloud-image";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

interface Props {
  logo: CloudImageSource;
  name: string;
  participation: string;
  url?: string;
  year: number;
}

export function AchievementRow({
  name,
  participation,
  year,
  logo,
  url,
}: Props) {
  return (
    <Item
      className="rounded-md bg-card"
      render={
        url ? (
          // biome-ignore lint/a11y/useAnchorContent: Item passes its children into the rendered anchor.
          <a href={url} rel="noopener noreferrer" target="_blank" />
        ) : undefined
      }
      variant="outline"
    >
      <ItemMedia className="size-12 rounded-sm" variant="image">
        <CloudImage className="size-12 rounded-sm" image={logo} sizes="48px" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{name}</ItemTitle>
        <ItemDescription className="text-xs uppercase tracking-wide">
          {participation}
        </ItemDescription>
      </ItemContent>
      <ItemActions className="text-muted-foreground text-sm">
        <span>{year}</span>
        {url ? <ArrowUpRight aria-hidden="true" className="size-4" /> : null}
      </ItemActions>
    </Item>
  );
}
