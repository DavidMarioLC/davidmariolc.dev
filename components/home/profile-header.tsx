import type { CloudImageSource } from "@/components/site/cloud-image";
import { CloudImage } from "@/components/site/cloud-image";

export function ProfileHeader({
  name,
  country,
  countryFlag,
  avatar,
}: {
  name: string;
  country: string;
  countryFlag: string;
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
        <span aria-label={country} role="img" title={country}>
          {countryFlag}
        </span>
      </h1>
    </div>
  );
}
