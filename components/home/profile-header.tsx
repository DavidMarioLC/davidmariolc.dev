import { PeruFlag } from "@/components/home/peru-flag";
import type { CloudImageSource } from "@/components/site/cloud-image";
import { CloudImage } from "@/components/site/cloud-image";

export function ProfileHeader({
  name,
  country,
  avatar,
}: {
  name: string;
  country: string;
  avatar: CloudImageSource;
}) {
  return (
    <div className="flex items-center gap-3">
      <CloudImage
        className="size-10 rounded-full"
        image={avatar}
        priority
        sizes="40px"
      />
      <h1 className="flex items-center gap-2 font-mono text-xl">
        {name}
        <span
          aria-label={country}
          className="relative -translate-y-0.5"
          role="img"
          title={country}
        >
          <PeruFlag className="mx-0.5 mb-0.5 inline-block h-3.5 w-5 align-text-bottom" />
        </span>
      </h1>
    </div>
  );
}
