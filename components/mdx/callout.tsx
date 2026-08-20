import { Check, Info, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

const VARIANTS = {
  info: Info,
  tip: Check,
  warning: TriangleAlert,
} as const;

export type CalloutType = keyof typeof VARIANTS;

/**
 * An aside for advice, context and gotchas. The variant only carries meaning
 * through colour on screen, so the accessible name states it in words.
 *
 * Colour comes from a per-variant custom property rather than a set of classes,
 * so the border, tint and icon can never drift apart.
 */
export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}) {
  const t = useTranslations("callout");
  const Icon = VARIANTS[type];

  return (
    <aside
      aria-label={title ? `${t(type)}: ${title}` : t(type)}
      className="callout"
      data-variant={type}
    >
      <span aria-hidden="true" className="callout-icon">
        <Icon className="size-3.5" />
      </span>
      {title ? <p className="callout-title">{title}</p> : null}
      {children}
    </aside>
  );
}
