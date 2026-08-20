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
}: {
  name?: string;
  className?: string;
}) {
  const logo = resolveLogo(name);

  if (!logo) {
    return null;
  }

  if (logo.kind === "image") {
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

  return <Svg aria-hidden="true" className={className} />;
}
