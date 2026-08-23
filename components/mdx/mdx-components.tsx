import { useTranslations } from "next-intl";
import type { ComponentPropsWithoutRef } from "react";
import { Callout } from "@/components/mdx/callout";
import { Challenge } from "@/components/mdx/challenge";
import { CodeBlock } from "@/components/mdx/code-block";
import { CommandCompare } from "@/components/mdx/command-compare";
import { ConceptAnimation } from "@/components/mdx/concept-animation";
import { Gallery } from "@/components/mdx/gallery";
import { MdxLink } from "@/components/mdx/mdx-link";
import { Playground } from "@/components/mdx/playground/playground";
import { VanillaPlayground } from "@/components/mdx/playground/vanilla-playground";
import { PostImage } from "@/components/mdx/post-image";
import { TokenAnatomy } from "@/components/mdx/token-anatomy";

/**
 * Markdown image syntax is a trap here: velite resolves its src against the
 * filesystem, so a Cloudinary id fails the build with a confusing ENOENT.
 * Failing here says what to do instead.
 */
function MdxImage({ src }: ComponentPropsWithoutRef<"img">) {
  throw new Error(
    `Markdown image syntax is not supported in content bodies (found "${src ?? "(no src)"}"). Use <PostImage publicId="…" alt="…" width={…} height={…} /> instead.`
  );
}

/**
 * rehype-pretty-code wraps every fenced block in a figure. Anything else that
 * reaches here is an author-written figure and is left alone.
 */
function Figure({ children, ...props }: ComponentPropsWithoutRef<"figure">) {
  if ("data-rehype-pretty-code-figure" in props) {
    return <CodeBlock {...props}>{children}</CodeBlock>;
  }

  return <figure {...props}>{children}</figure>;
}

/**
 * Keeps a wide table inside its own scroll container, not the document's.
 *
 * The container is focusable and named: a region that scrolls has to be
 * reachable by keyboard, or its overflowing columns are only available to
 * someone with a pointer.
 */
function Table(props: ComponentPropsWithoutRef<"table">) {
  const t = useTranslations("table");

  return (
    <section
      aria-label={t("scrollHint")}
      className="table-wrapper"
      // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region must be focusable, or its overflowing columns are reachable only with a pointer
      tabIndex={0}
    >
      <table {...props} />
    </section>
  );
}

/**
 * The explicit allowlist for MDX bodies. Anything a post or project can use
 * lives here; an unregistered component fails the build rather than rendering
 * as an unknown tag.
 */
export const mdxComponents = {
  a: MdxLink,
  Callout,
  Challenge,
  CommandCompare,
  ConceptAnimation,
  figure: Figure,
  Gallery,
  img: MdxImage,
  Playground,
  PostImage,
  TokenAnatomy,
  table: Table,
  VanillaPlayground,
};
