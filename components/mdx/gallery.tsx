import type { ReactNode } from "react";

/**
 * A set of images that belong together, laid out as a grid instead of a column.
 *
 * Each child stays a `<PostImage>` and keeps its own caption: the gallery only
 * arranges them. `auto-fit` means the count is decided by the available width,
 * so a lone image fills the row instead of sitting in half of one, and the
 * children's own vertical rhythm is dropped here to leave a single gap.
 */
export function Gallery({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] items-start gap-4 [&>figure]:my-0">
      {children}
    </div>
  );
}
