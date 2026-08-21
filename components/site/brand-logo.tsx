import Image from "next/image";
import { resolveLogo } from "@/lib/logo-registry";
import { cn } from "@/lib/utils";

/**
 * Renders nothing when the brand has no mark, so callers can always place it
 * next to a name without leaving a gap or a placeholder icon.
 */
export function BrandLogo({
  name,
  className,
  mono = false,
}: {
  name?: string;
  className?: string;
  /**
   * Drops the brand colors so the mark inherits the surrounding text color.
   * Use it where the logo is a bullet next to a label rather than the subject
   * — and only for marks whose file is a transparent silhouette, since a logo
   * with an opaque background flattens into a solid block.
   */
  mono?: boolean;
}) {
  const logo = resolveLogo(name);

  if (!logo) {
    return null;
  }

  if (logo.kind === "image") {
    // A file-backed mark has no markup to recolor, so its alpha channel becomes
    // a mask over a `currentColor` fill instead.
    if (mono) {
      return (
        <span
          aria-hidden="true"
          className={cn("inline-block bg-current", className)}
          style={{
            // The span has no intrinsic size, so the mark's own ratio has to
            // come from the registry for `w-auto` to have anything to resolve.
            aspectRatio: `${logo.entry.width} / ${logo.entry.height}`,
            maskImage: `url(${logo.entry.src})`,
            maskPosition: "center",
            maskRepeat: "no-repeat",
            maskSize: "contain",
          }}
        />
      );
    }

    return (
      <Image
        alt=""
        className={cn("object-contain", className)}
        height={logo.entry.height}
        src={logo.entry.src}
        width={logo.entry.width}
      />
    );
  }

  const Svg = logo.entry;

  return (
    <Svg
      aria-hidden="true"
      className={cn(mono && "[&_*]:fill-current", className)}
    />
  );
}
