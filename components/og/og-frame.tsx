import type { ReactElement } from "react";

export const OG_SIZE = { height: 630, width: 1200 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * The shared frame for every generated preview: same dark ground, same accent
 * rule, same footer, so a shared link is recognisable before the title is read.
 *
 * `ImageResponse` runs a subset of CSS - no cascade, no classes - so the styles
 * are inline on purpose and every flex container states its direction.
 */
export function OgFrame({
  eyebrow,
  title,
  description,
}: {
  description?: string;
  eyebrow?: string;
  title: string;
}): ReactElement {
  return (
    <div
      style={{
        backgroundColor: "#0a0a0a",
        color: "#fafafa",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        padding: 72,
        width: "100%",
      }}
    >
      <div style={{ backgroundColor: "#fbbf24", height: 8, width: 120 }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {eyebrow ? (
          <div style={{ color: "#fbbf24", fontSize: 28, letterSpacing: 2 }}>
            {eyebrow.toUpperCase()}
          </div>
        ) : null}
        <div style={{ fontSize: 64, lineHeight: 1.1 }}>{title}</div>
        {description ? (
          <div style={{ color: "#a3a3a3", fontSize: 30, lineHeight: 1.4 }}>
            {description}
          </div>
        ) : null}
      </div>

      <div style={{ color: "#a3a3a3", display: "flex", fontSize: 28 }}>
        davidmariolc.dev
      </div>
    </div>
  );
}
