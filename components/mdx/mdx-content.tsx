import type { ComponentType } from "react";
// biome-ignore lint/performance/noNamespaceImport: the compiled MDX factory receives the whole jsx-runtime
import * as runtime from "react/jsx-runtime";
import { mdxComponents } from "@/components/mdx/mdx-components";

/**
 * Velite compiles MDX to a function body rather than a module, so it is
 * evaluated here. The source is repository content compiled at build time,
 * never user input.
 */
function useMdxComponent(code: string) {
  const factory = new Function(code);

  return factory({ ...runtime }).default as ComponentType<{
    components: typeof mdxComponents;
  }>;
}

export function Mdx({ code }: { code: string }) {
  const Component = useMdxComponent(code);

  return <Component components={mdxComponents} />;
}
