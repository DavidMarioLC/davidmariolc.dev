"use client";

import { animations } from "@/components/mdx/animations/registry";

/**
 * Embeds a concept animation in a post body — a diagram that *is* the
 * explanation, walked one step at a time by the reader.
 *
 * ```mdx
 * <ConceptAnimation id="model-router" />
 * ```
 *
 * The id is resolved through `animations/registry.tsx`, which also owns the
 * lazy loading. Everything an animation is — its steps, its timeline and its
 * SVG — lives in its own file under `animations/`.
 */
export function ConceptAnimation({ id }: { id: string }) {
  /**
   * Checked here, in the part that still prerenders, not inside the deferred
   * chunk. Every post page is generated at build time, so throwing on an
   * unregistered id fails the build naming it — the same trick `MdxImage` uses
   * for markdown image syntax. Inside the lazy chunk this would degrade into a
   * browser error nobody sees until production.
   */
  if (!(id in animations)) {
    const known = Object.keys(animations).join(", ");

    throw new Error(
      `Unknown ConceptAnimation id "${id}". Register it in components/mdx/animations/registry.tsx. Known ids: ${known || "(none registered)"}.`
    );
  }

  const Animation = animations[id as keyof typeof animations];

  return <Animation />;
}
