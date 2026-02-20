import Image from "next/image";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ProjectCardProps = {
  title: string;
  slug: string;
  permalink: string;
  technologies: string[];
  cover: {
    width: number;
    height: number;
    blurDataURL: string;
    src: string;
  };
};

export const ProjectCard = ({
  title,
  slug,
  permalink,
  technologies,
  cover,
}: ProjectCardProps) => {
  const { src, width, height, blurDataURL } = cover;
  return (
    <article key={slug} className="relative">
      <Link
        href={permalink}
        className="flex relative mask-[url('/project-mask.webp')] mask-[0%_0%] mask-size-[100%_100%] mask-no-repeat h-54   md:h-72 lg:h-102 xl:h-72 overflow-hidden"
      >
        <Image
          className="cursor-pointer absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-800 ease-[cubic-bezier(.215,.61,.355,1)]"
          src={src}
          alt={title}
          width={width}
          height={height}
          blurDataURL={blurDataURL}
          placeholder="blur"
        />
      </Link>
      <div className="flex flex-col-reverse  pt-4">
        <div className="my-4 flex gap-4 lg:absolute lg:-top-8 lg:right-2">
          {technologies.map((tech) => (
            <Tooltip key={tech}>
              <TooltipTrigger asChild>
                <Image
                  unoptimized
                  key={tech}
                  alt={tech}
                  width={24}
                  height={24}
                  src={`/technologies/${tech}.svg`}
                  className="cursor-pointer w-6 h-6"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{tech}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        <h2 className="font-bold text-lg">{title}</h2>
      </div>
    </article>
  );
};
