import Link from "next/link";
import { projects } from "#site/content";
import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";

export const Projects = () => {
  const sortedProjects = projects.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const threeProjects = sortedProjects.slice(0, 3);

  return (
    <section className="py-20 lg:py-32 px-4">
      <div className="max-w-170 mx-auto text-center">
        <h2 className="font-bold text-3xl lg:text-4xl xl:text-5xl/relaxed mb-4">
          Mis Proyectos
        </h2>
        <p className="text-muted-foreground lg:text-lg/relaxed xl:text-xl/relaxed">
          Un vistazo cercano a los proyectos en los que he estado trabajando y
          las tecnologías que he utilizado.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3  gap-16 lg:gap-8 py-16 max-w-300 mx-auto">
        {threeProjects.map((project) => (
          <ProjectCard
            key={project.slug}
            title={project.title}
            slug={project.slug}
            permalink={project.permalink}
            technologies={project.technologies}
            cover={project.cover}
          />
        ))}
      </div>
      <p className="text-center mt-2">
        <Button className="text-lg px-4 py-6 rounded-2xl" asChild>
          <Link href="/projects">Ver todos los proyectos</Link>
        </Button>
      </p>
    </section>
  );
};
