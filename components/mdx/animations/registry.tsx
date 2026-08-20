"use client";

import { useTranslations } from "next-intl";
import type { ComponentType } from "react";

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

/**
 * The loading state every entry hands to `dynamic`. Exported because it is part
 * of the shape of an entry, not an implementation detail of one: an animation
 * that reserves no space makes the paragraph under it jump when its chunk
 * lands.
 */
export function Skeleton() {
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
 *
 * Empty right now: every animation there was belonged to a post that no longer
 * exists. Annotated rather than inferred so that stays legal — `keyof` an empty
 * inferred object is `never`, which makes the lookup in `ConceptAnimation`
 * unusable. An entry looks like this:
 *
 *   "model-router": dynamic(
 *     () => import("@/components/mdx/animations/model-router"),
 *     { loading: () => <Skeleton />, ssr: false }
 *   ),
 */
export const animations: Record<string, ComponentType> = {};

export type AnimationId = keyof typeof animations;
