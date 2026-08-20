import { CloudImage } from "@/components/site/cloud-image";

/**
 * The way to put an image in a post or project body.
 *
 * Markdown's `![]()` syntax cannot be used for these: velite resolves that src
 * against the filesystem and copies it, so a Cloudinary id fails the build with
 * ENOENT. Declaring the id and the intrinsic size here also lets the space be
 * reserved before the image loads.
 */
export function PostImage({
  publicId,
  alt,
  width,
  height,
  caption,
}: {
  publicId: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}) {
  return (
    <figure className="my-6">
      <CloudImage
        className="w-full rounded-md border border-border"
        image={{ alt, height, publicId, width }}
        sizes="(max-width: 768px) 100vw, 640px"
      />
      {caption ? (
        <figcaption className="mt-2 text-muted-foreground text-xs">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
