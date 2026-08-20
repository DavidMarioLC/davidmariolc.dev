// next-cloudinary's CldImage relies on client hooks, so the wrapper that owns
// it must be a client component. Its props stay serializable.
"use client";

import { CldImage } from "next-cloudinary";
import { cn } from "@/lib/utils";

export interface CloudImageSource {
  alt: string;
  height: number;
  publicId: string;
  width: number;
}

/**
 * Every content image goes through here, so the alt is never optional and a
 * change of image provider is a change to one file plus one schema field.
 */
export function CloudImage({
  image,
  className,
  sizes = "(max-width: 640px) 100vw, 640px",
  priority,
}: {
  image: CloudImageSource;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <CldImage
      alt={image.alt}
      className={cn("object-cover", className)}
      height={image.height}
      priority={priority}
      sizes={sizes}
      src={image.publicId}
      width={image.width}
    />
  );
}
