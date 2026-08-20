"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import type { PlaygroundProps } from "@/components/mdx/playground/types";

function Skeleton() {
  const t = useTranslations("playground");

  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="playground-skeleton"
      // Reserves the height the real editor will take, so the article does not
      // jump when the chunk arrives.
      style={{ minHeight: "22rem" }}
    >
      <span className="font-mono text-muted-foreground text-xs">
        {t("loading")}
      </span>
    </div>
  );
}

/**
 * Sandpack is heavy, and most posts never use it. `ssr: false` keeps it out of
 * the server render and `dynamic` keeps it in its own chunk, fetched only when
 * a post actually renders a playground.
 *
 * `ssr: false` is only legal inside a client component, which is why this thin
 * wrapper exists instead of calling `dynamic` from the MDX map directly.
 */
const PlaygroundInner = dynamic(
  () => import("@/components/mdx/playground/playground-inner"),
  { loading: () => <Skeleton />, ssr: false }
);

/**
 * Declare the files from MDX as a map of path to source. Paths are relative to
 * the sandbox root and must start with `/`:
 *
 * ```mdx
 * <Playground
 *   template="static"
 *   title="A tooltip that follows the cursor"
 *   files={{
 *     "/index.html": `<button id="b">Hover me</button>`,
 *     "/styles.css": `button { padding: 8px 12px }`,
 *     "/index.js": `document.getElementById("b").onclick = () => {}`,
 *   }}
 * />
 * ```
 *
 * Templates:
 * - `static`  — plain HTML/CSS/JS, no bundler. Entry is `/index.html`.
 * - `vanilla` — bundled JS modules. Entry is `/index.js`, mounted by `/index.html`.
 * - `react`   — JSX with react and react-dom. Entry is `/App.js`.
 *
 * A file can also be an object to control the editor: `{ code, hidden, active,
 * readOnly }`. Use `hidden: true` for scaffolding the reader should not see and
 * `active: true` to choose which tab opens first.
 */
export function Playground(props: PlaygroundProps) {
  return <PlaygroundInner {...props} />;
}
