"use client";

import dynamic from "next/dynamic";
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
 */
export const animations: Record<string, ComponentType> = {
  "dip-inverted-arrow": dynamic(
    () => import("@/components/mdx/animations/dip-inverted-arrow"),
    {
      loading: () => <Skeleton />,
      ssr: false,
    }
  ),
  "jwt-login": dynamic(() => import("@/components/mdx/animations/jwt-login"), {
    loading: () => <Skeleton />,
    ssr: false,
  }),
  "jwt-logout": dynamic(
    () => import("@/components/mdx/animations/jwt-logout"),
    {
      loading: () => <Skeleton />,
      ssr: false,
    }
  ),
  "jwt-refresh": dynamic(
    () => import("@/components/mdx/animations/jwt-refresh"),
    { loading: () => <Skeleton />, ssr: false }
  ),
  "jwt-validation": dynamic(
    () => import("@/components/mdx/animations/jwt-validation"),
    { loading: () => <Skeleton />, ssr: false }
  ),
  "micro-frontends-deploy-coupling": dynamic(
    () => import("@/components/mdx/animations/micro-frontends-deploy-coupling"),
    { loading: () => <Skeleton />, ssr: false }
  ),
  "micro-frontends-spectrum": dynamic(
    () => import("@/components/mdx/animations/micro-frontends-spectrum"),
    { loading: () => <Skeleton />, ssr: false }
  ),
  "module-federation-flow": dynamic(
    () => import("@/components/mdx/animations/module-federation-flow"),
    { loading: () => <Skeleton />, ssr: false }
  ),
  "srp-reasons-to-change": dynamic(
    () => import("@/components/mdx/animations/srp-reasons-to-change"),
    {
      loading: () => <Skeleton />,
      ssr: false,
    }
  ),
};

export type AnimationId = keyof typeof animations;
