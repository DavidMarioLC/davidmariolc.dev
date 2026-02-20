import Image from "next/image";
import Link from "next/link";

import { projects } from "@/.velite";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ProjectsPage() {
  const sortedProjects = projects.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="container mx-auto pt-40 pb-12 px-4">
      <h1 className="font-bold text-3xl lg:text-4xl xl:text-5xl/relaxed mb-4 text-center lg:mb-8">
        Proyectos
      </h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3  gap-16 lg:gap-8 py-16 max-w-300 mx-auto">
        {sortedProjects.map((project) => (
          <article key={project.slug} className="relative">
            <Link
              href={project.permalink}
              className="flex relative mask-[url('/project-mask.webp')] mask-[0%_0%] mask-size-[100%_100%] mask-no-repeat h-54   md:h-72 lg:h-102 xl:h-72 overflow-hidden"
            >
              <Image
                className="cursor-pointer absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-800 ease-[cubic-bezier(.215,.61,.355,1)]"
                src={project.cover}
                alt={project.title}
                width={project.cover.width}
                height={project.cover.height}
                blurDataURL={project.cover.blurDataURL}
                placeholder="blur"
              />
            </Link>
            <div className="flex flex-col-reverse  pt-4">
              <div className="my-4 flex gap-4 lg:absolute lg:-top-8 lg:right-2">
                {project.technologies.map((tech) => (
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
              <h2 className="font-bold text-lg">{project.title}</h2>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
