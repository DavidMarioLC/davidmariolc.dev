"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

/**
 * The allowlist of concept animations, and the only place an id becomes code.
 *
 * It mirrors the choice `mdxComponents` already makes for components: an
 * explicit list, and a loud failure at build time for anything not on it. A
 * template import (`import(`./${id}`)`) would save this file at the cost of the
 * bundler preparing a chunk per file in the directory and a bad id failing only
 * in the browser.
 *
 * The file is `.tsx` rather than `.ts` because each entry carries its own
 * loading skeleton.
 */

function Skeleton() {
  const t = useTranslations("conceptAnimation");

  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="concept-animation-skeleton"
      // Reserves roughly the height the animation will take, so the paragraph
      // below it does not jump when the chunk arrives.
      style={{ minHeight: "26rem" }}
    >
      <span className="font-mono text-muted-foreground text-xs">
        {t("loading")}
      </span>
    </div>
  );
}

/**
 * GSAP and the diagram are dead weight for every post that animates nothing, so
 * they travel in their own chunk. `ssr: false` is only legal inside a client
 * component, which is why this module is one — the same reason `Playground`
 * has a thin client wrapper.
 */
export const animations = {
  "model-router": dynamic(
    () => import("@/components/mdx/animations/model-router"),
    { loading: () => <Skeleton />, ssr: false }
  ),
} as const;

export type AnimationId = keyof typeof animations;
